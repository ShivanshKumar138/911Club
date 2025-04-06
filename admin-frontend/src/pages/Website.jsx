import { Box, Typography, Paper } from '@mui/material';

const Website = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Go to Website
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Website management content goes here</Typography>
      </Paper>
    </Box>
  );
};

export default Website; 