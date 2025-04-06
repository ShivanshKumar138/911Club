


/*eslint-disable*/
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { 
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import { apiCall } from '../utils/api';
import { useToast } from "../components/ui/use-toast";
import { Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

// Add these state variables inside the Withdraw component
const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

// Add these handler functions inside the Withdraw component
const handleConfirmOpen = () => {
  setOpenConfirmDialog(true);
};

const handleConfirmClose = () => {
  setOpenConfirmDialog(false);
};
  
// Add this function to handle form submission:
const handlePaymentSubmission = async (withdrawalId) => {
  handleConfirmClose(); // Close the dialog first
  setIsSubmitting(true);

  try {
    const withdrawal = withdrawals.find(w => w._id === withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    const bankDetails = withdrawal.userId?.bankDetails?.[0];
    if (!bankDetails) {
      throw new Error('Bank details not found');
    }

    const payload = {
      channel_cashflow_id: 12,
      amount: withdrawal.balance.toString(),
      payee_name: bankDetails.name,
      payee_bank_code: bankDetails.ifscCode,
      payee_bank_account: bankDetails.accountNo,
      payee_phone: bankDetails.mobile || '',
      order_number: withdrawal._id.substring(0, 10), // Using first 10 chars of _id
      url: 'https://api.747lottery.fun/callback'
    };

    const response = await apiCall('/create-payment-btcash', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.success) {
      toast({
        title: "Success",
        description: "Payment request submitted successfully",
        variant: "success",
      });
      setSelectedWithdrawal(null);
    }
  } catch (error) {
    console.error('Payment submission error:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to submit payment request",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  const fetchWithdrawals = async () => {
    try {
      const response = await apiCall('/all-withdraw-history-admin_only');
      console.log('Withdrawals:', response);
      if (response.success) {
        // Filter out completed records at the data fetching level
        const pendingWithdrawals = response.userWithdrawals.filter(
          withdrawal => withdrawal.status.toLowerCase() !== 'completed'
        );
        setWithdrawals(pendingWithdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getUid = (withdrawal) => {
    if (withdrawal.userUid) return withdrawal.userUid;
    if (withdrawal.userId?.uid) return withdrawal.userId.uid;
    return 'N/A';
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    // First filter by completion status
    if (withdrawal.status.toLowerCase() === 'completed') {
      return false;
    }
    
    // If no search term, include all non-completed withdrawals
    if (!searchTerm) return true;
    
    // Search based on selected field
    switch (searchField) {
      case '_id':
        return withdrawal._id.toLowerCase().includes(searchTerm.toLowerCase());
      case 'uid':
        const uid = getUid(withdrawal);
        return uid.toLowerCase().includes(searchTerm.toLowerCase());
      
      case 'bank':
        const bankDetails = withdrawal.userId?.bankDetails?.[0];
        return bankDetails && 
          (bankDetails.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bankDetails.accountNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bankDetails.ifscCode?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      case 'mobile':
        const mobile = withdrawal.userId?.bankDetails?.[0]?.mobile;
        return mobile && mobile.toLowerCase().includes(searchTerm.toLowerCase());
      
      case 'all':
      default:
        // Search across all string values
        return Object.values(withdrawal).some(
          value => 
            value && 
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        ) || 
        // Also check UID specifically since it might be nested
        getUid(withdrawal).toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Also check bank details
        (withdrawal.userId?.bankDetails?.[0]?.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         withdrawal.userId?.bankDetails?.[0]?.accountNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         withdrawal.userId?.bankDetails?.[0]?.ifscCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         withdrawal.userId?.bankDetails?.[0]?.mobile?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  });

  const displayedWithdrawals = filteredWithdrawals
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getBankDetails = (withdrawal) => {
    const bankDetails = withdrawal.userId?.bankDetails?.[0];
    if (!bankDetails) return 'N/A';
    return `${bankDetails.bankName} - ${bankDetails.accountNo}`;
  };

  const getMobileNumber = (withdrawal) => {
    const bankDetails = withdrawal.userId?.bankDetails?.[0];
    if (!bankDetails?.mobile) return 'N/A';
    return bankDetails.mobile;
  };

  const handleWithdrawAction = async (withdrawalId, action, withdrawal) => {
    try {
      console.log('Processing withdrawal:', withdrawal);
      const response = await apiCall('/update-withdraw-status', {
        method: 'POST',
        body: JSON.stringify({
          withdrawId: withdrawalId,
          acceptanceType: action === 'accept' ? 'Completed' : 'Rejected',
          remark: action === 'accept' ? 'Withdrawal approved' : 'Withdrawal rejected'
        })
      });
      
      console.log('API Response:', response);
      
      if (response) {
        // If action is 'accept', remove the item from the list since it's now completed
        if (action === 'accept') {
          setWithdrawals(withdrawals.filter(item => item._id !== withdrawalId));
        } else {
          // If rejected, just update its status
          setWithdrawals(withdrawals.map(item => 
            item._id === withdrawalId 
              ? { ...item, status: 'Rejected' }
              : item
          ));
        }

        toast({
          title: "Success",
          description: `Withdrawal ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error(`Failed to ${action} withdrawal:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} withdrawal. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const renderActionButtons = (withdrawal) => {
    if (withdrawal.status.toLowerCase() === 'pending') {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleWithdrawAction(withdrawal._id, 'accept', withdrawal)}
            sx={{ minWidth: 'auto' }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleWithdrawAction(withdrawal._id, 'reject', withdrawal)}
            sx={{ minWidth: 'auto' }}
          >
            Reject
          </Button>
        </Stack>
      );
    }
    return null;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Pending Withdrawals
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            {/* Search field selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Search in</InputLabel>
              <Select
  value={searchField}
  label="Search in"
  onChange={(e) => {
    setSearchField(e.target.value);
    setPage(0);
  }}
  startAdornment={
    <InputAdornment position="start">
      <FilterIcon fontSize="small" />
    </InputAdornment>
  }
>
  <MenuItem value="all">All Fields</MenuItem>
  <MenuItem value="_id">Withdrawal ID</MenuItem>
  <MenuItem value="uid">User ID</MenuItem>
  <MenuItem value="username">Name</MenuItem>
  <MenuItem value="bank">Bank Details</MenuItem>
  <MenuItem value="mobile">Mobile Number</MenuItem>
</Select>
            </FormControl>
            
            {/* Unified search field */}
            <TextField
              size="small"
              placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />
            
            {/* Clear button */}
            {searchTerm && (
              <Button 
                variant="outlined" 
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            )}
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>UID</TableCell>
                <TableCell>Withdrawal ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Bank Details</TableCell>
                <TableCell>IFSC Code</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedWithdrawals.length > 0 ? (
                displayedWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
                    <TableCell>{getUid(withdrawal)}</TableCell>
                    <TableCell>{withdrawal._id}</TableCell>
                    <TableCell>{withdrawal?.userId?.bankDetails[0]?.name || 'N/A'}</TableCell>
                    <TableCell>{getBankDetails(withdrawal)}</TableCell>
                    <TableCell>{withdrawal?.userId?.bankDetails[0]?.ifscCode || 'N/A'}</TableCell>
                    <TableCell>{getMobileNumber(withdrawal)}</TableCell>
                    <TableCell>₹{withdrawal.balance.toLocaleString()}</TableCell>
                    <TableCell>{withdrawal.withdrawMethod}</TableCell>
                    <TableCell>
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={withdrawal.status}
                        color={getStatusColor(withdrawal.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{withdrawal.remark || 'N/A'}</TableCell>
                    <TableCell>
                      {renderActionButtons(withdrawal)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No pending withdrawals found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWithdrawals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ mt: 4, p: 2 }}>
  <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
    Submit Payment Request
  </Typography>
  
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Select Withdrawal</InputLabel>
    <Select
      value={selectedWithdrawal || ''}
      onChange={(e) => setSelectedWithdrawal(e.target.value)}
      label="Select Withdrawal"
    >
      {withdrawals
        .filter(w => w.status.toLowerCase() === 'pending')
        .map(w => (
          <MenuItem key={w._id} value={w._id}>
            {`${w._id} - ${w.userId?.bankDetails?.[0]?.name || 'N/A'} - ₹${w.balance}`}
          </MenuItem>
        ))}
    </Select>
  </FormControl>

  {selectedWithdrawal && (
    <Paper sx={{ p: 2 }}>
      {(() => {
        const withdrawal = withdrawals.find(w => w._id === selectedWithdrawal);
        const bankDetails = withdrawal?.userId?.bankDetails?.[0];
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Payment Details Preview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography><strong>Channel ID:</strong> 12</Typography>
                <Typography><strong>Amount:</strong> ₹{withdrawal?.balance}</Typography>
                <Typography><strong>Payee Name:</strong> {bankDetails?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography><strong>Bank Code (IFSC):</strong> {bankDetails?.ifscCode || 'N/A'}</Typography>
                <Typography><strong>Account Number:</strong> {bankDetails?.accountNo || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {bankDetails?.mobile || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Order Number:</strong> {withdrawal?._id.substring(0, 10)}</Typography>
                <Typography><strong>Callback URL:</strong> https://api.747lottery.fun/callback</Typography>
              </Grid>
            </Grid>
            <Button
  variant="contained"
  color="primary"
  disabled={isSubmitting}
  onClick={handleConfirmOpen}
  sx={{ mt: 2 }}
>
  {isSubmitting ? 'Submitting...' : 'Submit Payment Request'}
</Button>

{/* Add this Dialog component after the Button */}
<Dialog
  open={openConfirmDialog}
  onClose={handleConfirmClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    Confirm Payment Submission
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to submit this payment request? This action cannot be undone.
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography><strong>Amount:</strong> ₹{withdrawal?.balance}</Typography>
        <Typography><strong>Account:</strong> {bankDetails?.accountNo}</Typography>
        <Typography><strong>IFSC:</strong> {bankDetails?.ifscCode}</Typography>
        <Typography><strong>Name:</strong> {bankDetails?.name}</Typography>
      </Box>
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleConfirmClose} color="inherit">
      Cancel
    </Button>
    <Button
      onClick={() => handlePaymentSubmission(selectedWithdrawal)}
      color="primary"
      variant="contained"
      autoFocus
    >
      Confirm Submit
    </Button>
  </DialogActions>
</Dialog>
          </Box>
        );
      })()}
    </Paper>
  )}
</Box>
      </Paper>
      
    </Box>
    
  );
};

export default Withdraw;