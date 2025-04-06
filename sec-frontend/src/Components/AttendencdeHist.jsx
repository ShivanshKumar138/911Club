import Mobile from './Mobile';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { domain } from "./config";

const InvitationRecordPage = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch(`${domain}/attendance-transactions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setTransactions(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/attendance");
    };

    return (
        <Mobile>
            <Box sx={{ 
                position: 'sticky', 
                top: 0, 
                bgcolor: '#F55858',
                zIndex: 1000,
                padding: '10px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                        onClick={handleBack}
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: 'white', flex: 1, textAlign: 'center' }}>
                        Attendance History
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ padding: '20px' }}>
                {transactions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f0f0f0' }}>
                                <TableRow>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction._id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}>
                                        <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                                        <TableCell>₹{transaction.amount}</TableCell>
                                        <TableCell sx={{ color: 'green' }}>Received Successfully</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 60px)',
                    }}>
                        <Typography variant="h6" sx={{ color: '#666' }}>
                            No Content Available
                        </Typography>
                    </Box>
                )}
            </Box>
        </Mobile>
    );
};

export default InvitationRecordPage;