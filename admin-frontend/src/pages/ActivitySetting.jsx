import { Box, Typography, Paper } from '@mui/material';

const ActivitySetting = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Activity Setting
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>Activity settings content goes here</Typography>
      </Paper>
    </Box>
  );
};

export default ActivitySetting; 