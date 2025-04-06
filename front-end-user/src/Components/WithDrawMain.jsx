import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import walletCard from "../../public/walletCard/wallet.png";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  List,
  SvgIcon,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import RefreshIcon from "@mui/icons-material/Refresh";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BulletPoint from "@material-ui/icons/FiberManualRecord";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";
import { Balance } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@mui/material";

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    width: "100%",
    // margin: "10px auto",
    // borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  imageContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: "10px",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 10px",
    // backgroundColor: 'rgb(42,50,112)',
    color: "#a7a5a1",
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: "rgb(55,72,146)",
    width: "35ch",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgb(34,39,91)",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#a7a5a1",
    },
    borderRadius: "10px",
  },
  button: {
    margin: theme.spacing(3),
    borderRadius: "12px",
    width: "40ch",
  },
  list: {
    color: "#a7a5a1",
  },
}));

const WithDrawMain = ({ children }) => {
  const classes = useStyles();
  const [withdrawals, setWithdrawals] = useState([]);
  const [password, setPassword] = useState("");
  const mobile = localStorage.getItem("UserPhone");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/all-withdraw-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setWithdrawals(response.data.userWithdrawals);
        }
      } catch (error) {
        console.error("Error fetching withdrawal data:", error);
      }
    };

    fetchWithdrawals();
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [amount, setAmount] = useState("");

  const handleButtonClick = (value) => {
    setAmount(value);
  };

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };
  const [walletData, setWalletData] = useState(0);
  const [userWithdrawalRequests, setUserWithdrawalRequests] = useState([]);
  const [existingBankDetails, setExistingBankDetails] = useState(null);
  const [openBankDialog, setOpenBankDialog] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("Bank Card");
  const [existingUsdtDetails, setExistingUsdtDetails] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isUsdtOn, setIsUsdtOn] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    name: "",
    accountNo: "",
    ifscCode: "",
    bankName: "",
    mobile: "",
  });

  const [usdtDetails, setUsdtDetails] = useState({
    walletAddress: [{ address: "", alias: "" }], // Updated to directly manage TRX address and alias
    network: "",
  });

  const handleRedirect = () => {
    navigate(-1);
  };

  const handlePage = () => {
    navigate("/withdraw-history");
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user/bank-details/show`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("bank details -->", response.data);

        // Check if response data is not empty and has bank details
        if (response.data && response.data.length > 0) {
          setBankDetails(response.data[0]); // Set the first object from the response data
        } else {
          setBankDetails(null); // Set bankDetails to null if no data is available
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
        setBankDetails(null); // Set bankDetails to null in case of an error
      }
    };

    fetchBankDetails();
  }, []);

  useEffect(() => {
    // Clear amount when withdrawal method changes
    setAmount("");
  }, [withdrawalMethod]);

  // Truncate bank name to 10 characters followed by "..."
  const truncatedBankName =
    bankDetails?.bankName && bankDetails.bankName.length > 10
      ? `${bankDetails.bankName.substring(0, 10)}...`
      : bankDetails?.bankName || "";

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        console.log("Fetching bank details...");
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user/trxaddress-show`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.walletAddress.length > 0) {
          // Store the entire array of wallet addresses and the network
          setUsdtDetails({
            walletAddress: response.data.walletAddress, // Store all addresses, not just the first one
            network: response.data.network,
          });
          setExistingUsdtDetails(response.data);
        } else {
          // Handle the case where no data is found
          console.log("No data in response");
          setUsdtDetails({ walletAddress: [], network: "" });
        }
      } catch (err) {
        console.error("Error fetching TRX address details:", err);
        // Handle errors and update state if needed
        setUsdtDetails({ walletAddress: [], network: "" });
        // Optionally set an error message state here
      }
    };

    fetchBankDetails();
  }, []);

  // Separate useEffect to log usdtDetails whenever it changes
  useEffect(() => {
    console.log("USDT details:", usdtDetails);
  }, [usdtDetails]);

  const handleBankDetailsChange = (event) => {
    const { name, value } = event.target;

    if (withdrawalMethod === "Bank Card") {
      setBankDetails({
        ...bankDetails,
        [name]: value,
      });
    } else {
      if (name === "network") {
        // Handle changes to the network field
        setUsdtDetails({
          ...usdtDetails,
          [name]: value,
        });
      } else if (name.startsWith("address") || name.startsWith("alias")) {
        // Handle changes to wallet address fields
        const index = parseInt(name.match(/\d+/)[0], 10); // Extract index from name

        setUsdtDetails((prevDetails) => {
          const updatedWalletAddress = [...prevDetails.walletAddress];
          updatedWalletAddress[index] = {
            ...updatedWalletAddress[index],
            [name.split("-")[1]]: value, // Update specific field (address or alias)
          };

          return {
            ...prevDetails,
            walletAddress: updatedWalletAddress,
          };
        });
      }
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location, "location");
  const handleWidthdrawback = () => {
    if (location.state?.from === "addbank") {
      // Redirect to 'withdrawal' page
      navigate("/withdrawal");
    } else {
      // Optionally handle cases where the previous page is not 'addbank'
      navigate(-1);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };
  const handleWithdraw = async () => {
    // Parse withdrawal amounts
    const usdtAmountNum = parseFloat(usdtAmount);
    const withdrawalAmountNum = parseFloat(withdrawalAmount);

    // Check withdrawal method and perform validation
    if (withdrawalMethod === "Bank Card") {
      // Validate bank account number
      if (!bankDetails.accountNo || bankDetails.accountNo.trim() === "") {
        window.alert("Please enter your bank account number.");
        return;
      }

      // Validate withdrawal amount for Bank Card
      if (
        withdrawalAmountNum < withdrawData.minWithdrawAmount ||
        withdrawalAmountNum > withdrawData.maxWithdrawAmount
      ) {
        window.alert(
          `Please enter an amount between ₹${withdrawData.minWithdrawAmount} and ₹${withdrawData.maxWithdrawAmount}.`
        );
        return;
      }

      // Ensure withdrawal amount is a valid number
      if (isNaN(withdrawalAmountNum)) {
        window.alert("Please enter a valid withdrawal amount.");
        return;
      }
    } else if (withdrawalMethod === "USDT") {
      // Validate USDT wallet address
      if (!existingUsdtDetails || !existingUsdtDetails.walletAddress) {
        window.alert("Please set up your USDT wallet address first.");
        return;
      }

      // Ensure USDT amount is valid
      if (isNaN(usdtAmountNum)) {
        window.alert("Please enter a valid USDT amount.");
        return;
      }

      // Validate USDT withdrawal amount
      if (usdtAmountNum < 10) {
        window.alert("USDT amount must be at least $10.");
        return;
      }

      if (usdtAmountNum > 100) {
        window.alert("USDT amount cannot exceed $100.");
        return;
      }
    }

    // Show password confirmation modal after validation passes
    showPasswordConfirmation();
  };

  // Function to show password confirmation modal
  const showPasswordConfirmation = () => {
    // Create modal element
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.zIndex = "1000";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "white";
    modalContent.style.borderRadius = "8px";
    modalContent.style.padding = "20px";
    modalContent.style.width = "90%";
    modalContent.style.maxWidth = "400px";
    modalContent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    // Create modal header
    const modalHeader = document.createElement("div");
    modalHeader.style.display = "flex";
    modalHeader.style.justifyContent = "space-between";
    modalHeader.style.alignItems = "center";
    modalHeader.style.marginBottom = "15px";

    // Title
    const title = document.createElement("h3");
    title.textContent = "Confirm Withdrawal";
    title.style.margin = "0";
    title.style.fontSize = "18px";
    title.style.fontWeight = "bold";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => document.body.removeChild(modalOverlay);

    modalHeader.appendChild(title);
    modalHeader.appendChild(closeButton);

    // Create withdrawal info section
    const infoSection = document.createElement("div");
    infoSection.style.backgroundColor = "#f5f5f5";
    infoSection.style.borderRadius = "4px";
    infoSection.style.padding = "10px";
    infoSection.style.marginBottom = "15px";

    const infoText = document.createElement("p");
    infoText.style.margin = "0";
    infoText.style.fontSize = "14px";

    if (withdrawalMethod === "Bank Card") {
      infoText.textContent = `Withdrawing ₹${withdrawalAmount} to your bank account`;
    } else {
      infoText.textContent = `Withdrawing $${usdtAmount} USDT to your wallet`;
    }

    infoSection.appendChild(infoText);

    // Create password input section
    const inputContainer = document.createElement("div");
    inputContainer.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.textContent = "Enter your password to confirm";
    label.style.display = "block";
    label.style.marginBottom = "5px";
    label.style.fontSize = "14px";
    label.style.fontWeight = "500";

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.style.width = "100%";
    passwordInput.style.padding = "8px 12px";
    passwordInput.style.borderRadius = "4px";
    passwordInput.style.border = "1px solid #ddd";
    passwordInput.style.boxSizing = "border-box";

    // Error message element
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.style.fontSize = "14px";
    errorMsg.style.margin = "5px 0 0 0";
    errorMsg.style.display = "none";

    inputContainer.appendChild(label);
    inputContainer.appendChild(passwordInput);
    inputContainer.appendChild(errorMsg);

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "flex-end";
    buttonsContainer.style.gap = "10px";

    // Confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm Withdrawal";
    confirmButton.style.padding = "8px 16px";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "4px";
    confirmButton.style.backgroundColor = "#F95959";
    confirmButton.style.color = "black";
    confirmButton.style.cursor = "pointer";

    confirmButton.onclick = async () => {
      const password = passwordInput.value;

      // Check if password is empty
      if (!password) {
        errorMsg.textContent = "Please enter your password";
        errorMsg.style.display = "block";
        return;
      }

      try {
        // Show loading state
        confirmButton.disabled = true;
        confirmButton.textContent = "Verifying...";

        const response = await axios.post(`${domain}/login`, {
          mobile,
          password,
        });

        if (response.status === 200) {
          // Password is correct, proceed with withdrawal
          document.body.removeChild(modalOverlay);
          // Execute the actual withdrawal
          await executeWithdrawal();
        }
      } catch (error) {
        console.log(error);

        // Display error message
        errorMsg.textContent = "Incorrect password. Please try again.";
        errorMsg.style.display = "block";
        errorMsg.style.color = "red";

        // Shake the password input to indicate error
        passwordInput.style.borderColor = "red";
        passwordInput.style.animation = "shake 0.5s";

        // Add shake animation keyframes if not already in document
        if (!document.getElementById("shake-animation")) {
          const style = document.createElement("style");
          style.id = "shake-animation";
          style.textContent = `
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
              20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
          `;
          document.head.appendChild(style);
        }

        // Clear password field
        passwordInput.value = "";
      } finally {
        // Reset button state
        confirmButton.disabled = false;
        confirmButton.textContent = "Confirm Withdrawal";
      }
    };

    // buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(confirmButton);

    // Assemble modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(infoSection);
    modalContent.appendChild(inputContainer);
    modalContent.appendChild(buttonsContainer);

    // Add modal to document
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
  };

  // Function to execute the withdrawal after password confirmation
  const executeWithdrawal = async () => {
    const usdtAmountNum = parseFloat(usdtAmount);
    const withdrawalAmountNum = parseFloat(withdrawalAmount);

    // Handling Bank Card Withdrawals
    if (withdrawalMethod === "Bank Card") {
      // Proceed with Bank Card withdrawal request
      try {
        const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
        const response = await fetch(`${domain}/withdraw-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            balance: withdrawalAmountNum,
            withdrawMethod: "Bank Card",
            accountNo: bankDetails.accountNo,
          }),
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          console.error(
            "Response status:",
            response.status,
            "Status text:",
            response.statusText
          );
          throw new Error(
            data.message || "Bank Card withdrawal request failed"
          );
        }

        // Notify the user of a successful withdrawal
        window.alert(
          data.message || "Bank Card withdrawal request was successful."
        );

        // Reset Bank Card form fields
        setWithdrawalAmount("");
      } catch (error) {
        console.error("Error:", error);
        window.alert("An error occurred: " + error.message);
      }
    }

    // Handling USDT Withdrawals
    else if (withdrawalMethod === "USDT") {
      // Proceed with USDT withdrawal request
      try {
        const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
        const response = await fetch(`${domain}/withdraw-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            balance: usdtAmountNum,
            withdrawMethod: "USDT",
            walletAddress: existingUsdtDetails.walletAddress,
          }),
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          console.error(
            "Response status:",
            response.status,
            "Status text:",
            response.statusText
          );
          throw new Error(data.message || "USDT withdrawal request failed");
        }

        // Notify the user of a successful withdrawal
        window.alert(data.message || "USDT withdrawal request was successful.");

        // Reset USDT form fields
        setUsdtAmount("");
        setWithdrawalAmount("");
      } catch (error) {
        console.error("Error:", error);
        window.alert("An error occurred: " + error.message);
      }
    }
  };

  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in localStorage
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
  };

  const [betAmount, setBetamount] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          `${domain}/calculateRemainingBetAmount`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBetamount(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const [withdrawData, setWithdrawData] = useState(null);
  console.log(withdrawData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          `${domain}/settings-withdraw?isUsdtOn=${isUsdtOn}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response.data-->", response.data);
        setWithdrawData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [isUsdtOn]);

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState("");

  const handleWithdrawalAmountChange = (e) => {
    const value = e.target.value;
    setWithdrawalAmount(value);

    // Calculate and update usdtAmount
    const withdrawalAmountNum = parseFloat(value);
    if (!isNaN(withdrawalAmountNum)) {
      setUsdtAmount((withdrawalAmountNum / 93).toFixed(2)); // Update usdtAmount based on withdrawalAmount
    }
  };
  const handleUsdtAmountChange = (e) => {
    const value = e.target.value;
    setUsdtAmount(value);

    // Calculate and update withdrawalAmount
    const usdtAmountNum = parseFloat(value);
    if (!isNaN(usdtAmountNum)) {
      setWithdrawalAmount((usdtAmountNum * 93).toFixed(2)); // Update withdrawalAmount based on USDT amount
    }
  };

  useEffect(() => {
    setWithdrawalAmount("");
    setUsdtAmount("");
  }, [withdrawalMethod]);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
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
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "white", mr: 8 }}
                    onClick={handleWidthdrawback}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      flexGrow: 1,
                    }}
                    onClick={handlePage}
                  >
                    Withdraw history
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              mt={1}
              style={{
                backgroundImage: `url("https://www.66lottery9.com/static/deposit/diban.png")`,
                borderRadius: 8,
                padding: 8,
                backgroundSize: "cover",
                width: "95%",
                marginLeft: "auto",
                marginRight: "auto",
                height: "140px",
                marginTop: "1rem",
              }}
            >
              <Grid container item alignItems="center" mt={1}>
                <Grid item xs={2} align="center">
                  <img
                    src="assets/images/download (16).png"
                    alt="Your Image"
                    style={{ maxWidth: "30%" }} // Adjusted maxWidth for better fit
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    fontSize="15px"
                    sx={{ color: "white", marginRight: "15px" }}
                    align="left"
                  >
                    Available Balance
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item alignItems="center" mt={-1} mb={7}>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "24px",
                  }}
                >
                  <Typography
                    fontSize="20px"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    ₹{user ? user?.walletAmount?.toFixed(2) : "Loading.."}
                  </Typography>
                  <IconButton sx={{ marginLeft: "10px", fontWeight: "bold" }}>
                    <RefreshIcon
                      onClick={handleRefresh}
                      style={{ color: "#ffffff" }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              mt={0}
              style={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "10px",
                alignItems: "center",
              }}
            >
              <Grid item xs={4}>
                <div
                  onClick={() => {
                    setWithdrawalMethod("Bank Card");
                    setIsUsdtOn(false);
                  }}
                  style={{
                    background:
                      withdrawalMethod === "Bank Card" ? "#F95959" : "#ffffff",
                    color:
                      withdrawalMethod === "Bank Card" ? "#ffffff" : "black",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <img
                    src="assets/images/WithBeforeImgIcon2_20231215045210hewa.png"
                    alt="Image 1"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "50%",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 8 }}
                  >
                    Bank Card
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4}>
                <div
                  onClick={() => {
                    setWithdrawalMethod("USDT");
                    setIsUsdtOn(true);
                  }}
                  style={{
                    background:
                      withdrawalMethod === "USDT" ? "#F95959" : "#ffffff",
                    color: withdrawalMethod === "USDT" ? "#ffffff" : "black",
                    borderRadius: 8,
                    padding: 16,

                    cursor: "pointer", // To show the clickable cursor
                  }}
                >
                  <img
                    src="assets/images/USDT.png"
                    alt="USDT"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      maxWidth: "50%",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ marginTop: 8 }}
                  >
                    USDT
                  </Typography>
                </div>
              </Grid>
            </Grid>

            {withdrawalMethod === "USDT" && (
              <Grid
                container
                spacing={1}
                mt={2}
                xs={12}
                style={{
                  width: "95%",
                  margin: "1rem auto",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  // padding: "10px", // Add padding for visual consistency
                }}
              >
                {usdtDetails.walletAddress.length > 0 ? (
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 16px",
                      borderRadius: "8px",

                      width: "100%",
                      height: "100%", // Ensure Card takes full height of the parent
                      margin: "0 auto",
                      flexGrow: 1, // Allow Card to grow and fill the height
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src="../../assets/3-6bb1e3bd.png"
                        alt="TRC Logo"
                        sx={{
                          width: "24px",
                          height: "24px",
                          marginRight: "8px",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "gray" }}
                      >
                        TRC
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#757575", fontSize: "17px" }}
                      >
                        {usdtDetails.walletAddress[0]?.address}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#F95959" }}>
                        {usdtDetails.walletAddress[0]?.alias || "No Alias"}
                      </Typography>
                    </Box>

                    <ArrowForwardIosIcon
                      sx={{ fontSize: "16px", color: "#757575" }}
                    />
                  </Card>
                ) : (
                  <Link
                    to="/usdtaddress"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ textAlign: "center", padding: 16 }}
                    >
                      <img
                        src="/assets/images/download (17).png"
                        alt="Add Bank Details"
                        style={{
                          display: "block",
                          margin: "0 auto",
                          maxWidth: "20%",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography
                        variant="caption"
                        align="center"
                        style={{ marginTop: 8, color: "#666462" }}
                      >
                        Add address
                      </Typography>
                    </Grid>
                  </Link>
                )}
              </Grid>
            )}

            {withdrawalMethod === "Bank Card" && bankDetails ? (
              <Grid
                container
                alignItems="center"
                style={{
                  width: "95%",
                  margin: "20px auto",

                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "10px",
                  height: "80px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/addBank"); // Replace with your actual route
                }}
              >
                <Grid item xs={4} style={{ textAlign: "center" }}>
                  <AccountBalanceIcon
                    style={{ color: "#f2c200", fontSize: "30px" }}
                  />
                  <Typography
                    variant="body2"
                    style={{ color: "#666462", marginTop: "4px" }}
                  >
                    {truncatedBankName}
                  </Typography>
                </Grid>
                <Grid item style={{ margin: "0 10px" }}>
                  <div
                    style={{
                      borderLeft: "1px solid #d3d3d3",
                      height: "30px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{ color: "#666462" }}>
                    {bankDetails.accountNo}
                  </Typography>
                </Grid>
                <Grid item style={{ marginLeft: "auto" }}>
                  <ChevronRightIcon style={{ color: "#666462" }} />
                </Grid>
              </Grid>
            ) : (
              withdrawalMethod === "Bank Card" && (
                <Grid
                  container
                  spacing={1}
                  mt={2}
                  xs={12}
                  style={{
                    width: "95%",
                    // marginLeft: "20px",
                    margin: "1rem auto",

                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                  }}
                >
                  <Grid item xs={12}>
                    <img
                      src="/assets/images/download (17).png"
                      alt="Add Bank Details"
                      style={{
                        display: "block",
                        margin: "0 auto",
                        maxWidth: "20%",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="caption"
                      align="center"
                      style={{ marginTop: 8, color: "#666462" }}
                    >
                      ADD BANK DETAILS
                    </Typography>
                    <Button
                      onClick={() => {
                        navigate("/addbank");
                      }}
                    >
                      GO Here
                    </Button>
                  </Grid>
                </Grid>
              )
            )}

            <Grid
              container
              spacing={1}
              mt={2}
              xs={12}
              sx={{
                width: "95%",
                margin: "0 auto",

                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              {/* Conditional Rendering for Bank Card */}

              {withdrawalMethod === "Bank Card" && (
                <>
                  {/* Amount Input */}
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Please enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      fullWidth
                      sx={{
                        backgroundColor: "#ffffff",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#F95959",
                          },
                          "&:hover fieldset": {
                            borderColor: "#F95959",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#F95959",
                          },
                          "& input": {
                            color: "black",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "black",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span
                              style={{
                                color: "#F95959",
                                fontSize: "20px",
                                fontWeight: "bold",
                              }}
                            >
                              ₹
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Balance Information */}
                  <Grid item container xs={12} spacing={3}>
                    <Grid item xs={9}>
                      <Typography
                        variant="body2"
                        align="left"
                        sx={{ color: "#768096" }}
                      >
                        Minimum Amount: ₹
                        {withdrawData ? withdrawData.minWithdrawAmount : "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="left"
                        sx={{ color: "#768096" }}
                      >
                        Maximum Amount: ₹
                        {withdrawData ? withdrawData.maxWithdrawAmount : "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" align="right">
                        <span style={{ color: "#768096" }}> Amount: </span>
                      </Typography>
                      <Typography variant="body2" align="right">
                        <span style={{ color: "rgb(221,145,56)" }}>
                          ₹{withdrawalAmount || 0}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Withdraw Button */}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        bgcolor: "#F95959",
                        "&:hover": {
                          background: "#F95959",
                        },
                        borderRadius: "20px",
                        color: "black", // Ensure text color is white
                      }}
                      onClick={handleWithdraw}
                      disabled={!withdrawalAmount || !withdrawalMethod}
                    >
                      Withdrawee
                    </Button>
                  </Grid>
                </>
              )}

              {withdrawalMethod === "USDT" && (
                <>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <img
                        src="/assets/3-6bb1e3bd.png"
                        alt="Tether Icon"
                        style={{
                          color: "#26A17B",
                          marginRight: "8px",
                          height: "24px",
                          width: "24px",
                        }}
                      />
                      <Typography variant="subtitle1">
                        Select amount of USDT
                      </Typography>
                    </Box>

                    <TextField
                      fullWidth
                      value={usdtAmount}
                      onChange={handleUsdtAmountChange}
                      placeholder="Please enter USDT amount"
                      variant="outlined"
                      sx={{
                        mb: 1.5,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#F5F5F5",
                          borderRadius: "10px",
                          height: "45px",
                          "& fieldset": {
                            border: "none",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#F95959",
                          opacity: 1,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img
                              src="/assets/3-6bb1e3bd.png"
                              alt="Tether Icon"
                              style={{ height: "24px", width: "24px" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {parseFloat(usdtAmount) < 10 && usdtAmount && (
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{
                          mt: 0.5,
                          mb: 1,
                          textAlign: "left",
                          fontSize: "0.8rem",
                        }}
                      >
                        Minimum USDT withdrawal amount is $10.
                      </Typography>
                    )}

                    {parseFloat(usdtAmount) > 100 && usdtAmount && (
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{
                          mt: 0.5,
                          mb: 1,
                          textAlign: "left",
                          fontSize: "0.8rem",
                        }}
                      >
                        Maximum USDT withdrawal amount is $100.
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      value={withdrawalAmount}
                      onChange={handleWithdrawalAmountChange}
                      placeholder="Please enter withdrawal amount"
                      variant="outlined"
                      sx={{
                        mb: 1.5,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#F5F5F5",
                          borderRadius: "10px",
                          height: "45px",
                          "& fieldset": {
                            border: "none",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#F95959",
                          opacity: 1,
                        },
                        color: "#F95959",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{ color: "#F95959", fontWeight: "bold" }}
                            >
                              ₹
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {showWarning && (
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{
                          mt: 0.5,
                          mb: 1,
                          textAlign: "left",
                          fontSize: "0.8rem",
                        }}
                      >
                        Single withdrawal amount range from ₹1,000~₹1,000,000
                      </Typography>
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Withdrawable balance ₹{user?.walletAmount}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#F95959",
                        color: "#F95959",
                        minWidth: "60px",
                      }}
                      onClick={() => {
                        setWithdrawalAmount(user?.walletAmount);
                        setUsdtAmount((user?.walletAmount / 93).toFixed(2));
                        setShowWarning(true); // Show warning message
                      }}
                    >
                      All
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(180deg, #F95959 0%, #F95959 30%,#F95959 100%)",
                        "&:hover": {
                          background:
                            "linear-gradient(180deg, #F95959 0%, #F95959 30%, #F95959 100%)",
                        },
                      }}
                      onClick={handleWithdraw}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                </>
              )}
              {/* Fourth row */}
              {!withdrawData?.isUsdt && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      margin: "1px -8px",
                      borderRadius: 2,
                      // padding: 1,
                      alignItems: "center",
                    }}
                  >
                    <List
                      sx={{
                        backgroundColor: "#ffffff",
                        padding: 1,
                        border: "1px solid #E0E0E0",
                        borderRadius: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      <ListItem sx={{ padding: "5px 0" }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem", // Set font size to 0.8rem
                              }}
                            >
                              Need to bet
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                  marginRight: "4px",
                                }}
                              >
                                ₹
                                {betAmount
                                  ? betAmount.remainingBetAmount.toFixed(2)
                                  : 0.0}
                              </span>
                              to be able to withdraw
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem", // Set font size to 0.8rem
                              }}
                            >
                              Withdraw Hour{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                }}
                              >
                                {withdrawData
                                  ? withdrawData.withdrawalStartHour
                                  : "8AM"}{" "}
                                -{" "}
                                {withdrawData
                                  ? withdrawData.withdrawalEndHour
                                  : "9 PM"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem", // Set font size to 0.8rem
                              }}
                            >
                              Daily Withdrawal Times Limits{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                }}
                              >
                                {withdrawData
                                  ? withdrawData.maxWithdrawRequestsPerDay
                                  : "0"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                fontSize: "0.8rem", // Set font size to 0.8rem
                              }}
                            >
                              Withdrawal amount range{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",

                                  marginLeft: "4px",
                                }}
                              >
                                ₹
                                {withdrawData
                                  ? withdrawData.minWithdrawAmount
                                  : "0"}{" "}
                                - ₹
                                {withdrawData
                                  ? withdrawData.maxWithdrawAmount
                                  : "0"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ color: "#555", fontSize: "0.8rem" }} // Set font size to 0.8rem
                            >
                              Please confirm your beneficial account information
                              before withdrawing. If your information is
                              incorrect, our company will not be liable for the
                              amount of loss.
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ color: "#555", fontSize: "0.8rem" }} // Set font size to 0.8rem
                            >
                              If your beneficial information is incorrect,
                              please contact customer service.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              )}

              {withdrawData?.isUsdt && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      margin: "1px -8px",
                      borderRadius: 2,
                      alignItems: "center",
                    }}
                  >
                    <List
                      sx={{
                        backgroundColor: "#ffffff",
                        padding: 1,
                        border: "1px solid #E0E0E0",
                        borderRadius: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      <ListItem sx={{ padding: "5px 0" }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem",
                              }}
                            >
                              Need to bet
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                  marginRight: "4px",
                                }}
                              >
                                $
                                {betAmount
                                  ? betAmount.remainingBetAmount.toFixed(2)
                                  : 0.0}
                              </span>
                              to be able to withdraw
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem",
                              }}
                            >
                              Withdraw Hour{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                }}
                              >
                                {withdrawData
                                  ? withdrawData.withdrawalStartHour
                                  : "8AM"}{" "}
                                -{" "}
                                {withdrawData
                                  ? withdrawData.withdrawalEndHour
                                  : "9 PM"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.8rem",
                              }}
                            >
                              Daily Withdrawal Times Limits{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                }}
                              >
                                {withdrawData
                                  ? withdrawData.maxWithdrawRequestsPerDay
                                  : "0"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#555",
                                fontSize: "0.8rem",
                              }}
                            >
                              Withdrawal amount range{" "}
                              <span
                                style={{
                                  color: "rgb(210,56,56)",
                                  marginLeft: "4px",
                                }}
                              >
                                $
                                {withdrawData
                                  ? withdrawData.minWithdrawAmount
                                  : "0"}{" "}
                                - $
                                {withdrawData
                                  ? withdrawData.maxWithdrawAmount
                                  : "0"}
                              </span>
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ color: "#555", fontSize: "0.8rem" }}
                            >
                              Please confirm your beneficial account information
                              before withdrawing. If your information is
                              incorrect, our company will not be liable for the
                              amount of loss.
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ padding: "8px 0", mt: -1.5 }}>
                        <ListItemIcon
                          sx={{ minWidth: "unset", marginRight: "8px" }}
                        >
                          <RhombusIcon
                            sx={{ fontSize: 10, color: "#F95959", mr: 1 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ color: "#555", fontSize: "0.8rem" }}
                            >
                              If your beneficial information is incorrect,
                              please contact customer service.
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Box sx={{ paddingX: "1rem", marginBottom: "3rem" }}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "0.5rem",
                  marginTop: "1.5rem",
                  textAlign: "left",
                }}
              >
                Withdrawal Histories
              </Typography>

              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <Card
                    key={withdrawal._id}
                    sx={{
                      marginBottom: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent sx={{ padding: 0, mb: -2 }}>
                      <Box
                        sx={{ padding: 1, borderBottom: "1px solid #e0e0e0" }}
                      >
                        <Grid container alignItems="center">
                          <Grid item xs={6} sx={{ textAlign: "left" }}>
                            <Chip
                              label="Withdraw"
                              sx={{
                                backgroundColor: "#F95959",
                                color: "white",
                                fontWeight: "bold",
                                height: "24px", // Adjusting height to match the image
                                fontSize: "14px",
                                borderRadius: "4px",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                color:
                                  withdrawal.status === "Completed"
                                    ? "#27ae60"
                                    : withdrawal.status === "Pending"
                                    ? "#f39c12"
                                    : "#e74c3c",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {withdrawal.status}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{ padding: 1.5 }}>
                        <Grid container spacing={1} sx={{ textAlign: "left" }}>
                          {[
                            {
                              label: "Balance",
                              value: `₹${withdrawal.balance}`,
                              color: "#e67e22",
                              fontSize: "14px",
                              fontWeight: "bold",
                            },
                            {
                              label: "Type",
                              value: withdrawal.withdrawMethod,
                              fontSize: "12px",
                            },
                            {
                              label: "Time",
                              value: new Date(
                                withdrawal.createdAt
                              ).toLocaleString(),
                              fontSize: "12px",
                            },
                            {
                              label: "Order number",
                              value: withdrawal._id,
                              fontSize: "12px",
                            },
                          ].map(
                            ({ label, value, color, fontSize, fontWeight }) => (
                              <React.Fragment key={label}>
                                <Grid item xs={6}>
                                  <Typography
                                    sx={{
                                      color: "#7f8c8d",
                                      fontSize: "13px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {label}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: "right" }}>
                                  <Typography
                                    sx={{
                                      fontSize,
                                      fontWeight: fontWeight || "medium",
                                      color: color || "inherit",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                </Grid>
                              </React.Fragment>
                            )
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  <img
                    src="../../games/assets/No data-rafiki.png" // Replace with the correct path to your image file
                    alt="No data available"
                    style={{ width: "150px", marginBottom: "10px" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#757575",
                      marginBottom: "1rem",
                    }}
                  >
                    No withdraw history available.
                  </Typography>
                </Box>
              )}

              {/* Button to navigate to All Withdrawal Histories */}
              <Box
                sx={{
                  textAlign: "center",
                  marginTop: "10%",
                  marginBottom: "20%",
                }}
              >
                <Button
                  onClick={() => (window.location.href = "/withdraw-history")}
                  variant="contained"
                  color="primary"
                  sx={{
                    width: "100%",
                    textTransform: "initial",
                    borderRadius: "20px",
                    background: "#F95959",
                    "&:hover": {
                      background: "l#F95959",
                    },
                  }}
                >
                  All Withdraw Histories
                </Button>
              </Box>
            </Box>
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default WithDrawMain;
