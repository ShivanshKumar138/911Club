import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';

const recentActivities = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: 'J' },
    action: 'Created new project',
    time: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: 'S' },
    action: 'Updated dashboard',
    time: '5 hours ago',
    status: 'warning',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: 'M' },
    action: 'Deleted old files',
    time: '1 day ago',
    status: 'error',
  },
];

const RecentActivities = () => {
  const getStatusColor = (status) => {
    const colors = {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    };
    return colors[status] || colors.success;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activities
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 30, height: 30 }}>
                      {activity.user.avatar}
                    </Avatar>
                    <Typography variant="body2">{activity.user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.time}</TableCell>
                <TableCell>
                  <Chip
                    label={activity.status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(activity.status)}15`,
                      color: getStatusColor(activity.status),
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentActivities; 