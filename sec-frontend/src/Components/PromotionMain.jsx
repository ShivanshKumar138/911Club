import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Typography, Button, Grid } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardContent, LinearProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import axios from "axios";
import { domain } from "./config";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const depositOptions = [
  { amount: 300, bonus: 50 },
  { amount: 500, bonus: 150 },
  { amount: 1000, bonus: 200 },
  { amount: 3000, bonus: 400 },
  { amount: 4000, bonus: 500 },
  { amount: 5000, bonus: 600 },
  { amount: 10000, bonus: 1100 },
  { amount: 50000, bonus: 4100 },
  { amount: 100000, bonus: 5500 },
];

const options = [
  { label: "Copy invitation code", image: "/assets/promotion/4.png" },
  { label: "Subordinate data", image: "/assets/promotion/svgexport-7.png" },
  {
    label: "Commission details",
    image: "/assets/promotion/2.png",
  },
  { label: "Invitation rules", image: "/assets/promotion/3.png" },
  {
    label: "New Subordinates",
    image: "/assets/promotion/svgexport-4.png",
  },
  {
    label: "Agent line customer service",
    image: "/assets/promotion/6.png",
  },
];

const PromotionMain = ({ children }) => {
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
  const [commissionWallet, setCommissionWallet] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  const [inviteLink, setInviteLink] = useState("");
  const [lifetimeCommission, setLifetimeCommission] = useState(0);
  const [totalDirectSubordinates, setTotalDirectSubordinates] = useState(0);
  const [totalTeamSubordinates, setTotalTeamSubordinates] = useState(0);
  const [totalAllSubordinates, setTotalAllSubordinates] = useState(0);
  const [copiedCode, setCopiedCode] = useState("");
  const [commission, setCommission] = useState(0);
  const [thisWeekCommission, setThisWeekCommission] = useState(0);
  const [yesterdayCommission, setYesterdayCommission] = useState(0);

  useEffect(() => {
    // Function to fetch subordinate data from the API
    const fetchSubordinateData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/subordinates`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust the URL if necessary
        const data = response.data;
  
        // Update total counts
        setTotalDirectSubordinates(data.directSubordinateCount);
        setTotalTeamSubordinates(data.teamSubordinateCount);
        setTotalAllSubordinates(data.totalSubordinateCount);
      } catch (err) {
        console.error("Error fetching subordinate data:", err);
      }
    };
  
    fetchSubordinateData(); // Call the fetch function
  }, []);

  useEffect(() => {
    const fetchLifetimeCommission = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const { data } = await axios.get(`${domain}/commission-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("data------>", data);
        // Assuming the lifetime commission data is in data.lifetimeCommission
        // Adjust this based on the actual API response structure
        let lifetimeCommissionData = (data.lifetimeCommission || 0).toFixed(2);
        let thisWeekCommissionData = (
          data.previousWeekCommissionTotal || 0
        ).toFixed(2);
        let yesterdayCommissionData = (
          data.yesterdayCommissionTotal || 0
        ).toFixed(2);
  
        console.log("thisWeekCommission---->", thisWeekCommissionData);
  
        setYesterdayCommission(parseFloat(yesterdayCommissionData));
        setThisWeekCommission(parseFloat(thisWeekCommissionData));
        setLifetimeCommission(parseFloat(lifetimeCommissionData));
      } catch (err) {
        console.error("Error fetching lifetime commission data:", err);
        // Handle errors as necessary, e.g., set default values or show an error message
        setLifetimeCommission(0);
        setThisWeekCommission(0);
        setYesterdayCommission(0);
      }
    };
  
    fetchLifetimeCommission();
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/commission-stats`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCommission(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  const [subordinate, setSubordinates] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(
          `${domain}/api/subordinates/previous-day`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubordinates(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  const [totalCommission, SetTotalCommission] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user/totalcommission`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        SetTotalCommission(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [totalCommission]);

  const handleCopyLink = async () => {
    navigate("/invite");
  };

  const [user, setUser] = useState(null);

  const navigatetosub = () => {
    navigate("/newsubordinate");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
  }, []);

  const dataItems = [
    {
      heading: "Number of Registers ",
      value: subordinate?.directSubordinatesCount || 0,
    },
    {
      heading: "Deposit Number ",
      value: subordinate?.directSubordinatesDepositCount || 0,
    },
    {
      heading: "Total Deposit ",
      value: subordinate?.directSubordinatesDepositSum || 0,
    },
    {
      heading: "Number of People Making First Deposit ",
      value: subordinate?.directSubordinatesFirstTimeDepositors || 0,
    },
    {
      heading: "Number of Registers ",
      value: subordinate?.teamSubordinatesCount || 0,
    },
    {
      heading: "Deposit Number ",
      value: subordinate?.teamSubordinatesDepositCount || 0,
    },
    {
      heading: "Total Deposit ",
      value: subordinate?.teamSubordinatesDepositSum || 0,
    },
    {
      heading: "Number of People Making First Deposit ",
      value: subordinate?.teamSubordinatesFirstTimeDepositors || 0,
    },
  ];

  const data = [
    { heading: "This week", value: thisWeekCommission || 0 },
    { heading: "Total commission", value: lifetimeCommission || 0 },
    { heading: "Direct subordinate", value: totalDirectSubordinates || 0 },
    {
      heading: "Total subordinates in team",
      value: totalAllSubordinates || 0,
    },
    { heading: "First Deposits Direct", value: user?.firstDepositsDirect || 0 },
    { heading: "First Deposits Team", value: user?.firstDepositsTeam || 0 },
  ];
  const [telegramLink, setTelegramLink] = useState('');

    useEffect(() => {
      // Fetch Telegram link when component mounts
      const fetchTelegramLink = async () => {
        try {
          const response = await fetch(`${domain}/getTelegramLink`, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Assuming token is stored in localStorage
            }
          });
          const data = await response.json();
          if (data.success) {
            setTelegramLink(data.telegramLink);
          }
        } catch (error) {
          console.error('Error fetching Telegram link:', error);
        }
      };
  
      fetchTelegramLink();
    }, []);

  const handleOptionClick = async (option) => {
    switch (option.label) {
      case "Copy invitation code":
        try {
          if (user && user.invitationCode) {
            await navigator.clipboard.writeText(user.invitationCode);
            setCopiedCode(user.invitationCode);
            alert("Invitation code copied to clipboard");
          } else {
            alert("Invitation code not available");
          }
        } catch (err) {
          console.error("Failed to copy invitation code: ", err);
        }
        break;
      case "Subordinate data":
        navigate("/subordinate-data");
        break;
      case "Commission details":
        navigate("/commision-details");
        break;
      case "Invitation rules":
        navigate("/invitation-rules");
        break;
      case "Agent line customer service":
        window.open(telegramLink, "_blank");
        break;
      case "New Subordinates":
        navigate("/newsubordinate");
        break;
      // Add more cases for other options
      default:
        console.log(`Clicked on option: ${option.label}`);
    }
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
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
          <Box flexGrow={1} sx={{ backgroundColor: "#f7f8ff" }}>
          <Grid
  container
  alignItems="center"
  justifyContent="space-between"
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
    padding: "12px 16px",
    color: "#1e2637",
  }}
>
  <Grid item xs={12}>
    <Box display="flex" justifyContent="center" alignItems="center" position="relative">
      <span style={{ fontSize: "19px", fontFamily: "helvetica", fontWeight: 400,color:"white" }}>
        Agency
      </span>
      <Box position="absolute" right={0} onClick={navigatetosub}>
        <img
          src="/assets/promotion/svgexport-3.png" // Replace with the actual path to your icon
          alt="icon"
          style={{ width: "24px", height: "24px", marginLeft: "8px" }}
        />
      </Box>
    </Box>
  </Grid>
</Grid>
            <Grid
              container
              spacing={2}
              mt={0}
              mb={15}
              sx={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100%",
                borderRadius: "10px",
              }}
            >
              {/* First Grid */}

              <Grid
                item
                xs={12}
                sx={{
                  borderRadius: "0px 0px 0 0",
                  background: 'linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%), url("https://goagamea.com/assets/png/promotionbg-13880556.png")',
                  backgroundBlendMode: "overlay",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "250px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {/* Header Content */}
                <Typography
                  variant="h5"
                  mt={1}
                  sx={{ color: "#FFFFFF" }}
                  align="center"
                >
                  {`\u20B9${yesterdayCommission.toFixed(2)}`}
                </Typography>

                <Typography
                  variant="body2"
                  color="#F95959"
                  backgroundColor="#FFFFFF"
                  align="center"
                  mt="3px"
                  padding="0.5px 15px"
                  borderRadius="25px"
                >
                  Yesterday's Total commission
                </Typography>

                <Typography
                  variant="caption"
                  color={"#FFFFFF"}
                  align="center"
                  mt="3px"
                >
                  Upgrade the level to increase commission income
                </Typography>

                {/* Inner Grid Container */}
                <Grid
                  container
                  sx={{
                    maxHeight: "70%",
                    maxWidth: "97%",
                    marginTop: "10px",
                    borderRadius: "8px",
                    boxShadow: 2,
                  }}
                >
                  {/* Header */}
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{
                      borderRadius: "8px 8px 0 0",
                      background: "#F95959",
                      borderRight: "1px solid #F95959",
                      padding: "0.6rem",
                    }}
                  >
                    <Grid item xs={6} sx={{ borderRight: "1px solid #ccc" }}>
                      <Typography
                        variant="body1"
                        sx={{ color: "#FFFFFF", fontFamily:"helvetica", fontWeight:400,fontSize:"14px" }}
                        align="center"
                      >
                        Direct subordinates
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{ color: "#FFFFFF", fontFamily:"helvetica", fontWeight:400,fontSize:"14px" }}
                        align="center"
                      >
                        Team subordinates
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Content */}
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      padding: "7px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "0 0 8px 8px",
                    }}
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={6} sx={{ marginBottom: "5px" }}>
                          <Typography
                            variant="h7"
                            align="center"
                            sx={{
                              color:
                                index === 1
                                  ? "green"
                                  : index === 2
                                  ? "orange"
                                  : "#1E2637",
                            }}
                          >
                            {dataItems[index].value}
                          </Typography>
                          <Typography
                            variant="caption"
                            align="center"
                            fontSize={10}
                            sx={{ color: "#1E2637", display: "block", fontFamily:"helvetica", fontWeight:400,fontSize:"11px" }}
                          >
                            {dataItems[index].heading}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ marginBottom: "5px" }}>
                          <Typography
                            variant="h7"
                            align="center"
                            sx={{
                              color:
                                index === 1
                                  ? "green"
                                  : index === 2
                                  ? "orange"
                                  : "#1E2637",
                                  fontFamily: "bold",
                            }}
                          >
                            {dataItems[index + 4].value}
                          </Typography>
                          <Typography
                            variant="caption"
                            align="center"
                            fontSize={10}
                            sx={{ color: "#1E2637", display: "block",fontFamily:"helvetica", fontWeight:400,fontSize:"11px" }}
                          >
                            {dataItems[index + 4].heading}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Button
              onClick={handleCopyLink}
              variant="contained"
              sx={{
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "10px", // Adjust as needed
                marginBottom: "10px",
                background: "linear-gradient(180deg, #F95959 0%, #F95959 30%, #F95959 100%)",
                "&:hover": {
                  background: "linear-gradient(180deg, #F95959 0%, #F95959 30%, #F95959 100%)",
                },
                color: "#ffffff",
                borderRadius: "20px", // Adjust as needed
                fontSize: "16px",fontFamily:"helvetica", fontWeight:700,
              }}
            >
              Invitation Link
            </Button>
            <div>
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={(e) => {
                    // Only handle clicks if the option label is not "Copy invitation code"
                    if (option.label !== "Copy invitation code") {
                      handleOptionClick(option);
                    }
                  }}
                  sx={{
                    backgroundColor: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#FFFFFF",
                    },
                    padding: 3,
                    margin: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <ListItemIcon>
                    <img
                      src={option.image}
                      alt="icon"
                      style={{ width: 24, height: 24, marginRight: 8, backgroundImage:"#F95959"}}
                    />
                  </ListItemIcon>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#1E2637",
                      flex: 1,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // Aligns child elements to the ends
                    }}
                  >
                    <span>{option.label}</span>
                    {option.label === "Copy invitation code" &&
                      user &&
                      user.invitationCode && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="inherit"
                            sx={{
                              color: "white",
                              fontSize: 11,
                              marginLeft: 2,
                              marginRight: 1,
                            }}
                          >
                            {user.invitationCode}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents the click event from bubbling up to the MenuItem
                              handleOptionClick(option); // Call the click handler for the option
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                  </Typography>

                  {option.label !== "Copy invitation code" && (
                    <ListItemIcon
                      style={{ marginLeft: "auto", color: "black" }}
                    >
                      <KeyboardArrowRightIcon />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </div>

            <Grid
              mt={4}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "94%",
                marginBottom: "100px",
                padding: "10px",
              }}
            >
              {/* Header */}
              <Grid container alignItems="center" sx={{ marginBottom: "5px" }}>
                <Grid item>
                <img
    src="/assets/promotion/7.png" // Replace with your image path
    alt="Promotion icon"
    style={{
      width: '25px',
      height: '25px',
    }}
   
  />
                 
                </Grid>
                <Grid item>
                  <Typography
                    variant="h7"
                    sx={{
                      fontWeight: "bold",
                      color: "#1E2637",
                    }}
                  >
                    Promotion data
                  </Typography>
                </Grid>
              </Grid>

              {/* Content */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {thisWeekCommission}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {data[0].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {lifetimeCommission}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {data[1].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {totalDirectSubordinates}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {data[2].heading}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {totalAllSubordinates}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1E2637" }}>
                    {data[3].heading}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* 
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} sx={{height:"600px",marginTop:"100px",marginRight:"30px",marginLeft:"30px",width:"auto"}}>
  
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ backgroundColor: "rgb(43,50,112)", padding: 2, flexGrow: 1 }}>
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <Typography variant="h6" sx={{ color: "#ffffff", marginBottom: 1 }}>
                Extra first deposit bonus
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Each account can only receive rewards once
              </Typography>
            </Box>
            {depositOptions.map((option, index) => (
              <Card key={index} sx={{ backgroundColor: "rgb(55,73,146)", marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#ffffff" }}>
                    First deposit {option.amount.toLocaleString()}{" "}
                    <span style={{ color: "#ffa726" }}>
                      + ₹{option.bonus.toFixed(2)}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0", marginBottom: 2 }}>
                    Deposit {option.amount.toLocaleString()} for the first time and
                    you will receive {option.bonus.toFixed(2)} bonus
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={0}
                    sx={{ height: 10, borderRadius: 5, marginBottom: 2 }}
                  />
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1976d2", justifyContent: "flex-end" }}
                  >
                    Deposit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box
            sx={{
              backgroundColor: "#394363",
              padding: theme.spacing(2),
              textAlign: "center",
            }}
          >

         <IconButton
          color="inherit"
          onClick={handleClose}
          sx={{
            position: "fixed",
            bottom: theme.spacing(2),
            left: "50%",
            bottom: "20%",
            transform: "translateX(-50%)",
            zIndex: theme.zIndex.appBar + 1, 
            color: "#ffffff",

          }} >
        <CancelOutlinedIcon />
        </IconButton >
          </Box>
        </Box>
    </Dialog> */}

            {/* content end */}
          </Box>
          <br />
          <br />
          <br />

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default PromotionMain;
