import { Paper, Box, Typography } from '@mui/material';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        background: `linear-gradient(45deg, ${color}FF, ${color}99)`,
        color: 'white',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: 'white',
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Optional: Add small chart or trend indicator */}
        <Box
          sx={{
            mt: 2,
            height: '40px',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* You can add a mini chart here if needed */}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCard; 