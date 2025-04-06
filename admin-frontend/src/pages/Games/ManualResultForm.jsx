import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Select, MenuItem, FormControl, TextField } from '@mui/material';
import { apiCall } from '../../utils/api';

const NUMBER_COLOR_MAP = {
  0: ["violet", "red"],
  1: "green",
  2: "red",
  3: "green",
  4: "red",
  5: ["violet", "green"],
  6: "red",
  7: "green",
  8: "red",
  9: "green",
};

const ManualResultForm = ({ timer, setTimer,  }) => {
  const [numberOutcome, setNumberOutcome] = useState('');
  const [sizeOutcome, setSizeOutcome] = useState('');
  const [colorOutcome, setColorOutcome] = useState('');
  const [timers, setTimers] = useState(['30sec', '1min', '3min', '5min']);
  const [periodId, setPeriodId] = useState('');

  useEffect(() => {
    const fetchLatestPeriodId = async () => {
      try {
        const response = await apiCall('/latest-bet-sums');
        setPeriodId(response[timer].periodId);
        console.log('Latest period ID:', response[timer].periodId);
      } catch (error) {
        console.error('Failed to fetch latest period ID:', error);
      }
    };

    const intervalId = setInterval(fetchLatestPeriodId, 1000); // Run every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [timer]);

  const handleNumberChange = (event) => {
    const number = parseInt(event.target.value);
    setNumberOutcome(number);
    setSizeOutcome(number > 4 ? 'big' : 'small');
    const colors = NUMBER_COLOR_MAP[number];
    setColorOutcome(colors || ''); // Add fallback empty string for invalid numbers
  };;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        periodId,
        numberOutcome: parseInt(numberOutcome),
        colorOutcome: Array.isArray(colorOutcome) ? colorOutcome : [colorOutcome],
        sizeOutcome,
        timer,
      };
      console.log('Payload:', payload);
      const response = await apiCall('/set-manual-result', { method: 'POST', body: JSON.stringify(payload) });
      console.log('Response:', response);
      if (response) {
        alert('Manual result set successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to set manual result:', errorText);
        alert(`Failed to set manual result: ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to set manual result:', error);
      alert('Failed to set manual result');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Set Manual Result
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Select
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
                displayEmpty
              >
                {timers.map((timerOption) => (
                  <MenuItem key={timerOption} value={timerOption}>
                    {timerOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Period ID"
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number Outcome"
              value={numberOutcome}
              onChange={handleNumberChange}
              fullWidth
              type="number"
              inputProps={{ min: 0, max: 9 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Size Outcome"
              value={sizeOutcome}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Color Outcome"
              value={Array.isArray(colorOutcome) ? colorOutcome.join(', ') : colorOutcome}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Set Manual Result
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ManualResultForm;