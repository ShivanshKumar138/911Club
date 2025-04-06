import {
    Box,
    Grid,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import React, { useEffect, useState,useCallback  } from "react";
  import axios from "axios";
  import LuckySpin from "./LuckySpin";
  import Mobile from "../Components/Mobile";
  import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
  import { domain } from "../Components/config";
  
  const LuckySpinPage = () => {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate("/activity");
    };
    const [spinInfo, setSpinInfo] = useState({
      depositMadeToday: 0,
      SpinHave: 0,
      numberOfSpins: 0,
    });
    const [todaySpins, setTodaySpins] = useState([]);
    const [allTimeSpins, setAllTimeSpins] = useState([]);
    const [error, setError] = useState("");
  
    const fetchData = useCallback(async () => {
      try {
        // Fetch spin info
        const spinInfoResponse = await axios.get(`${domain}/spin-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSpinInfo(spinInfoResponse.data);
  
        // Fetch spin history
        const historyResponse = await axios.get(`${domain}/spin-history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTodaySpins(historyResponse.data.todaySpins);
        setAllTimeSpins(historyResponse.data.allTimeSpins);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      }
    }, []);
  
    useEffect(() => {
      fetchData(); // Initial fetch
  
      // Set up polling every 30//20//10 seconds
      const intervalId = setInterval(fetchData, 10000);
  
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, [fetchData]);
    return (
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          {/* Top Bar with Back Button and Title */}
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              background: "linear-gradient(90deg, #FA6A67 0%, #FA6A67 100%)",
              padding: "10px 16px",
              color: "white",
            }}
          >
            <Grid
              item
              xs={12}
              container
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                sx={{ color: "white", position: "absolute", left: 0 }}
                onClick={handleBackClick}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Box sx={{ textAlign: "center", fontSize:"20px" }}>
                <span>Activity Details</span>
              </Box>
            </Grid>
          </Grid>

          {/* Content Area with Only Images */}
           {/* Content Area with Only Images */}
                   <Box sx={{ padding: 2, flexGrow: 1 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
                       <img src="../assets/banners/ab1.jpg" alt="Top Banner" style={{ width: 400, height: 'auto', marginBottom: 5, marginTop: -15 }} />
                     </Box>
                     <Typography sx={{color:"black", fontWeight:"bold",marginBottom:1}}>Invite Bonus</Typography>
                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
                       <img src="/assets/banners/invb.jpg" alt="Bottom Banner" style={{ width: 370, height: 'auto' }} />
                     </Box>
                   </Box>

     
        </Box>
      </Mobile>
    );
  };
  
  export default LuckySpinPage;