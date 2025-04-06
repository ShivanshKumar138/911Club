import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Mobile from "./Mobile";
import axios from "axios";
import { Award, Calendar } from "lucide-react";
import { domain } from "./config";

function ReceiveHistoryPage() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("weekly"); // Manage active button state
  const [rewards, setRewards] = useState([]); // Ensure rewards is initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(
          `${domain}/api/activity-reward-settings/rewards-by-period/${activeButton}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Log the response to check its structure
        if (response.data && Array.isArray(response.data.claims)) {
          setRewards(response.data.claims);
        } else {
          setError("Invalid response format.");
        }
      } catch (error) {
        setError("Error fetching rewards.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRewards();
  }, [activeButton]);

  return (
    <Mobile>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "linear-gradient(90deg,#FF6C25 0%,#FF6C25 100%)",
          padding: "4px 8px",
          color: "white",
        }}
      >
        <Grid item container alignItems="center" justifyContent="center">
          <Grid item xs={2}>
            <IconButton
              onClick={() => navigate(-1)}
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
              Receive History
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box
        sx={{ backgroundColor: "#f6f6f6", height: "100vh", padding: "11px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0px",
          }}
        >
          <Box
            onClick={() => setActiveButton("weekly")}
            sx={{
              backgroundColor:
                activeButton === "weekly" ? "#FF6C25" : "#9EC1A3",
              padding: "16px 0",
              borderRadius: "8px",
              width: "50%",
              color: activeButton === "weekly" ? "white" : "#fff",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Weekly
          </Box>
          <Box
            onClick={() => setActiveButton("daily")}
            sx={{
              backgroundColor: activeButton === "daily" ? "#FF6C25" : "#9EC1A3",
              padding: "16px 0",
              borderRadius: "8px",
              width: "50%",
              color: activeButton === "daily" ? "white" : "#fff",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Daily
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            px: 2, 
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography
              sx={{
                color: "red",
                textAlign: "center",
                fontSize: "18px",
                mt: 4,
              }}
            >
              {error}
            </Typography>
          ) : rewards.length > 0 ? (
            <Grid
              container
              spacing={3} // Slightly increase spacing for better card separation
              sx={{
                maxWidth: "600px",
                p: 0,
              }}
            >
              {rewards.map((reward, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "#fff",
                      color: "black",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0 }}
                      >
                        <Award
                          style={{
                            color: "#FF6C25",
                            marginRight: "5px",
                          }}
                          size={24}
                        />
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Activity Award: ₹{reward.activityAward}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "gray",
                          mt: 2,
                        }}
                      >
                        <Calendar style={{ marginRight: "12px" }} size={18} />
                        <Typography variant="caption">
                          {new Date(reward.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "70vh",
                textAlign: "center",
                color: "grey",
              }}
            >
              <img
                src="/assets/Search-rafiki.png"
                alt="No data available"
                style={{
                  width: "40%",
                  marginBottom: "16px",
                }}
              />
              <Typography variant="h6">No data available</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Mobile>
  );
}

export default ReceiveHistoryPage;