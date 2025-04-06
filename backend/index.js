const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { promisify } = require("util");
require("dotenv").config();
const { cloudinaryConnect } = require("./config/cloudinary");
const logger = require("./middlewares/logger"); // Consider using a more efficient logger
const db = require("./db");
const { setupWebSocket } = require("./websockets/websocket");
const routes = require("./routes/Routes");
const practice = require("./routes/common/practice");
const user = require("./routes/common/userSchema");
const PORT = process.env.PORT || 5000;

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  // Middleware to handle unsupported Content-Encoding values
  app.use((req, res, next) => {
    const supportedEncodings = [
      "gzip",
      "compress",
      "deflate",
      "identity",
      "br",
    ];
    const encoding = req.headers["content-encoding"];

    if (encoding && !supportedEncodings.includes(encoding)) {
      console.warn(
        `Unsupported content encoding: ${encoding}. Removing header.`
      );
      delete req.headers["content-encoding"];
    }

    next();
  });

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Database connection
  try {
    console.log("Connecting to the database...");
    await db.connectDB();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }

  // Connect to Cloudinary
  try {
    console.log("Connecting to Cloudinary...");
    cloudinaryConnect();
    console.log("Connected to Cloudinary");
  } catch (err) {
    console.error("Failed to connect to Cloudinary:", err);
  }

  // WebSocket setup
  try {
    console.log("Setting up WebSocket...");
    setupWebSocket(server);
    console.log("WebSocket setup complete");
  } catch (err) {
    console.error("Failed to set up WebSocket:", err);
  }
  // Middleware to remove Content-Encoding: utf-8 header
  app.use((req, res, next) => {
    if (req.headers["content-encoding"] === "utf-8") {
      delete req.headers["content-encoding"];
    }
    next();
  });

  // Middleware
  app.use(helmet());
  app.use(compression()); // Ensure compression is enabled
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5176",
        "http://localhost:5175",
        "http://localhost:5174",
        "http://localhost:5147",
        "https://747lottery.fun",
        "https://747lottery.live",
        "https://747winplay.live",
        "https://admin.747lottery.fun",
        "https://747lottery.fun  ",
        "http://8.217.236.95",
        "https://8.217.236.95",
      ],
      credentials: true,
    })
  );

  // Static file serving with caching
  const cacheTime = 86400000 * 30; // 30 days
  app.use(express.static(path.join(__dirname, "build"), { maxAge: cacheTime }));
  app.use(
    "/admin",
    express.static(path.join(__dirname, "admin/build"), { maxAge: cacheTime })
  );
  app.use(
    express.static(path.join(__dirname, "public"), { maxAge: cacheTime })
  );

  // Logger middleware (consider using a more efficient logger like winston or pino)
  // app.use(logger);

  // Routes
  app.use(routes);
  app.use("/", practice);
  app.use("/", user);

  // Fallback route for the main app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error handling middleware:", err.stack);
    res.status(500).send("Something went wrong!");
  });

  // Start the server
  try {
    console.log("Starting the server...");
    await promisify(server.listen.bind(server))(PORT, "0.0.0.0");
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      db.disconnectDB().then(() => {
        console.log("Database connection closed");
        process.exit(0);
      });
    });
  });
}

startServer().catch((err) => {
  console.error("Failed to start the server:", err);
  process.exit(1);
});
