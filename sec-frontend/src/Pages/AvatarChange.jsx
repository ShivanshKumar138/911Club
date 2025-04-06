import { Avatar, Box, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "../Components/Mobile";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {domain} from "../Components/config"
import axios from "axios"

const AvatarChange = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the full user avatar URL from location.state (if passed)
  const fullUserAvatar = location.state?.avatar || null;

  // Extract only the file name (e.g., profile-5.png) from the fullUserAvatar
  const userAvatarFile = fullUserAvatar ? fullUserAvatar.split('/').pop() : null;

  // Set user's current avatar as the default selected avatar (if available)
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatarFile);

  const images = [
    "/assets/profile-1.png",
    "/assets/profile-2.png",
    "/assets/profile-3.png",
    "/assets/profile-4.png",
    "/assets/profile-5.png",
    "/assets/profile-6.png",
    "/assets/profile-7.png",
    "/assets/profile-8.png",
    "/assets/profile-9.png",
    "/assets/profile-10.png",

  ];
  const handleImageClick = async(imageUrl) => {
    const imageFileName = imageUrl.split('/').pop();
    const token = sessionStorage.getItem('token');
    
    // Get the current window location origin
    const currentOrigin = window.location.origin;
    
    try {
        const response = await axios.put(
            `${domain}/user/avatar`,
            {
                // Use the current origin instead of hardcoded domain
                avatar: `${currentOrigin}/assets/${imageFileName}`,
            },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            setSelectedAvatar(imageFileName);
            console.log("Avatar updated:", `${currentOrigin}/assets/${imageFileName}`);
        }
    } catch (err) {
        console.error("Error updating avatar:", err);
    }
};
  const handleRedirect = () => {
    navigate(-1); 
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#F95959", py: 1 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "white", ml: -2 }} // White color for the icon
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "white", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Change Avatar
              </Typography>
            </Grid>
          </Grid>

          {/* Avatar Grid */}
          <Grid container spacing={2} sx={{ p: 2 }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: selectedAvatar === image.split('/').pop() ? "4px solid #F95959" : "none", // Highlight selected avatar by file name
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Avatar ${index + 1}`}
                    sx={{ width: "100%", height: "auto" }}
                  />
                  {selectedAvatar === image.split('/').pop() && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        color: "#F95959",
                        fontSize: 22,
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Mobile>
    </div>
  );
};

export default AvatarChange;