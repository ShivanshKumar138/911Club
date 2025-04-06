import React, { useEffect, useState } from "react";
import Mobile from "../Components/Mobile";
import IconButton from "@mui/material/IconButton";
import {
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import { domain } from "./config";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const Coupenmainuser = ({ children }) => {
  const [couponCode, setCouponCode] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/envelop-transactions`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log(response.data);
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        alert("Failed to fetch transaction history.");
      }
    };
  
    fetchTransactionHistory();
  }, []);

  const handleRedirect = () => {
    navigate("/activity");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/redeem-coupon`,
        { code: couponCode },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert(response.data);

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert("No response received from the server.");
      } else {
        alert("Error", error.message);
      }
    }
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
                background: "#F95959",
                padding: "8px 16px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center" style={{
                backgroundColor:"#F95959"
              }}>
                <Grid item xs={2}>
                  <IconButton
                    sx={{ color: "white", ml: -5 }}
                    onClick={handleRedirect}
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
                    Gift
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ backgroundColor: "#F7F8FF" }}>
              <img
                src="../assets/images/gift.png"
                alt="coupon"
                style={{ width: "100%", height: "200%" }}
              />
              <Box sx={{ backgroundColor: "#F7F8FF", padding: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    padding: 2,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    color="#1e2637"
                  >
                    Hi
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    color="#1e2637"
                  >
                    We have a gift for you
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    align="left"
                    color="#1e2637"
                    sx={{ mt: 4, fontSize: "15px" }}
                  >
                    Please enter the gift Code below
                  </Typography>
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "20px",
                      width: "100%",
                    }}
                  >
                    <TextField
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      placeholder="Please enter gift code"
                      required
                      variant="outlined"
                      sx={{
                        marginBottom: "10px",
                        borderRadius: "20px",
                        backgroundColor: "#f2f2f1",
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgb(167,165,161)",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      InputProps={{
                        style: { color: "black" },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: "20px",
                        background:
                          "#F95959",
                        "&:hover": {
                          background:
                            "#F95959",
                        },
                      }}
                    >
                      Receive
                    </Button>
                  </form>
                </Box>
              </Box>

              <Box sx={{ padding: 1, boxShadow: "none" }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "none",
                    backgroundColor: "#FFFFFF",
                    
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#1e2637", textAlign: "left", mb: 2 }}
                    >
                      Gift History
                    </Typography>

                    {historyData.length > 0 ? (
                      <List sx={{ maxHeight: 300, overflow: "auto" }}>
                        {historyData.map((transaction, index) => (
                          <React.Fragment key={index}>
                            <ListItem
                              alignItems="flex-start"
                              sx={{
                                background: "#FFFFFF",
                                borderRadius: 2,
                                mb: 1,
                                padding: "10px 16px",
                              }}
                            >
                               <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ 
                                      color: "#4CAF50", // Changed to green color
                                      fontWeight: "bold" 
                                    }}
                                  >
                                    Received Successfully
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: "green", fontWeight: "bold" }}
                                  >
                                    ₹{transaction.amount}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "black" }}
                                  >
                                    {new Date(
                                      transaction.date
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                            {index < historyData.length - 1 && (
                              <Divider
                                variant="inset"
                                component="li"
                                sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: 2,
                          p: 2,
                        }}
                      >
                        <img
                          src="../../assets/No data-amico.png"
                          alt="No data"
                          style={{ width: "100px", marginBottom: "10px" }}
                        />
                        <Typography variant="body2" sx={{ color: "white" }}>
                          No gift history available
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default Coupenmainuser;
