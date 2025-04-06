import { Paper, Typography } from '@mui/material';
import { LineChart } from "@mui/x-charts/LineChart";
const AnalyticsChart = () => {
  const data = {
    xAxis: [
      { data: [1, 2, 3, 4, 5, 6, 7] }
    ],
    series: [
      {
        data: [2, 5.5, 2, 8.5, 1.5, 5, 3],
        area: true,
      },
    ],
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Weekly Analytics
      </Typography>
      <LineChart
        xAxis={data.xAxis}
        series={data.series}
        height={300}
        sx={{
          '.MuiLineElement-root': {
            stroke: '#2196f3',
            strokeWidth: 2,
          },
          '.MuiAreaElement-root': {
            fill: 'url(#gradient)',
            opacity: 0.2,
          },
        }}
      />
    </Paper>
  );
};

export default AnalyticsChart; 