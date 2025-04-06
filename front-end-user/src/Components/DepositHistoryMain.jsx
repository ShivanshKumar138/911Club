import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mobile from "./Mobile";
import CalendarDrawer from "./CalendarDrawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import noDataImage from "../assets/14-a397ff6b.png";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Initial state
const initialState = {
  selectedFilter: "All",
  selectedMethod: "All",
  isOptionsDrawerOpen: false,
  selectedDate: [
    new Date(new Date().setDate(new Date().getDate() - 5)),
    new Date(),
  ],
  depositHistory: [],
  loading: false,
  error: null,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, selectedFilter: action.payload };
    case "SET_METHOD":
      return { ...state, selectedMethod: action.payload };
    case "TOGGLE_OPTIONS_DRAWER":
      return { ...state, isOptionsDrawerOpen: action.payload };
    case "SET_DATE":
      return { ...state, selectedDate: action.payload };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, depositHistory: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Main component
const DepositHistoryMain = () => {
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const theme = useTheme();
  const [calendarKey, setCalendarKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

   // Add this new state for snackbar
   const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

    // Add function to copy order number
    const copyOrderNumber = (orderNumber) => {
      navigator.clipboard.writeText(orderNumber);
      setSnackbar({
        open: true,
        message: "Copied successfully!",
        severity: "success"
      });
    };

      // Add function to handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };


  const toggleCalendarDrawer = (open) => {
    setCalendarDrawerOpen(open);
    if (open) {
      setCalendarKey((prev) => prev + 1); // Increment key when opening drawer
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDateRangeSelect = (dateRange) => {
    console.log("Date range selected:", dateRange);
    dispatch({ type: "SET_DATE", payload: [dateRange.start, dateRange.end] });
  };

  const formatDateDisplay = (date) => {
    return date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "Choose a date";
  };
  // Fetch deposit history based on filters and date range
  useEffect(() => {
    if (
      state.selectedFilter !== "All" ||
      state.selectedMethod !== "All" ||
      state.selectedDate[0] ||
      state.selectedDate[1]
    ) {
      fetchDepositHistory();
    }
  }, [state.selectedFilter, state.selectedMethod, state.selectedDate]);

  const fetchDepositHistory = async () => {
    if (state.loading) return; // Prevent multiple simultaneous requests
    dispatch({ type: "FETCH_START" });
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/deposit-history`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: state.selectedFilter,
          method: state.selectedMethod,
          startDate: state.selectedDate[0]
            ? formatDate(state.selectedDate[0])
            : null,
          endDate: state.selectedDate[1]
            ? formatDate(state.selectedDate[1])
            : null,
        },
      });
      if (
        JSON.stringify(response.data.depositHistory) !==
        JSON.stringify(state.depositHistory)
      ) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.depositHistory,
        });
      } else {
        dispatch({ type: "FETCH_SUCCESS", payload: state.depositHistory });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };


  // Add this useEffect to fetch data when component mounts
useEffect(() => {
  fetchDepositHistory();
}, []);

  const formatDate = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Add 1 day
    return newDate.toISOString().split("T")[0];
  };

  const handleFilterClick = (filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: false });
  };

  const handleMethodClick = (method) => {
    dispatch({ type: "SET_METHOD", payload: method });
  };

  const toggleOptionsDrawer = (open) => () => {
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: open });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#6ea8f4";
      case "failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const filteredDeposits = state.depositHistory.filter((deposit) => {
    const statusMatch =
      state.selectedFilter === "All" ||
      deposit.depositStatus.toLowerCase() ===
        state.selectedFilter.toLowerCase();
    const methodMatch =
      state.selectedMethod === "All" ||
      deposit.depositMethod.toLowerCase() ===
        state.selectedMethod.toLowerCase();
    const depositDate = new Date(deposit.depositDate.split("T")[0]);
    const dateMatch =
      (!state.selectedDate[0] ||
        depositDate >= new Date(formatDate(state.selectedDate[0]))) &&
      (!state.selectedDate[1] ||
        depositDate <= new Date(formatDate(state.selectedDate[1])));
    return statusMatch && methodMatch && dateMatch;
  });

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          color="#f2f2f1"
          sx={{ minHeight: "100vh", bgcolor: "#F5F5F5" }}
        >
          <Box flexGrow={1} backgroundColor="#F7F8FF">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#F95959",
                padding: "4px 8px",
                color: "black",
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
                    Deposit History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Filter and Method Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 2, paddingLeft: "4%", paddingRight: "4%" }}
            >
              {[
                { name: "All", icon: "/assets/all.png" },
                
              ].map((method) => (
                <Grid item xs={4} key={method.name} sx={{ paddingX: 0.5 }}>
                  <Button
                    onClick={() => handleMethodClick(method.name)}
                    sx={{
                      width: "100%",
                      height: "2.5rem",
                      backgroundColor:
                        state.selectedMethod === method.name
                          ? "#F95959"
                          : "#FFFFFF",

                      textTransform: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0 8px",
                      color:
                        state.selectedMethod === method.name
                          ? "#ffffff"
                          : "#666666",
                      borderRadius: "5px",
                      fontWeight: "normal",
                      fontSize: "0.75rem",
                      "&:hover": {
                        background: "#F95959",
                        color: "black",
                      },
                    }}
                  >
                    <img
                      src={method.icon}
                      alt={method.name}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "4px",
                        filter:
                          state.selectedMethod === method.name
                            ? "none"
                            : "grayscale(100%)",
                      }}
                    />
                    <span>{method.name}</span>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Filter and Date Range Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 2, paddingLeft: "5%", paddingRight: "5%" }}
            >
              <Button
                onClick={toggleOptionsDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#FFFFFF",
                  textTransform: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  color: "#768096",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                <span>{state.selectedFilter}</span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                onClick={() => toggleCalendarDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  fontSize: "0.68rem",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  color: "#768096",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                <span>
                  {state.selectedDate[0] && state.selectedDate[1]
                    ? `${formatDateDisplay(
                        state.selectedDate[0]
                      )} - ${formatDateDisplay(state.selectedDate[1])}`
                    : "Choose a date"}
                </span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Grid>
            {/* Deposit History List */}
            <Box
              sx={{
                padding: "4%",
                marginTop: "2rem",
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {state.loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress />
                </Box>
              ) : state.error ? (
                <Typography
                  variant="h6"
                  sx={{ color: "red", textAlign: "center" }}
                >
                  Error: {state.error}
                </Typography>
              ) : filteredDeposits.length > 0 ? (
                filteredDeposits.map((deposit) => (
                  <Card
                    key={deposit.depositId}
                    sx={{
                      marginBottom: "16px",
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent sx={{ padding: "16px", position: "relative" }}>
                      <Grid
                        container
                        xs={12}
                        mt={-1}
                        mb={1}
                        sx={{ borderBottom: "1px solid #eee" }}
                      >
                        <Grid container xs={6}>
                          <Box
                            sx={{
                              backgroundColor:" #F95959",
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "5px",
                              padding: "4px 12px",
                              marginBottom: "2%",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Deposit
                          </Box>
                        </Grid>
                        <Grid xs={6}>
                          <Typography
                            variant="body2"
                            sx={{
                              position: "absolute",
                              right: "16px",
                              top: "13px",
                              fontSize: "14px",
                              color: getStatusColor(deposit.depositStatus),
                              fontWeight: "bold",
                            }}
                          >
                            {deposit.depositStatus}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "#768096" }}>
                            Balance
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: "#feaa57" }}
                          >
                            ₹{deposit.depositAmount}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "#768096" }}>
                            Type
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: "#768096" }}
                          >
                            {deposit.depositMethod}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "#768096" }}>
                            Time
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: "#768096" }}
                          >
                            {new Date(deposit.depositDate).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="left">
                          <Typography variant="body2" sx={{ color: "#768096" }}>
                            Order number
                          </Typography>
                        </Grid>
                        <Grid item xs={8} textAlign="end" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: "500", 
                        color: "#768096", 
                        marginRight: '8px',
                        maxWidth: '75%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {deposit.depositId}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => copyOrderNumber(deposit.depositId)}
                      sx={{ padding: '2px' }}
                    >
                      <FileCopyIcon fontSize="small" sx={{ color: "#F95959" }} />
                    </IconButton>
                  </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <svg
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-f84b843f=""
                    class="svg-icon icon-empty"
                    width="389"
                    height="227"
                  >
                    <defs>
                      <symbol
                        id="icon-empty"
                        viewBox="0 0 389 227"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
                          fill='url("#paint0_linear_6306_124794")'
                        ></path>
                        <path
                          d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
                          fill='url("#paint1_linear_6306_124794")'
                        ></path>
                        <path
                          d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
                          fill='url("#paint2_linear_6306_124794")'
                        ></path>
                        <path
                          d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
                          fill='url("#paint3_linear_6306_124794")'
                        ></path>
                        <path
                          opacity="0.712"
                          d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
                          fill='url("#paint4_linear_6306_124794")'
                        ></path>
                        <path
                          d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
                          fill='url("#paint5_linear_6306_124794")'
                        ></path>
                        <path
                          d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
                          fill='url("#paint6_linear_6306_124794")'
                        ></path>
                        <rect
                          x="48.8203"
                          y="144"
                          width="5"
                          height="20"
                          rx="2.5"
                          fill='url("#paint7_linear_6306_124794")'
                        ></rect>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
                          fill='url("#paint8_linear_6306_124794")'
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
                          fill='url("#paint9_linear_6306_124794")'
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
                          fill='url("#paint10_linear_6306_124794")'
                        ></path>
                        <path
                          d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
                          fill='url("#paint11_linear_6306_124794")'
                        ></path>
                        <path
                          opacity="0.398"
                          d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045"
                          stroke="#908E9B"
                          stroke-width="0.881px"
                          stroke-linecap="round"
                          stroke-dasharray="2.64 2.64"
                          fill="none"
                        ></path>
                        <path
                          d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z"
                          fill="#565461"
                        ></path>
                        <path
                          d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z"
                          fill='url("#paint12_linear_6306_124794")'
                        ></path>
                        <path
                          d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
                          fill='url("#paint13_linear_6306_124794")'
                        ></path>
                        <path
                          d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
                          fill="#6D6B7A"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_6306_124794"
                            x1="185.676"
                            y1="129.156"
                            x2="185.676"
                            y2="227"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#484852"></stop>
                            <stop
                              offset="0.615"
                              stop-color="#777783"
                              stop-opacity="0.1"
                            ></stop>
                            <stop
                              offset="1"
                              stop-color="#DEDEE6"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_6306_124794"
                            x1="110.557"
                            y1="19.5694"
                            x2="110.557"
                            y2="79.5818"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#353240"></stop>
                            <stop
                              offset="1"
                              stop-color="#24212F"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint2_linear_6306_124794"
                            x1="303.907"
                            y1="65.2301"
                            x2="303.907"
                            y2="109.586"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#353240"></stop>
                            <stop
                              offset="1"
                              stop-color="#24212F"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint3_linear_6306_124794"
                            x1="212.361"
                            y1="177.425"
                            x2="211.673"
                            y2="-1.70206e-05"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#100F15"></stop>
                            <stop offset="0.232" stop-color="#27252F"></stop>
                            <stop offset="0.925" stop-color="#514E5A"></stop>
                            <stop offset="1" stop-color="#33323C"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint4_linear_6306_124794"
                            x1="188.942"
                            y1="9.13086"
                            x2="188.942"
                            y2="155.486"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#676570"></stop>
                            <stop offset="1" stop-color="#403F4B"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint5_linear_6306_124794"
                            x1="177.68"
                            y1="144.809"
                            x2="177.68"
                            y2="177.424"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#504F5C"></stop>
                            <stop offset="1" stop-color="#2E2C3B"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint6_linear_6306_124794"
                            x1="275.816"
                            y1="28.1825"
                            x2="275.816"
                            y2="3.62035"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#31303A"></stop>
                            <stop offset="1" stop-color="#2B2930"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint7_linear_6306_124794"
                            x1="51.3203"
                            y1="144"
                            x2="51.3203"
                            y2="164"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#33303E"></stop>
                            <stop offset="1" stop-color="#3D3B46"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint8_linear_6306_124794"
                            x1="52.0976"
                            y1="99.1497"
                            x2="52.0976"
                            y2="149.74"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#302C3F"></stop>
                            <stop offset="1" stop-color="#494854"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint9_linear_6306_124794"
                            x1="344.097"
                            y1="165.449"
                            x2="344.097"
                            y2="181.337"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#23202A"></stop>
                            <stop offset="1" stop-color="#42404B"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint10_linear_6306_124794"
                            x1="344.795"
                            y1="140.896"
                            x2="344.795"
                            y2="172.673"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#302C3F"></stop>
                            <stop offset="1" stop-color="#494854"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint11_linear_6306_124794"
                            x1="296.068"
                            y1="131.764"
                            x2="296.068"
                            y2="170.902"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#494855"></stop>
                            <stop offset="1" stop-color="#312F3B"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint12_linear_6306_124794"
                            x1="84.0489"
                            y1="52.2659"
                            x2="113.914"
                            y2="80.8551"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#605D6A"></stop>
                            <stop offset="1" stop-color="#7D7B8B"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint13_linear_6306_124794"
                            x1="83.5475"
                            y1="51.2645"
                            x2="106.537"
                            y2="69.6654"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#7C7A84"></stop>
                            <stop offset="1" stop-color="#ABAAB3"></stop>
                          </linearGradient>
                        </defs>
                      </symbol>
                    </defs>
                    <g>
                      <path
                        opacity="0.3"
                        d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z"
                        fill='url("#paint0_linear_6306_124794")'
                      ></path>
                      <path
                        d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z"
                        fill='url("#paint1_linear_6306_124794")'
                      ></path>
                      <path
                        d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z"
                        fill='url("#paint2_linear_6306_124794")'
                      ></path>
                      <path
                        d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z"
                        fill='url("#paint3_linear_6306_124794")'
                      ></path>
                      <path
                        opacity="0.712"
                        d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z"
                        fill='url("#paint4_linear_6306_124794")'
                      ></path>
                      <path
                        d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z"
                        fill='url("#paint5_linear_6306_124794")'
                      ></path>
                      <path
                        d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z"
                        fill='url("#paint6_linear_6306_124794")'
                      ></path>
                      <rect
                        x="48.8203"
                        y="144"
                        width="5"
                        height="20"
                        rx="2.5"
                        fill='url("#paint7_linear_6306_124794")'
                      ></rect>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z"
                        fill='url("#paint8_linear_6306_124794")'
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z"
                        fill='url("#paint9_linear_6306_124794")'
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z"
                        fill='url("#paint10_linear_6306_124794")'
                      ></path>
                      <path
                        d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z"
                        fill='url("#paint11_linear_6306_124794")'
                      ></path>
                      <path
                        opacity="0.398"
                        d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045"
                        stroke="#908E9B"
                        stroke-width="0.881px"
                        stroke-linecap="round"
                        stroke-dasharray="2.64 2.64"
                        fill="none"
                      ></path>
                      <path
                        d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z"
                        fill="#565461"
                      ></path>
                      <path
                        d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z"
                        fill='url("#paint12_linear_6306_124794")'
                      ></path>
                      <path
                        d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z"
                        fill='url("#paint13_linear_6306_124794")'
                      ></path>
                      <path
                        d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z"
                        fill="#6D6B7A"
                      ></path>
                      <defs>
                        <lineargradient
                          id="paint0_linear_6306_124794"
                          x1="185.676"
                          y1="129.156"
                          x2="185.676"
                          y2="227"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#484852"></stop>
                          <stop
                            offset="0.615"
                            stop-color="#777783"
                            stop-opacity="0.1"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#DEDEE6"
                            stop-opacity="0"
                          ></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint1_linear_6306_124794"
                          x1="110.557"
                          y1="19.5694"
                          x2="110.557"
                          y2="79.5818"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#353240"></stop>
                          <stop
                            offset="1"
                            stop-color="#24212F"
                            stop-opacity="0"
                          ></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint2_linear_6306_124794"
                          x1="303.907"
                          y1="65.2301"
                          x2="303.907"
                          y2="109.586"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#353240"></stop>
                          <stop
                            offset="1"
                            stop-color="#24212F"
                            stop-opacity="0"
                          ></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint3_linear_6306_124794"
                          x1="212.361"
                          y1="177.425"
                          x2="211.673"
                          y2="-1.70206e-05"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#100F15"></stop>
                          <stop offset="0.232" stop-color="#27252F"></stop>
                          <stop offset="0.925" stop-color="#514E5A"></stop>
                          <stop offset="1" stop-color="#33323C"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint4_linear_6306_124794"
                          x1="188.942"
                          y1="9.13086"
                          x2="188.942"
                          y2="155.486"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#676570"></stop>
                          <stop offset="1" stop-color="#403F4B"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint5_linear_6306_124794"
                          x1="177.68"
                          y1="144.809"
                          x2="177.68"
                          y2="177.424"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#504F5C"></stop>
                          <stop offset="1" stop-color="#2E2C3B"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint6_linear_6306_124794"
                          x1="275.816"
                          y1="28.1825"
                          x2="275.816"
                          y2="3.62035"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#31303A"></stop>
                          <stop offset="1" stop-color="#2B2930"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint7_linear_6306_124794"
                          x1="51.3203"
                          y1="144"
                          x2="51.3203"
                          y2="164"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#33303E"></stop>
                          <stop offset="1" stop-color="#3D3B46"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint8_linear_6306_124794"
                          x1="52.0976"
                          y1="99.1497"
                          x2="52.0976"
                          y2="149.74"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#302C3F"></stop>
                          <stop offset="1" stop-color="#494854"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint9_linear_6306_124794"
                          x1="344.097"
                          y1="165.449"
                          x2="344.097"
                          y2="181.337"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#23202A"></stop>
                          <stop offset="1" stop-color="#42404B"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint10_linear_6306_124794"
                          x1="344.795"
                          y1="140.896"
                          x2="344.795"
                          y2="172.673"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#302C3F"></stop>
                          <stop offset="1" stop-color="#494854"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint11_linear_6306_124794"
                          x1="296.068"
                          y1="131.764"
                          x2="296.068"
                          y2="170.902"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#494855"></stop>
                          <stop offset="1" stop-color="#312F3B"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint12_linear_6306_124794"
                          x1="84.0489"
                          y1="52.2659"
                          x2="113.914"
                          y2="80.8551"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#605D6A"></stop>
                          <stop offset="1" stop-color="#7D7B8B"></stop>
                        </lineargradient>
                        <lineargradient
                          id="paint13_linear_6306_124794"
                          x1="83.5475"
                          y1="51.2645"
                          x2="106.537"
                          y2="69.6654"
                          gradientunits="userSpaceOnUse"
                        >
                          <stop stop-color="#7C7A84"></stop>
                          <stop offset="1" stop-color="#ABAAB3"></stop>
                        </lineargradient>
                      </defs>
                    </g>
                  </svg>
                  <Typography variant="h6" sx={{ marginTop: "16px" }}>
                    No deposit history available.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Options Drawer */}
          <Drawer
            anchor="bottom"
            open={state.isOptionsDrawerOpen}
            onClose={toggleOptionsDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "white",
                color: "black",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleDrawerClose}
                sx={{ color: "#000", fontWeight: "normal" }}
              >
                Cancel
              </Button>
              <Button sx={{ color: "#F95959", fontWeight: "bold" }}>
                Confirm
              </Button>
            </Box>
            <List>
              {["All", "Completed", "Pending", "Failed"].map((filter) => (
                <ListItem
                  button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  sx={{
                    color: "#000",
                    fontWeight: "normal",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={filter} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <CalendarDrawer
            key={calendarKey} // Add this line
            isOpen={calendarDrawerOpen}
            onClose={() => toggleCalendarDrawer(false)}
            onRangeSelect={handleDateRangeSelect}
          />

          {/* Date Picker Drawer */}
        </Box>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={2000} 
          onClose={handleCloseSnackbar}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              "& .MuiAlert-message": {
                opacity: 1, 
                color: "white"
              },
              "& .MuiAlert-icon": {
                opacity: 1
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Mobile>
    </div>
  );
};

export default DepositHistoryMain;
