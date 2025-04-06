import React, { useEffect } from "react";
import Mobile from "../Components/Mobile";
import IconButton from "@mui/material/IconButton";
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
import Vip from "./vip/VipMain";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useState } from "react";
import { domain } from "./config";
import axios from "axios";


const VipMain = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  const navigateToPage2 = () => {
    navigate("/coupen-user");
  };
  const navigateToPage3 = () => {
    navigate("/attendance");
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

  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/account");
  };

  const [lastAchievement, setLastAchievement] = useState(null);
  useEffect(() => {
    const fetchLastAchievement = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/last-achievement`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLastAchievement(response.data.lastAchievement);
      } catch (err) {
        console.error("Error fetching last achievement:", err);
      }
    };

    fetchLastAchievement();
  }, []);
  



  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#f2f2f1" }}>

              <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
                padding: "4px 8px",
                color: "black",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    onClick={handleRedirect}
                    sx={{ color: "white", ml: -5 }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Vip
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            

            {/* //content */}

            <Vip />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default VipMain;