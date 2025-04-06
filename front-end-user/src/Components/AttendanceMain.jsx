import React, { useEffect } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Attendance from "./attendanceComponent/Attendance";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const AttendanceMain = ({ children }) => {
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

  const handleRedirect = () => {
    navigate("/activity");
  };

  const handleDownload = () => {
    // Programmatically click the hidden anchor tag
    const link = document.createElement("a");
    link.href = `https://111club.online/abclottery.apk`; // Change this to the actual path of the APK file on your server
    link.download = "abclottery.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <Box flexGrow={1} sx={{ backgroundColor: "rgb(245,70,69)" }}>
          <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "linear-gradient(90deg,#F95959 0%, #F95959 100%)", // Background color for the header
                padding: "8px 16px",
                color: "white", // Text color to match the header background
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    sx={{ color: "white", ml: -5 }} // White icon color for visibility
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white", // White text color for consistency
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Attendance
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* //content */}
            <Attendance />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default AttendanceMain;
