// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import HomeIcon from "@mui/icons-material/Home";
// import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import AccountIcon from "@mui/icons-material/AccountCircle";
// import RedeemIcon from "@mui/icons-material/Redeem";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import DiamondIcon from "@mui/icons-material/Diamond";
// import { Box } from "@mui/material";

// const BottomNavigationArea = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [value, setValue] = useState(location.pathname);

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

//   useEffect(() => {
//     setValue(location.pathname);
//   }, [location.pathname]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     navigate(newValue);
//   };

//   return (
//     <BottomNavigation
//       value={value}
//       onChange={handleChange}
//       showLabels
//       style={{
//         position: "fixed",
//         bottom: 0,
//         padding: "6px 0",
//         backgroundImage: "url(/assets/images/tabBarBg-01df93c.png)",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundColor: "transparent",
//         width: "100%",
//         maxWidth: isSmallScreen ? "" : "396px",
//         paddingTop: "1%",
//         // Adjust height based on screen size
//       }}
//     >
//       <BottomNavigationAction
//         style={{ color: value === "/home" ? "rgb(253,106,25)" : "#80849c" }}
//         label="Home"
//         value="/home"
//         icon={
//           <img
//             src={
//               value === "/home"
//                 ? "https://in.piccdn123.com/static/_template_/orange/img/home_cur.png"
//                 : "/assets/images/home-3e6a9291.png"
//             }
//             width="25px"
//             height="25px"
//             style={{
//               color: value === "/home" ? "#4782ff" : "#80849c", // hide image when src is empty
//             }}
//             alt="icon"
//           />
//         }
//       />
//       <BottomNavigationAction
//         style={{ color: value === "/activity" ? "rgb(253,106,25)" : "#80849c" }}
//         label="Activity"
//         value="/activity"
//         icon={
//           <img
//             src={
//               value === "/activity"
//                 ? "https://in.piccdn123.com/static/_template_/orange/img/activity_cur.png"
//                 : "/assets/images/activity-bb37b07c.png"
//             }
//             width="25px"
//             height="25px"
//             style={{
//               color: value === "/activity" ? "#4782ff" : "#80849c", // hide image when src is empty
//             }}

//             alt="icon"
//           />
//         }
//       />

//       <BottomNavigationAction
//          label="Promotion"
//          value="/promotion"
//          icon={
//            <Box
//             //  sx={{
//             //    width: "70px", // Slightly larger container
//             //    height: "70px",
//             //    backgroundColor: "white", // White background
//             //    borderRadius: "60%", // Circular shape
//             //    display: "flex",
//             //    alignItems: "center",
//             //    justifyContent: "center",
//             //    border: "2px solid #ccc", // Light border
//             //    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow
//             //  }}
//            >
//              <img
//                src="https://in.piccdn123.com/static/_template_/orange/img/promotionBg.png"
//                width="72px"
//                height="72px"
//                alt="icon"
//                style={{ objectFit: "contain" }}
//              />
//            </Box>
//          }
//          style={{
//            color: "rgb(253,106,25)",
//            marginTop: "-40px",
//          }}
//       />
//       <BottomNavigationAction
//         style={{ color: value === "/wallet" ? "rgb(253,106,25)" : "#80849c" }}
//         label="Wallet"
//         value="/wallet"
//         icon={
//           <img
//             src={
//               value === "/wallet"
//                 ? "https://in.piccdn123.com/static/_template_/orange/img/wallet_cur.png"
//                 : "/assets/images/wallet-dd37d20a.png"
//             }
//             width="25px"
//             height="25px"
//             style={{
//               color: value === "/wallet" ? "#4782ff" : "#80849c", // hide image when src is empty
//             }}
//             alt="icon"
//           />
//         }
//       />
//       <BottomNavigationAction
//         style={{ color: value === "/account" ? "rgb(253,106,25)" : "#80849c" }}
//         label="Account"
//         value="/account"
//         icon={
//           <img
//             src={
//               value === "/account"
//                 ? "https://in.piccdn123.com/static/_template_/orange/img/main_cur.png"
//                 : "/assets/images/main-53f64122.png"
//             }
//             width="25px"
//             height="25px"
//             style={{
//               color: value === "/account" ? "#4782ff" : "#80849c", // hide image when src is empty
//             }}
//             alt="icon"
//           />
//         }
//       />
//     </BottomNavigation>
//   );
// };

// export default BottomNavigationArea;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Typography } from "@mui/material";

const BottomNavigationArea = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  const styles = {
    bottomNav: {
      position: "fixed",
      bottom: 0,
      backgroundColor: "white",
      width: "100%",
      maxWidth: isSmallScreen ? "100%" : "396px",
      height: isSmallScreen ? "60px" : "70px",
      zIndex: 1000,
      boxShadow: "0px -2px 10px rgba(0,0,0,0.05)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "0 8px",
    },
    navItem: {
      minWidth: "auto",
      padding: 0,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 400,
      fontFamily: "Arial",
      fontSize: "12px",
      color: "#AEAEAE",
    },
    centerButton: {
      width: "80px", // Wider for oval shape
      height: "60px", // Slightly shorter for oval proportions
      position: "relative",
      bottom: "15px", // Adjust this to control how much it extends below nav bar
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 8px",
    },
    centerButtonInner: {
      width: "80px", // Match the width of centerButton
      height: "60px", // Match the height of centerButton
      backgroundColor: "#FF6B6B",
      borderRadius: "30px", // Rounded corners to create oval effect
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: "4px", // Add space for the label at bottom
    },
    icon: {
      width: "24px",
      height: "24px",
      marginBottom: "4px",
    },
    centerIcon: {
      width: "32px",
      height: "32px",
      color: "white",
      marginBottom: "2px",
    },
    label: {
      fontSize: "12px",
      fontFamily: "Arial",
      fontWeight: 400,
      marginTop: "2px",
    },
    centerLabel: {
      fontSize: "12px",
      fontFamily: "Arial",
      fontWeight: 400,
      color: "white",
      marginTop: "0px",
    },
  };

  return (
    <Box style={styles.bottomNav}>
      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/promotion" ? "#FF6B6B" : "#AEAEAE",
        }}
        label="Promotion"
        value="/promotion"
        onClick={() => handleChange(null, "/promotion")}
        icon={
          <Box display="flex" flexDirection="column" alignItems="center">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21L10.55,19.7C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5C22,12.28 18.6,15.36 13.45,19.7L12,21Z" />
            </svg>
            <Typography
              style={{
                ...styles.label,
                color: value === "/promotion" ? "#FF6B6B" : "#AEAEAE",
              }}
            >
              Promotion
            </Typography>
          </Box>
        }
      />

      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/activity" ? "#FF6B6B" : "#AEAEAE",
        }}
        label="Activity"
        value="/activity"
        onClick={() => handleChange(null, "/activity")}
        icon={
          <Box display="flex" flexDirection="column" alignItems="center">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,7H4A2,2 0 0,0 2,9V15A2,2 0 0,0 4,17H20A2,2 0 0,0 22,15V9A2,2 0 0,0 20,7M9.5,11A1.5,1.5 0 0,1 8,12.5A1.5,1.5 0 0,1 6.5,11A1.5,1.5 0 0,1 8,9.5A1.5,1.5 0 0,1 9.5,11M16.5,11A1.5,1.5 0 0,1 15,12.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 15,9.5A1.5,1.5 0 0,1 16.5,11M20,7H4A2,2 0 0,0 2,9V15A2,2 0 0,0 4,17H20A2,2 0 0,0 22,15V9A2,2 0 0,0 20,7Z" />
            </svg>
            <Typography
              style={{
                ...styles.label,
                color: value === "/activity" ? "#FF6B6B" : "#AEAEAE",
              }}
            >
              Activity
            </Typography>
          </Box>
        }
      />

      <Box
        style={styles.centerButton}
        onClick={() => handleChange(null, "/games")}
      >
        <Box style={styles.centerButtonInner}>
          <svg style={styles.centerIcon} viewBox="0 0 24 24" fill="white">
            <path d="M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z" />
          </svg>
        </Box>
      </Box>

      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/wallet" ? "#FF6B6B" : "#AEAEAE",
        }}
        label="Wallet"
        value="/wallet"
        onClick={() => handleChange(null, "/wallet")}
        icon={
          <Box display="flex" flexDirection="column" alignItems="center">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z" />
            </svg>
            <Typography
              style={{
                ...styles.label,
                color: value === "/wallet" ? "#FF6B6B" : "#AEAEAE",
              }}
            >
              Wallet
            </Typography>
          </Box>
        }
      />

      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/account" ? "#FF6B6B" : "#AEAEAE",
        }}
        label="Account"
        value="/account"
        onClick={() => handleChange(null, "/account")}
        icon={
          <Box display="flex" flexDirection="column" alignItems="center">
            <svg style={styles.icon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <Typography
              style={{
                ...styles.label,
                color: value === "/account" ? "#FF6B6B" : "#AEAEAE",
              }}
            >
              Account
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};

export default BottomNavigationArea;
