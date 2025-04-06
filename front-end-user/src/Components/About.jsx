import React from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Container,
    Divider,
  } from "@mui/material";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import ChevronRightIcon from "@mui/icons-material/ChevronRight";
  import DescriptionIcon from "@mui/icons-material/Description";
  import aboutus from "../assets/aboutus.jpeg";
  import Mobile from "./Mobile";
  import { useNavigate } from "react-router-dom";
  
  const AboutUsPage = () => {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate(-1); // Navigate to the previous page
    };
  
    return (
      <Mobile>
        <Container
          disableGutters
          maxWidth="xs"
          sx={{
            bgcolor: "#f5f5f5",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              bgcolor: "#F95959",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <IconButton
              edge="start"
              aria-label="back"
              onClick={handleBackClick}
              sx={{ color: "white" }}
            >
              <ChevronLeftIcon sx={{ fontSize: 30 }} />
            </IconButton>
  
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              About Us
            </Typography>
          </Box>
  
          {/* Placeholder for the image */}
          <Box
            component="img"
            src={aboutus}
            alt="About us illustration"
            sx={{
              width: "100%",
              height: "30%", // Adjust height for better visibility
              objectFit: "cover",
              mt: 1, // Margin top to add spacing
            }}
          />
  
          <List sx={{ flexGrow: 1 }}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="go to">
                  <ChevronRightIcon sx={{ fontSize: 30, color: "#4782ff" }} />
                </IconButton>
              }
              sx={{ padding: 2 }}
            >
              {/* <ListItemIcon>
                <DescriptionIcon sx={{ color: "#4782ff", fontSize: 24 }} />
              </ListItemIcon> */}
              <img src="https://in.piccdn123.com/static/_template_/orange/img/my/privacyIcon.png" style={{
                width:"25px",
                marginRight:"30px"
              }}/>
              <ListItemText primary="Confidentiality Agreement" />
            </ListItem>
            <Divider sx={{ mx: 2 }} />
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="go to">
                  <ChevronRightIcon sx={{ fontSize: 30, color: "#4782ff" }} />
                </IconButton>
              }
              sx={{ padding: 2 }}
            >
              {/* <ListItemIcon>
                <DescriptionIcon sx={{ color: "#4782ff", fontSize: 24 }} />
              </ListItemIcon> */}

            <img src="https://in.piccdn123.com/static/_template_/orange/img/my/riskProtocal.png" style={{
                width:"25px",
                marginRight:"30px"
              }}/>
              <ListItemText primary="Risk Acknowledgment and Disclosure Agreement" />
            </ListItem>
            <Divider sx={{ mx: 2 }} />
          </List>
        </Container>
      </Mobile>
    );
  };
  
  export default AboutUsPage;
  