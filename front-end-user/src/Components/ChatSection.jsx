import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useParams } from "react-router-dom";
import { domain } from "./config";
import Mobile from "./Mobile";
import LoadingScreen from "./LoadingScreen";

const ChatZone = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/tickets/user/${ticketId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTicket(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        setLoading(false);
      }
    };
  
    fetchTicket();
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
  
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      await axios.post(
        `${domain}/tickets/user/${ticketId}/message`,
        { message },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("");
      // Re-fetch ticket data to update the messages
      const response = await axios.get(`${domain}/tickets/user/${ticketId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTicket(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <LoadingScreen />;

  if (!ticket) return <Typography>No ticket found</Typography>;

  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        bgcolor="#f2f2f1"
      >
        {/* Header */}
        <Box
          sx={{
            height: "10%",
            minHeight: 60,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            boxShadow: "0px 1px 5px rgba(0,0,0,0.1)",
          }}
        >
          <IconButton
            sx={{ color: "black" }}
            onClick={() => window.history.back()}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: "black",
              textAlign: "center",
              flexGrow: 1,
              marginRight: 48, // To center the title considering the back button width
            }}
          >
            Chat
          </Typography>
        </Box>

        {/* Messages Section */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            overflowY: "scroll",
            // Hide scrollbar while allowing scrolling
            scrollbarWidth: "none", // For Firefox
            "&::-webkit-scrollbar": {
              display: "none", // For Chrome, Safari, and Opera
            },
          }}
        >
          {ticket.messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.sender === "Admin" ? "flex-start" : "flex-end"
              }
              sx={{ mb: 1 }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "70%",
                  backgroundColor:
                    msg.sender === "Admin" ? "#e0e0e0" : "#4caf50",
                  color: msg.sender === "Admin" ? "black" : "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, display: "block", textAlign: "right" }}
                >
                  {new Date(msg.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            height: "10%",
            minHeight: 60,
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            fullWidth
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Mobile>
  );
};

export default ChatZone;
