import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import {
  Grid,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Phone from "@mui/icons-material/Phone";
import { TextField, Button, makeStyles } from "@material-ui/core";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import EditIcon from "@mui/icons-material/Edit";
import { useBank } from "../Pages/BankContext";
import { domain } from "./config";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: "#f2f2f2",
    display: "flex",
    flexDirection: "column",
  },
  warningBox: {
    backgroundColor: "#fff",
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    borderRadius: "12px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  warningIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(1),
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: theme.spacing(1),
    borderRadius: "12px",
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    marginRight: theme.spacing(2),
    color: "#F95959",
  },
  input: {
    flexGrow: 1,
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
  },
  saveButton: {
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "12px",
    marginTop: theme.spacing(4),
    "&:hover": {
      backgroundColor: "#0C4F14",
    },
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  networkText: {
    fontWeight: "bold",
    color: "#333",
  },
  aliasText: {
    color: "#9E9E9E",
  },
}));

const UsdtAddress = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const bankContext = useBank();
  const selectedBank = bankContext ? bankContext.selectedBank : null;

  const [network, setNetwork] = useState("TRC"); // Default network
  const [usdtAddress, setUsdtAddress] = useState(""); // State for USDT address
  const [addressAlias, setAddressAlias] = useState(""); // State for alias
  const [trxAddress, setTrxAddress] = useState(""); // State for TRX address
  const [successPopupOpen, setSuccessPopupOpen] = useState(false); // State for success popup

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Function to handle the USDT Address submission
  const handleSubmitUSDT = async (e) => {
    e.preventDefault();
    if (!usdtAddress || !addressAlias) {
      alert("Please provide both USDT address and alias.");
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.post(
        `${domain}/user/usdt-address`,
        {
          network,
          usdtAddress,
          addressAlias,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSuccessPopupOpen(true); // Open success popup
      navigate("/withdraw");
    } catch (err) {
      alert(err.response?.data || "Error occurred while saving the address.");
    }
  };
  // Function to handle the TRX Address submission
  const handleSubmitTRX = async (e) => {
    e.preventDefault();
    if (!trxAddress || !addressAlias) {
      alert("Please provide both TRX address and alias.");
      return;
    }

    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.post(
        `${domain}/user/trxaddress-update`,
        {
          address: trxAddress, // Updated to 'address' as expected by the backend
          alias: addressAlias, // Send alias with TRX address
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSuccessPopupOpen(true); // Open success popup
      navigate("/withdraw");
    } catch (err) {
      alert(err.response?.data || "Error occurred while saving the address.");
    }
  };

  const handleClosePopup = () => {
    setSuccessPopupOpen(false);
  };

  return (
    <div>
      <Mobile>
        <Box display="flex" flexDirection="column" height="100vh">
          <Box>
            <Grid
              container
              alignItems="center"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#ffffff",
                padding: "12px 16px",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Grid item xs={1}>
                <IconButton
                  sx={{ color: "black", padding: 0 }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                  Add USDT Address
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Container className={classes.container}>
            <Box className={classes.warningBox}>
              <ErrorOutlineOutlinedIcon
                className={classes.warningIcon}
                fontSize="small"
              />
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                color="error"
                sx={{ fontSize: "12px" }}
              >
                To ensure the safety of your funds, please link your wallet
              </Typography>
            </Box>

            {/* Network Selection */}
            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <LanguageIcon className={classes.icon} />
                <Typography className={classes.networkText}>
                  Select main network
                </Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <Typography variant="subtitle1">{network}</Typography>
                <EditIcon style={{ color: "#F95959", marginLeft: 8 }} />
              </Box>
            </Box>

            {/* TRX Address Section */}
            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography className={classes.networkText}>
                  TRX Address
                </Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter the TRX address"
                  value={trxAddress}
                  onChange={(e) => setTrxAddress(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            {/* Alias Section */}
            <Box mb={4}>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone className={classes.icon} />
                <Typography className={classes.networkText}>
                  Address Alias
                </Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter a remark of the withdrawal address"
                  value={addressAlias}
                  onChange={(e) => setAddressAlias(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            {/* Save Button for TRX Address */}
            <Button
              onClick={handleSubmitTRX}
              className={classes.saveButton}
              fullWidth
            >
              Save
            </Button>
          </Container>

          {/* Success Popup */}
          <Snackbar
            open={successPopupOpen}
            autoHideDuration={4000}
            onClose={handleClosePopup}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleClosePopup} severity="success">
              Address successfully saved!
            </Alert>
          </Snackbar>
        </Box>
      </Mobile>
    </div>
  );
};

export default UsdtAddress;
