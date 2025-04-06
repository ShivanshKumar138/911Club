import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import {
  Grid,
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneIcon from "@mui/icons-material/Phone";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useBank } from "../Pages/BankContext";
import { makeStyles } from "@material-ui/core/styles";
// const { domain } = require("./config");
import { domain } from "./config";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    backgroundColor: "#f9f9f9",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  warningBox: {
    backgroundColor: "#ffffff",
    padding: theme.spacing(1.2),
    marginBottom: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    borderRadius: "20px",
  },
  inputContainer: {
    backgroundColor: "white",
    padding: theme.spacing(1),
    borderRadius: "8px",
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(2),
    color: "#F95959",
  },
  selectBank: {
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    color: "white",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
  },
  saveButton: {
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "8px",
    marginBottom: "3rem",
    marginTop: theme.spacing(1),
    "&:hover": {
      background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
    },
    textTransform: "uppercase",
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
  snackbar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    margin: "0 auto",
    maxWidth: "400px",
  },
}));

const ActivityMain = ({ children }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const bankContext = useBank();
  const selectedBank = bankContext ? bankContext.selectedBank : null;
  console.log("selectedBank-->", selectedBank);

  const [bankDetails, setBankDetails] = useState(null);
  const [name, setName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [bankName, setBankName] = useState(selectedBank || "");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    const fetchBankDetails = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user/bank-details/show`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setBankDetails(response.data);
        setName(response.data.name || "");
        setAccountNo(response.data.accountNo || "");
        setIfscCode(response.data.ifscCode || "");
        setMobile(response.data.mobile || "");
        setBankName(selectedBank || response.data.bankName || "");
      } catch (err) {
        console.error(err.response?.data);
      }
    };
  
    fetchBankDetails();
  }, [selectedBank]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/user/bank-details`,
        {
          name,
          accountNo,
          ifscCode,
          mobile,
          bankName,
        },
        {
          withCredentials: true, // Include credentials (cookies) in the request
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Handle success response
      console.log(response);
      setSnackbarMessage("Bank details updated successfully!");
      setOpenSnackbar(true);
  
      // Clear fields after successful submission
      setName("");
      setAccountNo("");
      setIfscCode("");
      setMobile("");
      setBankName(selectedBank || "");
  
      // Redirect to the withdraw page
      navigate("/withdraw");
    } catch (err) {
      // Handle error response
      setSnackbarMessage(err.response?.data || "An error occurred");
      setOpenSnackbar(true);
    }
  };

  const handleBank = () => {
    navigate("/choosebank");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          position="relative"
        >
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
                  Add a bank account number
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Container className={classes.container} sx={{ mb: "10%" }}>
            <Box className={classes.warningBox}>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                color="error"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                <ErrorOutlineOutlinedIcon
                  style={{ marginRight: "8px", fontSize: "20px" }}
                />
                To ensure the safety of your funds, please bind your bank
                account
              </Typography>
            </Box>

            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceIcon className={classes.icon} />
                <Typography>Choose a bank</Typography>
              </Box>
              <Box className={classes.selectBank} onClick={handleBank}>
                <Typography variant="subtitle1">
                  {selectedBank || "Choose a bank"}
                </Typography>
                <ChevronRightIcon style={{ color: "white", marginLeft: 8 }} />
              </Box>
            </Box>
            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon className={classes.icon} />
                <Typography>Full recipient's name</Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter the recipient's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <CreditCardIcon className={classes.icon} />
                <Typography>Bank account number</Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter the bank account number"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <VpnKeyIcon className={classes.icon} />
                <Typography>Bank IFSC code</Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter the bank IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            <Box mb={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon className={classes.icon} />
                <Typography>Mobile number</Typography>
              </Box>
              <Box className={classes.inputContainer}>
                <TextField
                  fullWidth
                  placeholder="Please enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  variant="standard"
                  className={classes.input}
                />
              </Box>
            </Box>

            <Button
              className={classes.saveButton}
              variant="contained"
              onClick={handleSubmit}
            >
              Save
            </Button>

            {/* Snackbar for success or error messages */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              className={classes.snackbar}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Container>
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityMain;
