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
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/material";
import { border, borderRadius, height, width } from "@mui/system";
import promotionLogo from "../../public/promotionLogo/promotion.png"
// import { backgroundOrigin } from "html2canvas/dist/types/css/property-descriptors/background-origin";

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
      padding: isSmallScreen ? "4px 0" : "6px 0",
      backgroundImage: "url(/assets/images/tabBarBg-01df93c.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "transparent",
      width: "100%",
      maxWidth: isSmallScreen ? "100%" : "396px",
      height: isSmallScreen ? "60px" : "70px",
      paddingTop: isSmallScreen ? "0.5%" : "1%",
      zIndex: 1000
    },
    navItem: {
      minWidth: isSmallScreen ? "50px" : "80px",
      padding: isSmallScreen ? "4px 0" : "6px 12px",
       fontWeight: 400,
          fontFamily: "Arial",
          fontSize:"12px",
    },
    icon: {
      width: isSmallScreen ? "20px" : "25px",
      height: isSmallScreen ? "20px" : "25px",
    },
    promotionIcon: {
      width: isSmallScreen ? "50px" : "50px",
      height: isSmallScreen ? "50px" : "50px",
    },
    promotionContainer: {
      marginTop: isSmallScreen ? "-30px" : "-40px",
      borderRadius:"50px",
      width:"50px",
      height:"50px",
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={styles.bottomNav}
    >
      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/home" ? "rgb(245,68,68)" : "#80849c"
        }}
        label="Home"
        value="/home"
        icon={
          <img
            src={value === "/home"
              ? "https://www.66lottery9.com/static/home/icon_home_on.png?v=1.0.2"
              : "https://www.66lottery9.com/static/home/icon_home.png?v=1.0.2"
            }
            style={styles.icon}
            alt="home"
          />
        }
      />
      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/activity" ? "rgb(245,68,68)" : "#80849c"
        }}
        label="Activity"
        value="/activity"
        icon={
          <img
            src={value === "/activity"
              ? "https://www.66lottery9.com/static/home/icon_activity_on.png?v=1.0.1"
              : "https://www.66lottery9.com/static/home/icon_activity.png?v=1.0.1"
            }
            style={styles.icon}
            alt="activity"
          />
        }
      />
      <BottomNavigationAction
        value="/promotion"
        icon={
          <Box style={styles.promotionContainer}>
            <img
              src="/assets/banners/icon_promotion.png"
              style={styles.promotionIcon}
              alt="promotion"
            />
            <span style={{fontSize:"normal"}}>Agent</span>
          </Box>
        }
        style={{
          ...styles.navItem,
          color: "rgb(253,106,25)"
        }}
      />
      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/wallet" ? "rgb(245,68,68)" : "#80849c"
        }}
        label="Wallet"
        value="/wallet"
        icon={
          <img
            src={value === "/wallet"
              ? "https://www.66lottery9.com/static/home/icon_wallet_on.png?v=1.0.1"
              : "https://www.66lottery9.com/static/home/icon_wallet.png?v=1.0.1"
            }
            style={styles.icon}
            alt="wallet"
          />
        }
      />
      <BottomNavigationAction
        style={{
          ...styles.navItem,
          color: value === "/account" ? "rgb(245,68,68)" : "#80849c"
        }}
        label="Account"
        value="/account"
        icon={
          <img
            src={value === "/account"
              ? "https://www.66lottery9.com/static/home/icon_account_on.png?v=1.0.1"
              : "https://www.66lottery9.com/static/home/icon_account.png?v=1.0.1"
            }
            style={styles.icon}
            alt="account"
          />
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationArea;
