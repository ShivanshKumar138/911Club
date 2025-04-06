import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { domain } from "../Components/config";

const Payment = () => {
  const [formData, setFormData] = useState({
    payee_name: '',
    payee_bank_code: '',
    payee_bank_account: '',
    payee_phone: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.payee_name) {
      newErrors.payee_name = 'Name is required';
    }
    if (!formData.payee_bank_code) {
      newErrors.payee_bank_code = 'Bank code is required';
    }
    if (!formData.payee_bank_account) {
      newErrors.payee_bank_account = 'Bank account is required';
    }
    if (!/^\d{10}$/.test(formData.payee_phone)) {
      newErrors.payee_phone = 'Please enter a valid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const generateOrderNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const defaultData = {
      channel_cashflow_id: '12',
      amount: Number(formData.amount),
      order_number: generateOrderNumber(),
      url: 'https://747lottery.fun/withdraw',
    };

    try {
      const response = await axios.post(`${domain}/create-payment-btcash`, {
        ...defaultData,
        ...formData,
      });
      setNotification({
        type: 'success',
        message: 'Payment created successfully!'
      });
      setFormData({
        payee_name: '',
        payee_bank_code: '',
        payee_bank_account: '',
        payee_phone: '',
        amount: '',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Error creating payment'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Withdraw Gateway Amount
      </Typography>
      {notification.message && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <TextField
          label="Payee Name"
          name="payee_name"
          value={formData.payee_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.payee_name}
          helperText={errors.payee_name}
        />
        <TextField
          label="Payee Bank Code"
          name="payee_bank_code"
          value={formData.payee_bank_code}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.payee_bank_code}
          helperText={errors.payee_bank_code}
        />
        <TextField
          label="Payee Bank Account"
          name="payee_bank_account"
          value={formData.payee_bank_account}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.payee_bank_account}
          helperText={errors.payee_bank_account}
        />
        <TextField
          label="Payee Phone"
          name="payee_phone"
          value={formData.payee_phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.payee_phone}
          helperText={errors.payee_phone}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </form>
    </Container>
  );
};

export default Payment;