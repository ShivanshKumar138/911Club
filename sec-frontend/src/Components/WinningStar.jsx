import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
} from '@mui/material';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Mobile from './Mobile';
import { useNavigate } from 'react-router-dom'; 
const WinningItem = ({ avatar, nickname, gameName, wins, bonus, time }) => (
  <Card sx={{ mb: 2, borderRadius: 2, margin: 1.5 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={avatar} sx={{ width: 40, height: 40, mr: 2 }} />
        <Typography variant="subtitle1" fontWeight="bold">{nickname}</Typography>
      </Box>
      <Grid container>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="text.secondary">Game name</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="primary">{gameName}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="text.secondary">Number of wins</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="warning.main">{wins}X</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="text.secondary">Bonus</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="red">₹{bonus}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2" color="text.secondary">Winning time</Typography>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: '#f5f5f5', py: 1, borderBottom: '3px solid white' }}>
          <Typography variant="body2">{time}</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const WinningStar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const winningItems = [
    { avatar: "/assets/pro1.png", nickname: "917***914", gameName: "Mines", wins: 10.14, bonus: "50.00", time: "2025-01-17 05:54:00" },
    { avatar: "/assets/pro2.png", nickname: "918***025", gameName: "Mines", wins: 14.63, bonus: "50.00", time: "2025-01-17 05:54:00" },
    { avatar: "/assets/pro3.png", nickname: "919***822", gameName: "Money Coming", wins: 22, bonus: "100.00", time: "2025-01-17 05:54:00" },
    { avatar: "/assets/pro4.png", nickname: "919***822", gameName: "Money Coming", wins: 10, bonus: "50.00", time: "2025-01-17 05:54:00" },
  ];

  return (
    <div>
      <Mobile>
        <Box sx={{ bgcolor: '#f0f0f0', minHeight: '100vh' }}>
          <AppBar position="static" sx={{ bgcolor: '#F95959', color: 'white' }} elevation={0}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate('/superjackpot')}>
                <ArrowBackIosOutlinedIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Winning star
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ mt: 2 }}>
            {winningItems.map((item, index) => (
              <WinningItem key={index} {...item} />
            ))}
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default WinningStar;
