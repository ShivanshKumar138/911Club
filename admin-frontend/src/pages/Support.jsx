import { Box, Typography, Paper } from '@mui/material';

const Support = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Support
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Support system content goes here</Typography>
      </Paper>
    </Box>
  );
};

export default Support; 