import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { apiCall } from '../utils/api';
import { useToast } from "../components/ui/use-toast";

const WalletUpdate = () => {
  const [formData, setFormData] = useState({
    uid: '',
    amount: '',
    action: 'increase',
    reason: '' // Added reason state
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userIdForHistory, setUserIdForHistory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.amount) > 5000) {
      toast({
        title: "Error",
        description: "Maximum amount allowed is 100",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Updating wallet:', formData);
      const response = await apiCall('/updateWallet', {
        method: 'PUT',
        body: JSON.stringify({
          uid: formData.uid,
          amount: Number(formData.amount),
          action: formData.action,
          reason: formData.reason // Include reason in API call
        })
      });

      console.log('API Response:', response);

      if (response) {
        toast({
          title: "Success",
          description: "Wallet updated successfully",
          variant: "success",
        });
        // Reset form
        setFormData({
          uid: '',
          amount: '',
          action: 'increase',
          reason: '' // Reset reason
        });
      }
    } catch (error) {
      console.error('Failed to update wallet:', error);
      toast({
        title: "Error",
        description: "Failed to update wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };


  const fetchWalletHistory = async (e) => {
    e.preventDefault();
    setLoadingHistory(true);
  
    try {
      const response = await apiCall(`/admin/wallet-history?uid=${userIdForHistory}`, {
        method: 'GET'
        // Remove body from GET request
      });
  
      if (response.success) {
        setHistoryData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch wallet history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet history",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ maxWidth: 5000, mx: 'auto', p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Update User Wallet
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="User ID"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              required
              fullWidth
            />

<TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                inputProps: { 
                  min: 0,
                  max: 5000
                }
              }}
              helperText="Maximum amount allowed is 100"
            />

            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                name="action"
                value={formData.action}
                onChange={handleChange}
                label="Action"
                required
              >
                <MenuItem value="increase">Increase</MenuItem>
                <MenuItem value="decrease">Decrease</MenuItem>
              </Select>
            </FormControl>



<FormControl fullWidth>
  <InputLabel>Remark for Transaction History</InputLabel>
  <Select
    name="reason"
    value={formData.reason}
    onChange={handleChange}
    label="Remark for Transaction History"
    required
  >
    <MenuItem value="WalletIncrease">WalletIncrease</MenuItem>
    <MenuItem value="WalletDecrease">WalletDecrease</MenuItem>
    <MenuItem value="Salary">Salary</MenuItem>
    <MenuItem value="WinstreakBonus">Winstreak Bonus</MenuItem>
    <MenuItem value="AdvancedSalary">Advanced Salary</MenuItem>
  </Select>
</FormControl>



            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#6B46C1',
                '&:hover': {
                  bgcolor: '#8B5CF6'
                }
              }}
            >
              {loading ? 'Updating...' : 'Update Wallet'}
            </Button>
          </Stack>
        </form>
      </Paper>

       {/* New Wallet History Section */}
       <Paper sx={{ maxWidth: 5000, mx: 'auto', p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          View Wallet History
        </Typography>
        <form onSubmit={fetchWalletHistory}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              label="User ID"
              value={userIdForHistory}
              onChange={(e) => setUserIdForHistory(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loadingHistory}
              sx={{
                bgcolor: '#6B46C1',
                '&:hover': {
                  bgcolor: '#8B5CF6'
                }
              }}
            >
              {loadingHistory ? 'Loading...' : 'Fetch History'}
            </Button>
          </Stack>
        </form>
        {historyData && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User: {historyData.username} (ID: {historyData.uid})
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Current Balance: ₹{historyData.currentBalance}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Source</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.walletHistory.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell sx={{
                        color: transaction.type === 'credit' ? 'green' : 'red'
                      }}>
                        {transaction.type.toUpperCase()}
                      </TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>₹{transaction.balance}</TableCell>
                      <TableCell>{transaction.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WalletUpdate;