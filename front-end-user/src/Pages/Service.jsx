import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Button, 
  AppBar, 
  Toolbar,
  Container,
  Divider,
  useTheme,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ErrorIcon from '@mui/icons-material/Error';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HelpIcon from '@mui/icons-material/Help';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckIcon from '@mui/icons-material/Check';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';
import { domain } from "../Components/config";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AutorenewIcon from '@mui/icons-material/Autorenew';

function SelfServiceCenter() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [telegramLink, setTelegramLink] = useState('https://telegram.me/OFFICIAL747LOTTERY');
  const [telegramLink2, setTelegramLink2] = useState('https://telegram.me/OFFICIALWINPLAY747');
  const [openDialog, setOpenDialog] = useState(false);

  const femaleTelegramLink = 'https://telegram.me/teacherzingsi747'; // Manually added female Telegram link

  useEffect(() => {
    // Fetch Telegram link when component mounts
    const fetchTelegramLink = async () => {
      try {
        const response = await fetch(`${domain}/getTelegramLink`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Assuming token is stored in sessionStorage
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

  const menuItems = [
    { icon: <MonetizationOnIcon />, text: "Deposit Not Receive", color: "rgba(250, 91, 91, 1)" },
    { icon: <AccountBalanceIcon />, text: "IFSC Modification", color: "rgba(250, 91, 91, 1)" },
    { icon: <CreditCardIcon />, text: "Delete Withdraw Bank Account and Rebind", color: "rgba(250, 91, 91, 1)" },
    { icon: <CreditCardIcon />, text: "Withdrawal Problem", color: "rgba(250, 91, 91, 1)" },
    { icon: <PersonIcon />, text: "Change Bank Name", color: "rgba(250, 91, 91, 1)" },
    { icon: <VerifiedUserIcon />, text: "USDT Verification (Indian Members)", color: "rgba(250, 91, 91, 1)" },
    { icon: <VerifiedUserIcon />, text: "USDT Verification (Non-Indian Members)", color: "rgba(250, 91, 91, 1)" },
    { icon: <AutorenewIcon />, text: "Delete Old USDT Address and Rebind", color: "rgba(250, 91, 91, 1)" },
    { icon: <HelpIcon />, text: "Game Problems", color: "rgba(250, 91, 91, 1)" },
    { icon: <SportsEsportsIcon />, text: "Wingo 1 Min Win Streak Bonus", color: "rgba(250, 91, 91, 1)" },
    { icon: <HelpIcon />, text: "Game Problems", color: "rgba(250, 91, 91, 1)" },
    { icon: <SupportAgentIcon />, text: "Live Chat Support", color: "rgba(250, 91, 91, 1)" },
    { icon: <SendIcon />, text: "Telegram Support", color: "rgba(250, 91, 91, 1)" },
  ];

  const handleItemClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLinkClick = (link) => {
    window.open(link, '_blank');
    setOpenDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header/AppBar */}
      <AppBar position="static" sx={{ background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",}}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start">
            <ArrowBackIcon sx={{ color: "white" }} onClick={() => navigate(-1)} />
          </IconButton>
          <Typography variant="h6">Self Service Center</Typography>
          <Button color="inherit" size="small" variant="outlined" sx={{ borderRadius: 4 }}>
            English
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Welcome Banner */}
      <Box 
        sx={{ 
          bgcolor: '#2c3e50', 
          color: 'white', 
          p: 2, 
          background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
          position: 'relative',
          height: '100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Welcome to the Self Service
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          Customer Service Center
        </Typography>
      </Box>

      {/* Menu List */}
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem button sx={{ py: 1.5 }} onClick={handleItemClick}>
                  <ListItemIcon>
                    <Box 
                      sx={{ 
                        bgcolor: item.color, 
                        color: 'white', 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  <ArrowForwardIosIcon fontSize="small" sx={{ color: '#aaa', fontSize: 14 }} />
                </ListItem>
                {index < menuItems.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
        
        {/* Footer Notes */}
        <Box sx={{ mt: 2, px: 2, color: '#666', fontSize: '0.85rem' }}>
          <Typography variant="body2" gutterBottom>
            <strong>KINDLY NOTE</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
            • Please ensure that you input valid information when submitting the request. After submission, the system will automatically verify the information.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
            • Providing false information may result in your account being restricted.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 2 }}>
            • After submitting for a refund, you can use Shopstream to progress to application and receive real-time updates of the ticket status/responses.
          </Typography>
        </Box>
      </Container>

      {/* Dialog for selecting Telegram link */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Select Telegram Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the Telegram link you want to open:
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Button onClick={() => handleLinkClick(telegramLink)} color="primary" startIcon={<Avatar src="/assets/banners/male.jpg" />}>
              Teacher 1
            </Button>
            <Button onClick={() => handleLinkClick(femaleTelegramLink)} color="primary" startIcon={<Avatar src="/assets/banners/female.jpg" />}>
            Teacher 2
            </Button>
            <Button onClick={() => handleLinkClick(telegramLink2)} color="primary" startIcon={<Avatar src="/assets/banners/female.jpg" />}>
            Teacher 3
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SelfServiceCenter;