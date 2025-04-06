// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   Typography,
//   Box,
//   Collapse,
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   KeyRounded as AuthIcon,
//   SportsEsports as GameIcon,
//   People as MemberIcon,
//   AccountBalance as RechargeIcon,
//   Payment as WithdrawIcon,
//   Stars as VIPIcon,
//   Casino as Game1Icon,
//   Sports as Game2Icon,
//   Games as Game3Icon,
//   Settings as SettingsIcon,
//   CardGiftcard as GiftCodeIcon,
//   MonetizationOn as BonusIcon,
//   Payments as SalaryIcon,
//   Notifications as NotificationsIcon,
//   AccountBalanceWallet as WalletIcon,
//   Loop as TurnoverIcon,
//   PersonAdd as CreateUserIcon,
//   EventNote as ActivityIcon,
//   Share as InvitationIcon,
//   AccountBox as BankDetailsIcon,
//   ExpandMore,
//   ExpandLess,
//   Casino as WingoIcon,
//   SportsEsports as K3Icon,
//   Games as FiveDIcon,
// } from '@mui/icons-material';
// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { cn } from "@/lib/utils";

// const menuItems = [
//   {
//     type: 'single',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//     path: '/dashboard',
//     selected: true,
//     user:["Admin"]
//   },
//   {
//     type: 'section',
//     title: 'User Management',
//     user:["Admin"]
//   },
//   {
//     type: 'single',
//     title: 'Create User',
//     icon: <CreateUserIcon />,
//     path: '/create-user',
//   },
//   {
//     type: 'single',
//     title: 'Members',
//     icon: <MemberIcon />,
//     path: '/members',
//   },
//   {
//     type: 'section',
//     title: 'Games & Activities',
//     user:["Admin","GameHead"]
//   },
//   {
//     type: 'collapse',
//     title: 'Games',
//     icon: <GameIcon />,
//     children: [
//       {
//         title: 'Wingo',
//         path: '/games/wingo',
//         icon: <WingoIcon />,
//       },
//       {
//         title: 'K3',
//         path: '/games/k3',
//         icon: <K3Icon />,
//       },
//       {
//         title: '5D',
//         path: '/games/5d',
//         icon: <FiveDIcon />,
//       },
//     ],
//   },
//   {
//     type: 'section',
//     title: 'Illegal Bets',
//     user:["Admin","GameHead"]
//   },
//   {
//     type: 'single',
//     title: 'Illegal Bets',
//     icon: <Game2Icon />,
//     path: '/illegalbets',
//   },
//   {
//     type: 'section',
//     title: 'Financial Management',
//     user:["Admin","FinanceHead"]
//   },
//   {
//     type: 'single',
//     title: 'Browse Recharge',
//     icon: <RechargeIcon />,
//     path: '/recharge',
//   },
//   {
//     type: 'single',
//     title: 'Browse Withdraw',
//     icon: <WithdrawIcon />,
//     path: '/withdraw',
//   },
//   {
//     type: 'single',
//     title: 'Wallet Update',
//     icon: <WalletIcon />,
//     path: '/wallet-update',
//   },
//   {
//     type: 'single',
//     title: 'Update Turnover',
//     icon: <TurnoverIcon />,
//     path: '/update-turnover',
//   },
//   {
//     type: 'single',
//     title: 'Edit Bank Details',
//     icon: <BankDetailsIcon />,
//     path: '/bank-details',
//   },
//   {
//     type: 'section',
//     title: 'Bonus & Rewards',
//   },
//   {
//     type: 'single',
//     title: 'First Deposit Bonus',
//     icon: <BonusIcon />,
//     path: '/first-deposit-bonus',
//   },

//   {
//     type: 'single',
//     title: 'Second Deposit Bonus',
//     icon: <BonusIcon />,
//     path: '/second-deposit-bonus',
//   },
//   {
//     type: 'single',
//     title: 'Create Salary',
//     icon: <SalaryIcon />,
//     path: '/create-salary',
//   },
//   {
//     type: 'single',
//     title: 'Create Gift Code',
//     icon: <GiftCodeIcon />,
//     path: '/create-gift-code',
//   },
//   {
//     type: 'single',
//     title: 'Invitation Bonus',
//     icon: <InvitationIcon />,
//     path: '/invitation-bonus',
//   },
//   {
//     type: 'single',
//     title: 'VIP Level',
//     icon: <VIPIcon />,
//     path: '/vip-level',
//   },
//   {
//     type: 'section',
//     title: 'System',
//     user:["Admin","SettingsHead"]
//   },
//   {
//     type: 'single',
//     title: 'Settings',
//     icon: <SettingsIcon />,
//     path: '/settings',
//   },
//   {
//     type: 'single',
//     title: 'Notifications',
//     icon: <NotificationsIcon />,
//     path: '/notifications',
//   },
// ];

// const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
//   const [openCollapse, setOpenCollapse] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();
//   console.log(location.pathname);
//   console.log(openCollapse);
//   const handleCollapse = (title) => {
//     setOpenCollapse((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const userInfo=localStorage.getItem('userInfo');
//   const userInfoObject=JSON.parse(userInfo);
//   const {accountType}=userInfoObject
//   console.log(accountType);
//   // Check if a menu item or its children are active
//   const isMenuActive = (item) => {
//     if (item.path) {
//       return location.pathname === item.path;
//     }
//     if (item.children) {
//       return item.children.some(child => location.pathname === child.path);
//     }
//     return false;
//   };

//   const renderMenuItem = (item) => {
//     switch (item.type) {
//       case 'section':
//         return (
//           <Box sx={{ mt: 0.5, mb: 0.25, px: 1.5 }} key={item.title}>
//             <Typography
//               variant="subtitle2"
//               sx={{
//                 color: 'text.secondary',
//                 fontWeight: 500,
//                 fontSize: '0.7rem',
//                 textTransform: 'uppercase',
//               }}
//             >
//               {item.title}
//             </Typography>
//           </Box>
//         );

//       case 'single':
//         const isActive = isMenuActive(item);
//         return (
//           <ListItem key={item.title} disablePadding>
//             <ListItemButton
//               selected={isActive}
//               onClick={() => navigate(item.path)}
//               sx={{
//                 minHeight: 36,
//                 px: 2,
//                 borderRadius: 1,
//                 margin: '1px 6px',
//                 '&.Mui-selected': {
//                   bgcolor: 'primary.lighter',
//                   color: 'primary.main',
//                   '&:hover': {
//                     bgcolor: 'primary.lighter',
//                   },
//                   '& .MuiListItemIcon-root': {
//                     color: 'primary.main',
//                   },
//                 },
//                 '&:hover': {
//                   bgcolor: 'rgba(115, 82, 199, 0.08)',
//                 },
//               }}
//             >
//               <ListItemIcon
//                 sx={{
//                   minWidth: 32,
//                   color: isActive ? 'primary.main' : 'inherit',
//                   transition: 'color 0.2s',
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText
//                 primary={item.title}
//                 sx={{
//                   '& .MuiTypography-root': {
//                     fontWeight: isActive ? 600 : 400,
//                     color: isActive ? 'primary.main' : 'inherit',
//                   },
//                 }}
//               />
//             </ListItemButton>
//           </ListItem>
//         );

//       case 'collapse':
//         const isCollapseActive = isMenuActive(item);
//         return (
//           <Box key={item.title}>
//             <ListItem disablePadding>
//               <ListItemButton
//                 onClick={() => handleCollapse(item.title)}
//                 sx={{
//                   minHeight: 36,
//                   px: 2,
//                   borderRadius: 1,
//                   margin: '1px 6px',
//                   ...(isCollapseActive && {
//                     bgcolor: 'primary.lighter',
//                     color: 'primary.main',
//                     '& .MuiListItemIcon-root': {
//                       color: 'primary.main',
//                     },
//                   }),
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 32,
//                     color: isCollapseActive ? 'primary.main' : 'inherit',
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={item.title}
//                   sx={{
//                     '& .MuiTypography-root': {
//                       fontWeight: isCollapseActive ? 600 : 400,
//                     },
//                   }}
//                 />
//                 {openCollapse[item.title] ? <ExpandLess /> : <ExpandMore />}
//               </ListItemButton>
//             </ListItem>
//             <Collapse in={openCollapse[item.title]} timeout="auto">
//               <List component="div" disablePadding>
//                 {item.children.map((child) => {
//                   const isChildActive = location.pathname === child.path;
//                   return (
//                     <ListItemButton
//                       key={child.title}
//                       selected={isChildActive}
//                       onClick={() => navigate(child.path)}
//                       sx={{
//                         minHeight: 36,
//                         pl: 5,
//                         borderRadius: 1,
//                         margin: '1px 6px',
//                         '&.Mui-selected': {
//                           bgcolor: 'primary.lighter',
//                           color: 'primary.main',
//                           '&:hover': {
//                             bgcolor: 'primary.lighter',
//                           },
//                           '& .MuiListItemIcon-root': {
//                             color: 'primary.main',
//                           },
//                         },
//                       }}
//                     >
//                       {child.icon && (
//                         <ListItemIcon
//                           sx={{
//                             minWidth: 32,
//                             color: isChildActive ? 'primary.main' : 'inherit',
//                           }}
//                         >
//                           {child.icon}
//                         </ListItemIcon>
//                       )}
//                       <ListItemText
//                         primary={child.title}
//                         sx={{
//                           '& .MuiTypography-root': {
//                             fontWeight: isChildActive ? 600 : 400,
//                             color: isChildActive ? 'primary.main' : 'inherit',
//                           },
//                         }}
//                       />
//                     </ListItemButton>
//                   );
//                 })}
//               </List>
//             </Collapse>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   const drawer = (
//     <Box
//       sx={{
//         px: 0.5,
//         py: 0.25,
//         mt: '40px',
//         height: '100%',
//         overflow: 'auto',
//         '&::-webkit-scrollbar': {
//           display: 'none',
//         },
//         scrollbarWidth: 'none',
//         msOverflowStyle: 'none',
//       }}
//     >
//       <List>
//         {menuItems.map((item) => renderMenuItem(item))}
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       {/* Mobile drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true,
//         }}
//         sx={{
//           display: { xs: 'block', sm: 'none' },
//           '& .MuiDrawer-paper': {
//             boxSizing: 'border-box',
//             width: drawerWidth,
//             bgcolor: 'background.paper',
//             mt: '40px',
//             '&::-webkit-scrollbar': {
//               display: 'none',
//             },
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none',
//           },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Desktop drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: 'none', sm: 'block' },
//           '& .MuiDrawer-paper': {
//             boxSizing: 'border-box',
//             width: drawerWidth,
//             bgcolor: 'background.paper',
//             borderRight: '1px dashed rgba(0, 0, 0, 0.12)',
//             mt: '40px',
//             height: `calc(100% - 40px)`,
//             '&::-webkit-scrollbar': {
//               display: 'none',
//             },
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none',
//           },
//         }}
//         open
//       >
//         {drawer}
//       </Drawer>
//     </>
//   );
// };

// export default Sidebar;

/*eslint-disable*/

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  KeyRounded as AuthIcon,
  SportsEsports as GameIcon,
  People as MemberIcon,
  AccountBalance as RechargeIcon,
  Payment as WithdrawIcon,
  Stars as VIPIcon,
  Casino as Game1Icon,
  Sports as Game2Icon,
  Games as Game3Icon,
  Settings as SettingsIcon,
  CardGiftcard as GiftCodeIcon,
  MonetizationOn as BonusIcon,
  Payments as SalaryIcon,
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  Loop as TurnoverIcon,
  PersonAdd as CreateUserIcon,
  EventNote as ActivityIcon,
  Share as InvitationIcon,
  AccountBox as BankDetailsIcon,
  ExpandMore,
  ExpandLess,
  Casino as WingoIcon,
  SportsEsports as K3Icon,
  Games as FiveDIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Support as SupportIcon,
  HeadsetMic as SupportServiceIcon,
} from "@mui/icons-material";
import { Banknote } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { DollarSign } from "lucide-react";
import { DollarSignIcon } from "lucide-react";
import { Settings } from "lucide-react";
import { NetworkIcon } from "lucide-react";
import { TargetIcon } from "lucide-react";
import { ChartNoAxesColumn } from "lucide-react";
const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const [openCollapse, setOpenCollapse] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage
  const userInfo = localStorage.getItem("userInfo");
  const userInfoObject = JSON.parse(userInfo);
  const { accountType } = userInfoObject;

  // Filter menu items based on user type
  const filterMenuItems = (items) => {
    return items.filter((item) => {
      // If no user array is specified, show to all users
      if (!item.user) return true;

      // If user array exists, check if current user type is included
      return item.user.includes(accountType);
    });
  };

  const menuItems = [
    {
      type: "single",
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      selected: true,
      user: ["Admin"],
    },
    {
      type: "section",
      title: "User Management",
      user: ["Admin"],
    },
    {
      type: "single",
      title: "Create User",
      icon: <CreateUserIcon />,
      path: "/create-user",
      user: ["Admin"],
    },
    {
      type: "single",
      title: "Members",
      icon: <MemberIcon />,
      path: "/members",
      user: ["Admin"],
    },
    {
      type: "section",
      title: "Games & Activities",
      user: ["Admin", "GameHead"],
    },
    {
      type: "collapse",
      title: "Games",
      icon: <GameIcon />,
      user: ["Admin", "GameHead"],
      children: [
        {
          title: "Wingo",
          path: "/games/wingo",
          icon: <WingoIcon />,
        },
        {
          title: "K3",
          path: "/games/k3",
          icon: <K3Icon />,
        },
        {
          title: "5D",
          path: "/games/5d",
          icon: <FiveDIcon />,
        },
      ],
    },
    {
      type: "section",
      title: "Illegal Bets",
      user: ["Admin", "GameHead"],
    },
    {
      type: "single",
      title: "Illegal Bets",
      icon: <Game2Icon />,
      path: "/illegalbets",
      user: ["Admin", "GameHead"],
    },
    {
      type: "section",
      title: "Financial Management",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Browse Recharge",
      icon: <RechargeIcon />,
      path: "/recharge",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Browse Withdraw",
      icon: <WithdrawIcon />,
      path: "/withdraw",
      user: ["Admin", "FinanceHead"],
    },
    // ... other menu items with their respective user arrays
    {
      type: "single",
      title: "Wallet Update",
      icon: <WalletIcon />,
      path: "/wallet-update",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Update Turnover",
      icon: <TurnoverIcon />,
      path: "/update-turnover",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Edit Bank Details",
      icon: <BankDetailsIcon />,
      path: "/bank-details",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Create Salary",
      icon: <SalaryIcon />,
      path: "/create-salary",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Withdrawl Limit",
      icon: <Banknote />, // Icon for Withdrawl Limit
      path: "/withdrawl-limits",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Recharge Approved",
      icon: <CheckCircle />, // Icon for Recharge Approved
      path: "/recharge-admin",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "single",
      title: "Withdrawl Approved",
      icon: <DollarSignIcon />,
      path: "/withdraw-admin",
      user: ["Admin", "FinanceHead"],
    },
    {
      type: "section",
      title: "Bonus & Rewards",
      user: ["Admin", "AdditionalHead"],
    },
    {
      type: "single",
      title: "First Deposit Bonus",
      icon: <BonusIcon />,
      path: "/first-deposit-bonus",
      user: ["Admin", "AdditionalHead"],
    },

    {
      type: "single",
      title: "Second Deposit Bonus",
      icon: <BonusIcon />,
      path: "/second-deposit-bonus",
      user: ["Admin", "AdditionalHead"],
    },

    {
      type: "single",
      title: "Create Gift Code",
      icon: <GiftCodeIcon />,
      path: "/create-gift-code",
      user: ["Admin", "AdditionalHead"],
    },
    {
      type: "single",
      title: "Invitation Bonus",
      icon: <InvitationIcon />,
      path: "/invitation-bonus",
      user: ["Admin", "AdditionalHead"],
    },
    {
      type: "single",
      title: "VIP Level",
      icon: <VIPIcon />,
      path: "/vip-level",
      user: ["Admin", "AdditionalHead"],
    },
    {
      type: "single",
      title: "Activity Settings",
      icon: <Settings />,
      path: "/admin/activity-award",
      user: ["Admin", "AdditionalHead"],
    },
    {
      type: "section",
      title: "System",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "single",
      title: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "single",
      title: "IP Address Tracker",
      icon: <NetworkIcon />,
      path: "/ip-loggs",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "single",
      title: "Bet Tracker",
      icon: <TargetIcon />,
      path: "/bet-history",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "single",
      title: "win probablity",
      icon: <ChartNoAxesColumn />,
      path: "/win-probablity",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "single",
      title: "Notifications",
      icon: <NotificationsIcon />,
      path: "/notifications",
      user: ["Admin", "SettingsHead"],
    },
    {
      type: "section",
      title: "Support",
      user: ["Admin", "SupportHead"], // Added SupportHead role
    },
    {
      type: "single",
      title: "Support Service",
      icon: <SupportServiceIcon />,
      path: "/support-service",
      user: ["Admin", "SupportHead"], // Added SupportHead role
    },
  ];

  const handleCollapse = (title) => {
    setOpenCollapse((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isMenuActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  const renderMenuItem = (item) => {
    switch (item.type) {
      case "section":
        return (
          <Box sx={{ mt: 0.5, mb: 0.25, px: 1.5 }} key={item.title}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              {item.title}
            </Typography>
          </Box>
        );

      case "single":
        const isActive = isMenuActive(item);
        return (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 36,
                px: 2,
                borderRadius: 1,
                margin: "1px 6px",
                "&.Mui-selected": {
                  bgcolor: "primary.lighter",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.lighter",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: isActive ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "primary.main" : "inherit",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        );

      case "collapse":
        const isCollapseActive = isMenuActive(item);
        return (
          <Box key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleCollapse(item.title)}
                sx={{
                  minHeight: 36,
                  px: 2,
                  borderRadius: 1,
                  margin: "1px 6px",
                  ...(isCollapseActive && {
                    bgcolor: "primary.lighter",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {openCollapse[item.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openCollapse[item.title]} timeout="auto">
              <List component="div" disablePadding>
                {item.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <ListItemButton
                      key={child.title}
                      selected={isChildActive}
                      onClick={() => navigate(child.path)}
                      sx={{
                        minHeight: 36,
                        pl: 5,
                        borderRadius: 1,
                        margin: "1px 6px",
                        "&.Mui-selected": {
                          bgcolor: "primary.lighter",
                          color: "primary.main",
                        },
                      }}
                    >
                      {child.icon && (
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {child.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        );

      default:
        return null;
    }
  };

  // Filter menu items before rendering
  const filteredMenuItems = filterMenuItems(menuItems);

  // const drawer = (
  //   <Box sx={{ px: 0.5, py: 0.25, mt: '40px',overflow: 'hidden' }}>
  //     <List sx={{ overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
  //       {filteredMenuItems.map((item) => renderMenuItem(item))}
  //     </List>
  //   </Box>
  // );
  const drawer = (
    <Box
      sx={{
        px: 0.5,
        py: 0.25,
        mt: "40px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Container should be hidden overflow
      }}
    >
      <List
        sx={{
          overflowY: "auto", // List should scroll
          flex: 1,
          scrollbarWidth: "none", // Hide scrollbar in Firefox
          msOverflowStyle: "none", // Hide scrollbar in IE/Edge
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar in Chrome/Safari
          },
        }}
      >
        {filteredMenuItems.map((item) => renderMenuItem(item))}
      </List>
    </Box>
  );

  //   This approach creates a proper scrolling container that:

  // Takes up the full available height (height: '100%' and flex: 1)
  // Has scrolling enabled (overflowY: 'auto')
  // Hides the scrollbar visually (using various browser-specific settings)

  // Now your sidebar menu will properly scroll when there are too many items to fit, but the scrollbar will remain hidden for a cleaner look.
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "background.paper",
            mt: "40px",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "background.paper",
            borderRight: "1px dashed rgba(0, 0, 0, 0.12)",
            mt: "40px",
            height: `calc(100% - 40px)`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;

/*
Key changes made to implement role-based menu filtering:

Added a filterMenuItems function that checks if the current user's accountType matches the roles specified in each menu item's user array
If no user array is specified for a menu item, it's shown to all users
Applied the filter before rendering the menu items
Each menu item now has a user array specifying which account types can see it

The menu items will now be filtered based on the user's account type:

Admin users see all menu items
GameHead users see game-related items
FinanceHead users see financial management items
SettingsHead users see system-related items

Would you like me to modify any of the role permissions or add additional menu items for specific user types?
*/
