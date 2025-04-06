import React from "react";
import Mobile from "../Components/Mobile";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Container,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const GameProblem = () => {
  const [description, setDescription] = useState("");
  const [gameId, setGameId] = useState("");
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file)); // Preview Image
    }
  };

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("issue", description);
    formData.append("gameId", gameId);
    
    // Append Image File
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch("https://747lottery.fun  /create-game-problem", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response) {
        console.log(response);
        console.log(data);
        alert("Game Problem Ticket Created Successfully!");
        navigate(-1);
      } else {
        alert(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <Mobile>
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        {/* Header */}
        <AppBar position="static" sx={{ backgroundColor: "#FA6966", boxShadow: 1 }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", flexGrow: 1, textAlign: "center" }}
            >
              Game Problems
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Form Section */}
        <Container sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Description Field */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Explain the issue happened to you inside the game clearly and in detail
              </Typography>
              <TextField
                multiline
                rows={5}
                fullWidth
                placeholder="Please enter content"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ backgroundColor: "white", mt: 1 }}
              />
              <Typography variant="body2" sx={{ textAlign: "right", color: "#666" }}>
                {description.length}/500
              </Typography>
            </Box>

            {/* Game ID Field */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                GAME ID <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Please enter Game ID"
                variant="outlined"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                sx={{ backgroundColor: "white", mt: 1 }}
              />
            </Box>

            {/* Image Upload */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Attach photo / screenshot of the issue clearly
              </Typography>
              <Grid
                container
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: "white",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "1px dashed #aaa",
                  mt: 1,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="upload-receipt"
                />
                <label htmlFor="upload-receipt">
                  {image ? (
                    <img
                      src={image}
                      alt="Uploaded"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "#aaa",
                      }}
                    >
                      <CloudUploadIcon fontSize="large" />
                      <Typography variant="body2">Upload Photo</Typography>
                    </Box>
                  )}
                </label>
              </Grid>
            </Box>

            {/* Confirm Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#FA6966",
                color: "white",
                borderRadius: "30px",
                mt: 4,
                py: 1.5,
                fontSize: "16px",
              }}
            >
              Confirm
            </Button>
          </form>
        </Container>
      </Box>
    </Mobile>
  );
};

export default GameProblem;