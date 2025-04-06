
import Mobile from './Mobile';

import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

const InvitationRecordPage = () => {
  const tableData = [
    { days: 1, amount: '₹500.00', bonus: '₹11.00' },
    { days: 2, amount: '₹1,000.00', bonus: '₹21.00' },
    { days: 3, amount: '₹5,000.00', bonus: '₹101.00' },
    { days: 4, amount: '₹10,000.00', bonus: '₹201.00' },
    { days: 5, amount: '₹20,000.00', bonus: '₹401.00' },
    { days: 6, amount: '₹100,000.00', bonus: '₹2,551.00' },
    { days: 7, amount: '₹200,000.00', bonus: '₹7,051.00' },
];
    
      // Rules text
      const rules = [
        'The higher the number of consecutive login days, the more rewards you get, up to 7 consecutive days',
        'During the activity, please check once a day',
        'Players with no deposit history cannot claim the bonus',
        'Deposit requirements must be met from day one',
        'The platform reserves the right to final interpretation of this activity',
        'When you encounter problems, please contact customer service',
      ];

       const navigate = useNavigate();

       const handleBack = () => {
        navigate("/attendance");
        };
  return (
    <Mobile>
      <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <IconButton 
          onClick={handleBack}
          sx={{ 
            position: 'absolute',
            left: 8,
            top: 8,
            color: '#ff6b6b'
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" align="center" gutterBottom sx={{ mb: 2 }}>
          Game rules
        </Typography>
      
      {/* Table with salmon/coral background */}
      <TableContainer component={Paper} sx={{ 
        mb: 2, 
        backgroundColor: '#ff8e8e', 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ff6b6b' }}>
              <TableCell align="center" sx={{ color: 'white', py: 1 }}>Continuous attendance</TableCell>
              <TableCell align="center" sx={{ color: 'white', py: 1 }}>Accumulated amount</TableCell>
              <TableCell align="center" sx={{ color: 'white', py: 1 }}>Attendance bonus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.days} sx={{ backgroundColor: '#ff8e8e' }}>
                <TableCell align="center" sx={{ color: 'white', py: 1 }}>{row.days}</TableCell>
                <TableCell align="center" sx={{ color: 'white', py: 1 }}>{row.amount}</TableCell>
                <TableCell align="center" sx={{ color: 'white', py: 1 }}>{row.bonus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rules card with light salmon background */}
      <Card sx={{ 
        backgroundColor: '#ffefef', 
        borderRadius: 2,
        border: '1px solid #ffcece'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" align="center" gutterBottom sx={{ 
            mb: 2, 
            color: '#ff6b6b',
            backgroundColor: '#ff6b6b',
            color: 'white',
            py: 1,
            borderRadius: 1
          }}>
            Rules
          </Typography>
          <List disablePadding>
            {rules.map((rule, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemText 
                  primary={rule} 
                  primaryTypographyProps={{ 
                    variant: 'body2', 
                    color: '#336699',
                    fontSize: '0.85rem'
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
    </Mobile>
  );
};

export default InvitationRecordPage;