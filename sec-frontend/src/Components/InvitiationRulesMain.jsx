import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  TableBody,
} from '@mui/material';
import Mobile from './Mobile';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { rules, rulesdata } from './fake';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const InvitationRulesMain = ({ children }) => {

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVh);
    setVh();

    return () => window.removeEventListener('resize', setVh);
  }, []);

  const navigate = useNavigate(); // Hook for navigation

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const rows = [
    { stars: 'L0', coins: 0, goldCoins: 0, teamRanking: '0' },
    { stars: 'L1', coins: '500K', goldCoins: '100K', teamRanking: '100k' },
    { stars: 'L2', coins: '1,000K', goldCoins: '200K', teamRanking: '500k' },
    { stars: 'L3', coins: '2.5M', goldCoins: '500K', teamRanking: '700k' },
    { stars: 'L4', coins: '3.5M', goldCoins: '700K', teamRanking: '700k' },
    { stars: 'L5', coins: '5M', goldCoins: '1,000K', teamRanking: '1000k' },
    { stars: 'L6', coins: '10M', goldCoins: '2M', teamRanking: '2M' },
    { stars: 'L7', coins: '100M', goldCoins: '20M', teamRanking: '20M' },
    { stars: 'L8', coins: '500M', goldCoins: '100M', teamRanking: '100M' },
    { stars: 'L9', coins: '1,000M', goldCoins: '200M', teamRanking: '200M' },
    { stars: 'L10', coins: '1,500M', goldCoins: '300M', teamRanking: '300M' },
  ];
 
  const rows2 = [
    { stars: 1, tier1: '0.64%', tier2: '0.18%', tier3: '0.054%', tier4: '0' },
    { stars: 2, tier1: '0.7%', tier2: '0.245%', tier3: '0.0858%', tier4: '0' },
    { stars: 3, tier1: '0.75%', tier2: '0.2812%', tier3: '0.1054%', tier4: '0.1' },
    { stars: 4, tier1: '0.8%', tier2: '0.32%', tier3: '0.128%', tier4: '0.2' },
    { stars: 5, tier1: '0.85%', tier2: '0.3612%', tier3: '0.1534%', tier4: '0.3' },
    { stars: 6, tier1: '0.9%', tier2: '0.405%', tier3: '0.1822%', tier4: '0.4' },
    { stars: 7, tier1: '1%', tier2: '0.5%', tier3: '0.25%', tier4: '0' },
    { stars: 8, tier1: '1.1%', tier2: '0.605%', tier3: '0.3328%', tier4: '0' },
    { stars: 9, tier1: '1.2%', tier2: '0.72%', tier3: '0.432%', tier4: '0.5' },
    { stars: 10, tier1: '1.3%', tier2: '0.845%', tier3: '0.5492%', tier4: '0' },
    { stars: 11, tier1: '1.4%', tier2: '0.98%', tier3: '0.684%', tier4: '0.6' },
  ];

  const rows3 = [
    { stars: 1, tier1: '0.3%', tier2: '0.09%', tier3: '0.027%', tier4: '0.0' },
    { stars: 2, tier1: '0.35%', tier2: '0.1225%', tier3: '0.0429%', tier4: '0.1' },
    { stars: 3, tier1: '0.375%', tier2: '0.1404%', tier3: '0.0527%', tier4: '0.0' },
    { stars: 4, tier1: '0.4%', tier2: '0.16%', tier3: '0.0664%', tier4: '0.0' },
    { stars: 5, tier1: '0.425%', tier2: '0.1804%', tier3: '0.0764%', tier4: '0.0' },
    { stars: 6, tier1: '0.45%', tier2: '0.2025%', tier3: '0.0911%', tier4: '0.1' },
    { stars: 7, tier1: '0.5%', tier2: '0.25%', tier3: '0.125%', tier4: '0.0' },
    { stars: 8, tier1: '0.55%', tier2: '0.3025%', tier3: '0.1644%', tier4: '0.0' },
    { stars: 9, tier1: '0.6%', tier2: '0.36%', tier3: '0.216%', tier4: '0.1' },
    { stars: 10, tier1: '0.65%', tier2: '0.4225%', tier3: '0.2746%', tier4: '0.1' },
    { stars: 11, tier1: '0.7%', tier2: '0.49%', tier3: '0.343%', tier4: '0.2' },
  ];

  const rows4 = [
    { stars: 1, tier1: '0.3%', tier2: '0.09%', tier3: '0.027%', tier4: '0.0' },
    { stars: 2, tier1: '0.35%', tier2: '0.1225%', tier3: '0.0429%', tier4: '0.1' },
    { stars: 3, tier1: '0.375%', tier2: '0.1404%', tier3: '0.0527%', tier4: '0.0' },
    { stars: 4, tier1: '0.4%', tier2: '0.16%', tier3: '0.0664%', tier4: '0.0' },
    { stars: 5, tier1: '0.425%', tier2: '0.1804%', tier3: '0.0764%', tier4: '0.0' },
    { stars: 6, tier1: '0.45%', tier2: '0.2025%', tier3: '0.0911%', tier4: '0.1' },
    { stars: 7, tier1: '0.5%', tier2: '0.25%', tier3: '0.125%', tier4: '0.0' },
    { stars: 8, tier1: '0.55%', tier2: '0.3025%', tier3: '0.1644%', tier4: '0.0' },
    { stars: 9, tier1: '0.6%', tier2: '0.36%', tier3: '0.216%', tier4: '0.1' },
    { stars: 10, tier1: '0.65%', tier2: '0.4225%', tier3: '0.2746%', tier4: '0.1' },
    { stars: 11, tier1: '0.7%', tier2: '0.49%', tier3: '0.343%', tier4: '0.2' },
  ];

  const rows5 = [
    { stars: 1, tier1: '0.3%', tier2: '0.09%', tier3: '0.027%', tier4: '0.0' },
    { stars: 2, tier1: '0.35%', tier2: '0.1225%', tier3: '0.0429%', tier4: '0.1' },
    { stars: 3, tier1: '0.375%', tier2: '0.1404%', tier3: '0.0527%', tier4: '0.0' },
    { stars: 4, tier1: '0.4%', tier2: '0.16%', tier3: '0.0664%', tier4: '0.0' },
    { stars: 5, tier1: '0.425%', tier2: '0.1804%', tier3: '0.0764%', tier4: '0.0' },
    { stars: 6, tier1: '0.45%', tier2: '0.2025%', tier3: '0.0911%', tier4: '0.1' },
    { stars: 7, tier1: '0.5%', tier2: '0.25%', tier3: '0.125%', tier4: '0.0' },
    { stars: 8, tier1: '0.55%', tier2: '0.3025%', tier3: '0.1644%', tier4: '0.0' },
    { stars: 9, tier1: '0.6%', tier2: '0.36%', tier3: '0.216%', tier4: '0.1' },
    { stars: 10, tier1: '0.65%', tier2: '0.4225%', tier3: '0.2746%', tier4: '0.1' },
    { stars: 11, tier1: '0.7%', tier2: '0.49%', tier3: '0.343%', tier4: '0.2' },
  ];
  return (
    <div>
      <Mobile>
        <div style={{backgroundColor:"#242424"}}>
        <Container disableGutters maxWidth="xs" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box
      sx={{
        bgcolor: '#F95959',
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure spacing is maintained
        color: 'white',
      }}
    >
      <ChevronLeftIcon
        sx={{ fontSize: 30, cursor: 'pointer' }} // Added cursor for better UX
        onClick={handleBackClick} // Attach the click handler
      />
      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        Rules
      </Typography>
      <Box sx={{ width: 30 }} /> {/* This box maintains the space on the right */}
    </Box>

      {/* Subheading Section */}
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          color: 'gray',
          textAlign: 'center', 
          '& p': {
            color: 'green',
            fontSize: '1.7rem', 
            margin: 0 
          }
        }}
      >
        <p>[Promotion partner] program</p>
        This activity is valid for a long time
      </Typography>

      {/* Rules Section */}
      <Box sx={{ flex: 1, p: 2 }}>
        {rules.map((rule, index) => (
          <Paper
            key={index}
            // elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              p: 2,
              mb: 2,
              // backgroundColor: '#f5f5f5',
              border:"none"
            }}
          >
            <Box
              sx={{
                backgroundColor: '#F95959',
                borderRadius: '50%',
                width: 30,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                color: 'white',
                mb: 1,
              }}
            >
              {index + 1}
            </Box>
            <Typography variant="body2" color="textPrimary" sx={{ textAlign: 'justify' }}>
              {rule}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Table Section */}
      {/* <Box sx={{ p: 2, mt: 2 }}>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F95959' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rebate level</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Team Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Team Betting</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Team Deposit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rulesdata.map((row) => (
                <TableRow key={row.level}>
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        bgcolor: '#F95959',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        // fontWeight: 'bold',
                      }}
                    >
                      {row.level}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{row.teamNumber}</TableCell>
                  <TableCell align="center">{row.teamBetting}</TableCell>
                  <TableCell align="center">{row.teamDeposit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}
    </Container>
        </div>
      </Mobile>
    </div>
  )
}

export default InvitationRulesMain;