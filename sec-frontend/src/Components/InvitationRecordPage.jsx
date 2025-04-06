import React, { useEffect, useState } from 'react';
import Mobile from './Mobile';
import axios from "axios";
import { domain } from "./config";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  IconButton,
  Container,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InboxIcon from '@mui/icons-material/Inbox';

const InvitationRecordPage = () => {
  const [subordinates, setSubordinates] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchSubordinateDetails = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(`${domain}/subordinate-details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Subordinate details:", response);
        setSubordinates(response.data.subordinates);
      } catch (error) {
        console.error("Error fetching subordinate details:", error);
      }
    };

    fetchSubordinateDetails();
  }, []);
  return (
    <Mobile>
      <Paper 
        elevation={0}
        sx={{
          background: 'linear-gradient(45deg, #FB6E6A 30%, #ff8c89 90%)',
          borderRadius: 0,
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <Box px={2} py={2} display="flex" alignItems="center">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              color: 'white',
              fontWeight: 600
            }}
          >
            Invitation Reward Rules
          </Typography>
        </Box>
      </Paper>


<Container maxWidth="lg" sx={{ py: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
  {subordinates.length > 0 ? (
    <Grid container spacing={1}>
      {subordinates.map((subordinate, index) => (
        <Grid item xs={12} key={index}>
          <Card
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: '#FB6E6A',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8
              }
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box>
                    <Typography color="#FB6E6A" variant="caption" fontSize="0.7rem" fontWeight={600}>
                      UID
                    </Typography>
                    <Typography variant="body2" fontSize="0.85rem" fontWeight={500}>
                      {subordinate.uid}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box>
                    <Typography color="#FB6E6A" variant="caption" fontSize="0.7rem" fontWeight={600}>
                      Mobile
                    </Typography>
                    <Typography variant="body2" fontSize="0.85rem" fontWeight={500}>
                      {subordinate.mobile}
                    </Typography>
                  </Box>
                </Grid>
              <Grid item xs={6}>
  <Box>
    <Typography color="#FB6E6A" variant="caption" fontSize="0.7rem" fontWeight={600}>
      Registration Date
    </Typography>
    <Typography variant="body2" fontSize="0.85rem" fontWeight={500}>
      {new Date(subordinate.registrationDate).toLocaleDateString()} {new Date(subordinate.registrationDate).toLocaleTimeString()}
    </Typography>
  </Box>
</Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography color="#FB6E6A" variant="caption" fontSize="0.7rem" fontWeight={600}>
                      Deposit Amount
                    </Typography>
                    <Typography variant="body2" fontSize="0.85rem" fontWeight={500}>
                      ₹{subordinate.totalDepositAmount.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="40vh"
    >
      <InboxIcon sx={{ fontSize: 48, color: '#FB6E6A', mb: 1 }} />
      <Typography variant="subtitle1" color="text.secondary">
        No records available
      </Typography>
    </Box>
  )}
</Container>
    </Mobile>
  );
};

export default InvitationRecordPage;