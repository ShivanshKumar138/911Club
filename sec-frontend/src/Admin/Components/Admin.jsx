import React, { useState, useEffect, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Inbox as InboxIcon,
  Casino as CasinoIcon,
  SportsBaseball as SportsBaseballIcon,
  ReportProblem as ReportProblemIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  ManageAccounts as ManageAccountsIcon,
  Settings as SettingsIcon,
  CardGiftcard as GiftIcon,
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  ManageHistory as ManageHistoryIcon,
  Help as HelpIcon,
  Update as UpdateIcon,
  BorderColor as BorderColorIcon,
} from "@mui/icons-material";
import { domain } from "../../Components/config";

const drawerWidth = 240;

// Define getDrawerItems as a regular function
const getDrawerItems = (accountType) => {
  const allItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Wingo Admin", icon: <InboxIcon />, link: "/wingo-admin" },
    { text: "K3 Admin", icon: <CasinoIcon />, link: "/k3-admin" },
    { text: "5D Admin", icon: <SportsBaseballIcon />, link: "/5d-admin" },
    {
      text: "Illegal Bets",
      icon: <ReportProblemIcon />,
      link: "/illegal-bets",
    },
    { text: "Profit/Loss", icon: <MonetizationOnIcon />, link: "/profit-loss" },
    { text: "Members", icon: <PeopleIcon />, link: "/members" },
    {
      text: "Browse Recharge",
      icon: <PaymentIcon />,
      link: "/pending-recharge-admin",
    },
    {
      text: "Browse Withdraw",
      icon: <PaymentIcon />,
      link: "/withdraw-admin-status",
    },
    { text: "VIP Level", icon: <ManageAccountsIcon />, link: "/vip-levels" },
    { text: "Update", icon: <SettingsIcon />, link: "/settings-admin" },
    {
      text: "First Deposit Bonus",
      icon: <GiftIcon />,
      link: "/bonus-settings",
    },
    {
      text: "Create Salary",
      icon: <MonetizationOnIcon />,
      link: "/create-salary",
    },
    { text: "Create Giftcode", icon: <GiftIcon />, link: "/create-coupon" },
    {
      text: "Notifications",
      icon: <NotificationsIcon />,
      link: "/notifications-admin",
    },
    {
      text: "Recharge (Approved)",
      icon: <PaymentIcon />,
      link: "/recharge-admin",
    },
    {
      text: "Withdraw (Approved)",
      icon: <PaymentIcon />,
      link: "/withdraw-admin",
    },
    {
      text: "Withdrawl Settings",
      icon: <SettingsIcon />,
      link: "/withdrawl-limits",
    },
    { text: "Wallet Update", icon: <WalletIcon />, link: "/wallet-update" },
    {
      text: "Update Turn Over",
      icon: <ManageHistoryIcon />,
      link: "/update-turn-over",
    },
    { text: "Create User", icon: <HelpIcon />, link: "/create-user-account" },
    {
      text: "Activity Setting",
      icon: <UpdateIcon />,
      link: "/admin/activity-award",
    },
    { text: "Lucky Spin", icon: <UpdateIcon />, link: "/lucky-spin" },
    {
      text: "Inviation Bonus",
      icon: <UpdateIcon />,
      link: "/admin/invitation-bonus",
    },
    { text: "Support", icon: <HelpIcon />, link: "/support-admin" },
    {
      text: "Edit Bank Details",
      icon: <BorderColorIcon />,
      link: "/edit-user-bank-details",
    },
    {
      text: "Go to website",
      icon: <UpdateIcon />,
      link: "/",
    },
  ];

  const itemSets = {
    Admin: allItems,
    FinanceHead: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
      {
        text: "Browse Recharge",
        icon: <PaymentIcon />,
        link: "/pending-recharge-admin",
      },
      {
        text: "Browse Withdraw",
        icon: <PaymentIcon />,
        link: "/withdraw-admin-status",
      },
      {
        text: "Recharge (Approved)",
        icon: <PaymentIcon />,
        link: "/recharge-admin",
      },
      {
        text: "Withdraw (Approved)",
        icon: <PaymentIcon />,
        link: "/withdraw-admin",
      },
      {
        text: "Illegal Bets",
        icon: <ReportProblemIcon />,
        link: "/illegal-bets",
      },
    ],
    GameHead: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
      { text: "Wingo Admin", icon: <InboxIcon />, link: "/wingo-admin" },
      { text: "K3 Admin", icon: <CasinoIcon />, link: "/k3-admin" },
      { text: "5D Admin", icon: <SportsBaseballIcon />, link: "/5d-admin" },
      {
        text: "Profit/Loss",
        icon: <MonetizationOnIcon />,
        link: "/profit-loss",
      },
    ],
    SettingsHead: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
      { text: "VIP Level", icon: <ManageAccountsIcon />, link: "/vip-levels" },
      { text: "Update", icon: <SettingsIcon />, link: "/settings-admin" },
      {
        text: "Withdrawal Settings",
        icon: <SettingsIcon />,
        link: "/withdrawl-limits",
      },
      {
        text: "Activity Setting",
        icon: <UpdateIcon />,
        link: "/admin/activity-award",
      },
      { text: "Lucky Spin", icon: <UpdateIcon />, link: "/lucky-spin" },

      {
        text: "Invitation Bonus",
        icon: <UpdateIcon />,
        link: "/admin/invitation-bonus",
      },
    ],
    AdditionalHead: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
      {
        text: "Notifications",
        icon: <NotificationsIcon />,
        link: "/notifications-admin",
      },
      {
        text: "First Deposit Bonus",
        icon: <GiftIcon />,
        link: "/bonus-settings",
      },
      {
        text: "Create Salary",
        icon: <MonetizationOnIcon />,
        link: "/create-salary",
      },
      { text: "Create Gift Code", icon: <GiftIcon />, link: "/create-coupon" },
    ],
    SupportHead: [
      { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
      { text: "Members", icon: <PeopleIcon />, link: "/members" },
      { text: "Support", icon: <HelpIcon />, link: "/support-admin" },
      {
        text: "Edit Bank Details",
        icon: <BorderColorIcon />,
        link: "/edit-user-bank-details",
      },
    ],
  };

  return itemSets[accountType] || [];
};

// Memoized drawer item component
const DrawerItem = React.memo(({ item, isActive }) => (
  <ListItem
    button
    component={Link}
    to={item.link}
    style={{
      background: isActive ? "#4782ff" : "transparent",
      color: isActive ? "white" : "black",
    }}
  >
    <ListItemIcon>
      {React.cloneElement(item.icon, {
        sx: { color: isActive ? "#FFFFFF" : "#4782ff" },
      })}
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography variant="body1" sx={{ fontWeight: "500" }}>
          {item.text}
        </Typography>
      }
    />
  </ListItem>
));

// Memoized drawer content component
const DrawerContent = React.memo(({ items, currentPath }) => (
  <List>
    {items.map((item) => (
      <DrawerItem
        key={item.text}
        item={item}
        isActive={currentPath === item.link}
      />
    ))}
  </List>
));

// Memoized profile menu component
const ProfileMenu = React.memo(({ anchorEl, handleClose, handleLogout }) => (
  <Menu
    id="profile-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem onClick={handleClose}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </MenuItem>
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </MenuItem>
  </Menu>
));

const AdminPanel = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [accountType, setAccountType] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
        });
        setAccountType(response.data.user.accountType);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${domain}/api/site-settings`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setLogoUrl(response.data.logoUrl);
      } catch (error) {
        console.error("Error fetching the logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Memoize the drawer items
  const drawerItems = useMemo(() => getDrawerItems(accountType), [accountType]);

  const drawer = useMemo(
    () => (
      <div>
        <Toolbar />
        <Divider />
        <DrawerContent items={drawerItems} currentPath={location.pathname} />
      </div>
    ),
    [drawerItems, location.pathname]
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
          color: "black",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              sx={{
                height: 50,
                marginRight: 1,
              }}
              alt="Logo"
              src={logoUrl || "../../../assets/genzwinlogo.png"}
            />
          </Typography>
          <IconButton
            color="inherit"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "white" }}
          >
            <AccountCircleIcon />
          </IconButton>
          <ProfileMenu
            anchorEl={anchorEl}
            handleClose={handleProfileMenuClose}
            handleLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          overflowY: "hidden",
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#FFFFFF",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0px",
                background: "transparent",
              },
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            md: `calc(100% - ${drawerWidth}px)`,
            sm: `100%`,
            xs: `100%`,
          },
          mt: 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default React.memo(AdminPanel);
