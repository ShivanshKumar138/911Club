import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/system';
import { domain } from '../../Components/config';

const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
//   transition: 'all 0.3s ease-in-out',
//   '&:hover': {
//     boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
//   },
//   background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.dark,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.dark,
  },
  '& .MuiSelect-select': {
    padding: '14px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: '56px',
  fontSize: '1rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const SetResultForm = ({ fetchData, timer, periodId, remainingTime }) => {
  const [results, setResults] = useState({
    A: '', B: '', C: '', D: '', E: ''
  });
  const [settingResult, setSettingResult] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleResultChange = (section, value) => {
    setResults(prev => ({ ...prev, [section]: value }));
  };

  const determineSize = (number) => number >= 0 && number <= 4 ? 'Small' : 'Big';
  const determineParity = (number) => number % 2 === 0 ? 'Even' : 'Odd';

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";

  const setResult = async () => {
    if (Object.values(results).some(val => val === '')) {
      setSnackbar({ open: true, message: 'Please set numbers for all sections.', severity: 'error' });
      return;
    }

    setSettingResult(true);

    const payload = {
      timerName: timer,
      periodId: periodId,
      sectionOutcome: Object.entries(results).reduce((acc, [key, value]) => {
        acc[key] = {
          number: parseInt(value),
          size: determineSize(parseInt(value)),
          parity: determineParity(parseInt(value)),
        };
        return acc;
      }, {}),
    };
    console.log(payload)

    try {
      const response = await axios.post(`${domain}/set-5d-result`, payload, {
        withCredentials: true,
      });
      setSnackbar({ open: true, message: 'Result set successfully!', severity: 'success' });
      fetchData(); // Refresh the data
      // Reset form after successful submission
      setResults({ A: '', B: '', C: '', D: '', E: '' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to set result. Please try again.', severity: 'error' });
      console.error('Error setting result:', err);
    } finally {
      setSettingResult(false);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between"}}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Set 5D Result
      </Typography>
      <Box>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#4782ff",
              borderRadius: "4px",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                width: "16px",
                height: "22px",
                marginTop: "12px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "#ffffff",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: "25px",
                margin: "2px 2px",
              }}
            >
              {minutes[0]}
            </Box>
            <Box
              sx={{
                display: "inline-block",
                width: "16px",
                height: "22px",
                marginTop: "8px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "#ffffff",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "25px",
                margin: "0 2px",
              }}
            >
              {minutes[1]}
            </Box>
            <Box
              sx={{
                display: "inline-block",
                width: "16px",
                height: "22px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "#ffffff",
                marginTop: "8px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "20px",
                margin: "0 2px",
              }}
            >
              :
            </Box>
            <Box
              sx={{
                display: "inline-block",
                width: "16px",
                height: "22px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "#ffffff",
                marginTop: "10px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "25px",
                margin: "0 2px",
              }}
            >
              {seconds[0]}
            </Box>
            <Box
              sx={{
                display: "inline-block",
                width: "16px",
                height: "22px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "#ffffff",
                fontWeight: "bold",
                marginTop: "8px",
                textAlign: "center",
                lineHeight: "25px",
                margin: "2px 2px",
              }}
            >
              {seconds[1]}
            </Box>
          </Typography>
        </Box>
        </Box>
      <Grid container spacing={3} alignItems="center">
        {['A', 'B', 'C', 'D', 'E'].map((section) => (
          <Grid item xs={12} sm={6} md={2} key={section}>
            <FormControl fullWidth>
              <InputLabel id={`section-${section}-label`}>Section {section}</InputLabel>
              <StyledSelect
                labelId={`section-${section}-label`}
                value={results[section]}
                onChange={(e) => handleResultChange(section, e.target.value)}
                label={`Section ${section}`}
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem value={i} key={i}>{i}</MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={2}>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={setResult}
            disabled={settingResult}
            fullWidth
          >
            {settingResult ? <CircularProgress size={24} color="inherit" /> : 'Set Result'}
          </StyledButton>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </StyledPaper>
  );
};

export default SetResultForm;