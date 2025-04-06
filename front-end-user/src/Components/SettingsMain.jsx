import React, { useEffect } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import MainPage from "./settingsComponent/MainPage";

const SettingsMain = ({ children }) => {
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
  const navigateToPage2 = () => {
    navigate("/coupen-user"); // Replace '/path-to-page' with the actual path
  };

  const handlePage = () => {
    navigate("/account");
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1}>
          <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#F95959",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "#ffffff", mr: 8 }}
                    onClick={() => navigate("/account")}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
               
                <Grid item xs={9}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ffffff",
                      fontSize: "1.2rem",
                      flexGrow: 1,
                      marginRight: "5rem"
                    }}
                    onClick={handlePage}
                  >
                    Settings Center
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
              
            {/* //content */}
            <MainPage />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default SettingsMain;