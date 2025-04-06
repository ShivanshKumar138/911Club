import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Container,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MessagesMain = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous URL
  };

  const [user, setUser] = useState(null);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [expandedMessages, setExpandedMessages] = useState({});

  // Delete notification handler
  const handleDeleteNotification = async (notificationId, index) => {
    try {
      // Make a DELETE request to the backend API to delete the notification
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      await axios.delete(`${domain}/notifications/${notificationId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the user state to remove the notification from the UI
      const updatedNotifications = user.notifications.filter(
        (_, i) => i !== index
      );
      setUser((prevUser) => ({
        ...prevUser,
        notifications: updatedNotifications,
      }));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const toggleTitleExpansion = (index) => {
    setExpandedTitles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMessageExpansion = (index) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text, charLimit) => {
    return text.length > charLimit ? text.slice(0, charLimit) + "" : text;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/notifications`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{ bgcolor: "#f2f2f1", mb: 10 }}
        >
          <AppBar
            position="sticky"
            sx={{
              bgcolor: "#F95959", // Green background color
              boxShadow: "none",
            }}
          >
            <Toolbar>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={2} textAlign="left">
                  <IconButton color="inherit" onClick={handleBackClick}>
                    <ArrowBackIcon sx={{ color: "white" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={8} textAlign="center">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "white", fontWeight: "normal" }} // White text and normal font weight
                  >
                    Notifications
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  {/* This grid item is kept empty to align text centrally with icons */}
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Container sx={{ mb: 20, maxWidth: "600px" }}>
            {user &&
              user.notifications.map((notification, index) => (
                <Card
                  key={index}
                  sx={{
                    mt: 2, // Reduced margin to match the compact look in the image
                    borderRadius: 2,
                    boxShadow: "none",
                    backgroundColor: "#f8f9fa", // Changed background color for the card to match the image
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Title with Email Icon */}
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        <EmailIcon sx={{ mr: 1, color: "#F95959" }} />
                        <Typography
                          variant="h6"
                          component="div"
                          color="black"
                          fontWeight="bold"
                          sx={{
                            wordBreak: "break-word",
                            textTransform: "uppercase",
                            fontSize: "1rem",
                          }}
                        >
                          {expandedTitles[index]
                            ? notification.title.toUpperCase()
                            : truncateText(
                                notification.title.toUpperCase(),
                                20
                              )}
                          {!expandedTitles[index] &&
                            notification.title.length > 20 && (
                              <Button
                                onClick={() => toggleTitleExpansion(index)}
                                sx={{
                                  color: "black",
                                  textTransform: "none",
                                  padding: 0,
                                  minWidth: "unset",
                                }}
                              >
                                ...
                              </Button>
                            )}
                        </Typography>
                      </Grid>

                      {/* Delete Icon */}
                      <Grid item>
                        <Button
                          onClick={() =>
                            handleDeleteNotification(notification._id, index)
                          }
                          sx={{ minWidth: "unset", padding: 0 }}
                        >
                          <DeleteIcon sx={{ color: "#F95959" }} />
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Date */}
                    <Typography
                      variant="body2"
                      color="grey"
                      textAlign="left"
                      sx={{
                        mt: 1,
                        wordBreak: "break-word",
                        fontSize: "0.9rem", // Slightly smaller font size
                      }}
                    >
                      {new Date(notification.date).toLocaleString()}{" "}
                      {/* Changed to include time */}
                    </Typography>

                    {/* Message with Show More/Less */}
                    <Typography
                      variant="body2"
                      color="grey"
                      sx={{ wordBreak: "break-word", mt: 1, textAlign: "left" }}
                    >
                      {expandedMessages[index]
                        ? notification.message
                        : truncateText(notification.message, 50)}
                      {notification.message.length > 50 &&
                        !expandedMessages[index] && (
                          <Button
                            onClick={() => toggleMessageExpansion(index)}
                            sx={{
                              color: "#4782ff",
                              textTransform: "none",
                              padding: 0,
                              ml: 0,
                            }}
                          >
                            Show more
                          </Button>
                        )}
                    </Typography>
                    {expandedMessages[index] && (
                      <Grid container justifyContent="flex-end" sx={{ mt: 0 }}>
                        <Button
                          onClick={() => toggleMessageExpansion(index)}
                          sx={{
                            color: "#4782ff",
                            textTransform: "none",
                            padding: 0,
                            mr: 1,
                          }}
                        >
                          Show less
                        </Button>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              ))}
          </Container>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default MessagesMain;
