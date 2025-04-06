import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Mobile from "./Mobile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";

// Background with Image and Gradient
const ImageBackground = styled(Box)({
  position: "relative",
  backgroundImage: `url("../../assets/box-5efaaed8.png"), linear-gradient(45deg,#FA8F32, #FA8F32)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "16px",
  zIndex: 1,
  color: "white",
  height: "150px",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("../assets/invitation_bg.png")',
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    opacity: 1,
    zIndex: 1,
  },
});

const GrayButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  color: "#333",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
  textTransform: "none",
  justifyContent: "center",
  padding: "8px 16px",
  width: "48%",
  borderRadius: "8px",
  fontSize: "14px",
}));

const StyledIconButton = styled(IconButton)({
  fontSize: "20px",
  color: "#757575",
});

const InvitationBonusComponent = () => {
  const navigate = useNavigate();
  const [isDataFetching, setIsDataFetching] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [claimedBonuses, setClaimedBonuses] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEligibilityStatus = async () => {
    try {
      setIsDataFetching(true);
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/check-eligibility-status`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.data || !Array.isArray(response.data.bonusDetails)) {
        throw new Error("Invalid data format received from server");
      }
  
      const transformedData = {
        ...response.data,
        bonusDetails: response.data.bonusDetails.map((bonus, index) => ({
          ...bonus,
          displayLevel: bonus.displayLevel || (index + 1).toString(),
        })),
      };
  
      setEligibilityData(transformedData);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error in fetchEligibilityStatus:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Unable to fetch eligibility status. Please try again."
      );
    } finally {
      setIsDataFetching(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted - initiating data fetch");
    fetchEligibilityStatus();
  }, []);

  const handleBackClick = () => {
    console.log("Navigating back");
    navigate(-1);
  };
  const handleClaimBonus = async (level) => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/check-referral-bonus`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data) {
        // After successful claim, fetch updated data
        await fetchEligibilityStatus();
        // Show success message
        setSnackbar({
          open: true,
          message: "Bonus claimed successfully!",
          severity: "success",
        });
      } else {
        console.error("Failed to claim bonus");
        setSnackbar({
          open: true,
          message: "Failed to claim bonus. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while claiming the bonus.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  const getBonusStatus = (bonus) => {
    const { progress, achieved } = bonus;

    if (achieved) {
        return {
            text: "Already Claimed",
            disabled: true,
            color: "#e0e0e0",
            backgroundColor: "#d5d5d5"
        };
    }

    const hasRequiredReferrals =
        progress.referrals.total >= progress.referrals.required;
    const hasQualifyingDeposits =
        progress.referrals.qualifying >= progress.referrals.required;

    if (hasRequiredReferrals && hasQualifyingDeposits) {
        return {
            text: "Claim",
            disabled: false,
            color: "#ffffff",
            backgroundColor: "#4CAF50" // Green color for claimable status
        };
    }

    return {
        text: "Unfinished",
        disabled: true,
        color: "#666",
        backgroundColor: "#d5d5d5"
    };
};

  useEffect(() => {
    fetchEligibilityStatus();
  }, []);

  if (errorMessage) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchEligibilityStatus}
          sx={{ bgcolor: "#F95959" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (isDataFetching || !eligibilityData) {
    return (
      <Mobile>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading invitation bonus details...</Typography>
        </Box>
      </Mobile>
    );
  }

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#F7F8FF",
          minHeight: "100vh",
          maxWidth: "sm",
          mx: "auto",
        }}
      >
        <AppBar position="static" sx={{ bgcolor: "#F95959" }}>
          <Toolbar>
            <Grid item xs={2} textAlign="left">
              <IconButton color="inherit" onClick={handleBackClick}>
                <ArrowBackIosOutlinedIcon sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, fontWeight: "normal", fontSize: "18px" }}
            >
              Invitation Bonus
            </Typography>
          </Toolbar>
        </AppBar>

        <ImageBackground>
          <Box sx={{ position: "relative", zIndex: 2, textAlign: "left" }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
            >
              Invite friends and deposit
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Both parties can receive rewards
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Invite friends to register and recharge
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              to receive rewards
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontSize: "14px" }}>
              activity date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", color: "white" }}
            >
              2024-05-03 - End date is not declared
            </Typography>
          </Box>
        </ImageBackground>

        <Box
          sx={{
            p: 1,
            margin: 5,
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            marginTop: "-3%",
            zIndex: 10,
            position: "relative",
            gap: 2,
           
          }}
        >
          {/* Invitation Reward Rules */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
            onClick={()=>{navigate("/invitationBonusPage")}}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/inviterule-7c5f5524.svg"
                alt="Invitation Reward Rules"
                sx={{ width: "40px", height: "40px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#333", fontWeight: "500" }}
            >
              Invitation reward rules
            </Typography>
          </Box>

          {/* Invitation Record */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
            onClick={()=>{navigate("/invitationRecordPage")}}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/inviterecord-83990d9a.svg"
                alt="Invitation Record"
                sx={{ width: "40px", height: "40px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#333", fontWeight: "500" }}
            >
              Invitation record
            </Typography>
          </Box>
        </Box>
        <Box sx={{ px: 2, boxShadow: "none" }}>
    {eligibilityData.bonusDetails.map((bonus, index) => {
        const bonusStatus = getBonusStatus(bonus);

        return (
            <Box
                key={index}
                sx={{
                    height:260,
                    bgcolor: "white",
                    color: "#333",
                    borderRadius: "12px",
                    overflow: "hidden",
                    mb: 2,
                    position: "relative",
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                    },
                    "&::before": {
                        left: "-8px",
                    },
                    "&::after": {
                        right: "-8px",
                    },
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        padding: "1px 12px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
    sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgb(254,148,42)",
        padding: "1px 12px",
        borderRadius: "20px  0 20px 0", // Left side rounded, right side flat (like your image)
        height: "40px"
    }}
>
    {/* Bonus Text */}
    <Typography
        sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
        }}
    >
        Bonus
    </Typography>

    {/* Number Circle */}
    <Box
        sx={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "white",
            color: "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            marginLeft: "6px", // Space between Bonus and number
        }}
    >
        {bonus.displayLevel} {/* <- Use your actual value here */}
    </Box>

    {/* Close Icon Circle */}
    <IconButton
        size="small"
        sx={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "white",
            marginLeft: "6px", // Space between number and X
            padding: "0",
            border: "1px solid #ddd", // subtle border like the image
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                backgroundColor: "#f5f5f5"
            }
        }}
    >
        <CloseIcon sx={{ fontSize: "14px", color: "#888" }} />
    </IconButton>
</Box>

                        <StyledIconButton size="small" sx={{ color: "white" }}>
                            <CloseIcon fontSize="small" />
                        </StyledIconButton>
                    </Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ fontSize: "16px", color: "#f90" }}
                    >
                        ₹{bonus.bonusAmount.toFixed(2)}
                    </Typography>
                </Box>

                {/* Invitees and Recharge Section */}
                <Box sx={{ backgroundColor: "#f8f8f8", padding: "12px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "rgba(125, 120, 120, 0.12)",
                            borderRadius: "8px",
                            padding: "2px 4px",
                            mb: 1,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body2">Number of invitees</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {bonus.level}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "rgba(125, 120, 120, 0.12)",
                            borderRadius: "8px",
                            padding: "2px 4px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Typography variant="body2">Recharge per people</Typography>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: "#ff5050" }}
                        >
                            ₹{bonus.minDepositAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                {/* Progress Section */}
                <Box
                    sx={{
                        backgroundColor: "white",
                        padding: "12px",
                        borderTop: "2px dashed #ddd",
                        display: "flex",
                        justifyContent: "space-evenly",
                        textAlign: "center",
                    }}
                >
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: "#F95959" }}
                        >
                            {bonus.progress.referrals.total} / {bonus.progress.referrals.required}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                            Number of invitees
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: "#ff5050" }}
                        >
                            {bonus.progress.referrals.qualifying} / {bonus.progress.referrals.required}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                            Deposit number
                        </Typography>
                    </Box>
                </Box>
                {/* Unfinished/Claim Button */}
                <Button
    fullWidth
    variant="contained"
    onClick={() => handleClaimBonus(bonus.displayLevel)}
    disabled={bonusStatus.disabled}
    sx={{
        bgcolor: bonusStatus.backgroundColor,
        color: bonusStatus.color,
        textTransform: "none",
        borderRadius: "40px",
        fontSize: "15px",
        fontWeight: "bold",
        "&:hover": { 
            bgcolor: bonusStatus.disabled ? "#d5d5d5" : "#45a049" // Darker green on hover for claimable status
        },
        padding: "10px 0",
        cursor: bonusStatus.disabled ? "not-allowed" : "pointer",
        width: 300,
    }}
>
    {bonusStatus.text}
</Button>

                {/* Snackbar Notification */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        );
    })}
</Box>


      </Box>
    </Mobile>
  );
};

export default InvitationBonusComponent;
