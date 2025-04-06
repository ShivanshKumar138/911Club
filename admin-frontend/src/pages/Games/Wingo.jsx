import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Select, 
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';
import ManualResultForm from './ManualResultForm.jsx';

const BetButton = ({ number, totalBet, onBet, color = 'error' }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 2.5,
      textAlign: 'center',
      height: '100%',
      borderRadius: 4,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      transition: 'all 0.3s ease',
      position: 'relative',
      border: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(8px)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
        borderColor: 'transparent',
        '& .bet-amount': {
          transform: 'translateY(0)',
          opacity: 1,
        }
      },
    }}
  >
    {/* Casino Chip */}
    <Box
      sx={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: number === 0 || number === 5 ? 
          'linear-gradient(135deg, #FF4D4F 50%, #722ED1 50%)' : 
          color === 'error' ? '#FF4D4F' : '#52C41A',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        // Inner ring pattern
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          bottom: '8px',
          borderRadius: '50%',
          border: '4px dashed rgba(255,255,255,0.5)',
        },
        // Outer ring pattern
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          border: '8px double rgba(255,255,255,0.8)',
        },
        // Casino chip texture
        '.chip-texture': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: `
            repeating-radial-gradient(
              circle at center,
              transparent 0,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )
          `,
        },
        // Edge pattern
        '.chip-edge': {
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '50%',
          background: `
            repeating-conic-gradient(
              from 0deg,
              rgba(255,255,255,0.7) 0deg 10deg,
              transparent 10deg 20deg
            )
          `,
          clipPath: 'circle(50%)',
          opacity: 0.5,
        }
      }}
    >
      {/* Casino chip texture */}
      <Box className="chip-texture" />
      {/* Edge pattern */}
      <Box className="chip-edge" />
      
      {/* Number */}
      <Typography 
        variant="h3"
        sx={{ 
          color: 'white', 
          fontWeight: 'bold',
          position: 'relative',
          zIndex: 1,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif',
          userSelect: 'none',
          fontSize: '2.5rem',
        }}
      >
        {number}
      </Typography>
    </Box>

    {/* Bet Amount Section */}
    <Box
      className="bet-amount"
      sx={{
        width: '100%',
        transition: 'all 0.3s ease',
        transform: 'translateY(4px)',
        opacity: 0.9,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          mb: 1,
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        Total Bet
      </Typography>
      <Button 
        variant="contained" 
        color={color}
        fullWidth
        sx={{ 
          borderRadius: 2,
          py: 1,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          background: number === 0 || number === 5 ? 
            'linear-gradient(135deg, #FF4D4F 30%, #722ED1 70%)' : 
            undefined,
          '&:hover': {
            boxShadow: 'none',
            background: number === 0 || number === 5 ? 
              'linear-gradient(135deg, #FF4D4F 30%, #722ED1 70%)' : 
              undefined,
          }
        }}
      >
        {totalBet}
      </Button>
    </Box>
  </Paper>
);

const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={1} 
    sx={{ 
      p: 3,
      textAlign: 'center',
      height: '100%',
      borderRadius: 4,
      bgcolor: color + '10',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
  >
    <Box
      sx={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        bgcolor: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <Typography variant="h6" sx={{ color: color, fontWeight: 'bold' }}>
        {title.split(':')[1] || title}
      </Typography>
    </Box>
    <Button 
      variant="contained" 
      sx={{ 
        bgcolor: color,
        color: 'white',
        borderRadius: 2,
        py: 1,
        boxShadow: 'none',
        '&:hover': {
          bgcolor: color,
          boxShadow: 'none',
        },
        width: '100%',
      }}
    >
      Total Bet: {value}
    </Button>
  </Paper>
);

const ResultTable = ({ timer }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchResults = async () => {
    try {
      const response = await apiCall(`/wingoresult?timer=${timer}`);
      console.log('Results:', response);
      if (response && Array.isArray(response.Result)) {
        setResults(response.Result);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setError('Failed to fetch results');
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [timer]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Period ID</TableCell>
            <TableCell>Number Outcome</TableCell>
            <TableCell>Size Outcome</TableCell>
            <TableCell>Color Outcome</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => (
            <TableRow key={`${result.periodId}-${index}`}>
              <TableCell>{result.periodId}</TableCell>
              <TableCell>{result.numberOutcome}</TableCell>
              <TableCell>{result.sizeOutcome}</TableCell>
              <TableCell>{result.colorOutcome}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={results.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const Wingo = () => {
  const [timeInterval, setTimeInterval] = useState('30sec');
  const [periodId, setPeriodId] = useState('');
  const [totalBet, setTotalBet] = useState(0);
  const [timer, setTimer] = useState(60); // default 60 seconds
  const [betSums, setBetSums] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60); // default remaining time

  // Get total seconds based on selected interval
  const getIntervalSeconds = (interval) => {
    switch (interval) {
      case '30sec':
        return 30; // 30 seconds
      case '3min':
        return 180; // 3 minutes
      case '5min':
        return 300; // 5 minutes
      case '1min':
      default:
        return 60; // 1 minute
    }
  };

  // Handle interval change
  const handleIntervalChange = (event) => {
    const newInterval = event.target.value;
    setTimeInterval(newInterval);
    setTimer(getIntervalSeconds(newInterval));
  };

  const fetchBetSums = async () => {
    try {
      const response = await apiCall('/latest-bet-sums');
      setBetSums(response);
    } catch (error) {
      console.error('Failed to fetch bet sums:', error);
    }
  };

  useEffect(() => {
    // Generate period ID
    const date = new Date();
    const periodId = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(Math.floor(date.getMinutes() / 1) + 1).padStart(2, '0')}`;
    setPeriodId(periodId);

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          fetchBetSums();
          return getIntervalSeconds(timeInterval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeInterval]); // Added timeInterval as dependency

  useEffect(() => {
    fetchBetSums();
  }, [betSums]);

  useEffect(() => {
    const socket = new WebSocket("wss://api.747lottery.fun"); 
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[timeInterval]) {
        setRemainingTime(data.timers[timeInterval].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [timeInterval]);

  const currentBetSums = betSums ? betSums[timeInterval] : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <ManualResultForm timer={timeInterval} setTimer={setTimeInterval} periodId={periodId} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Wingo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small">
            <Select
              value={timeInterval}
              onChange={handleIntervalChange}  // Updated to use new handler
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="30sec">30sec</MenuItem>
              <MenuItem value="1min">1min</MenuItem>
              <MenuItem value="3min">3min</MenuItem>
              <MenuItem value="5min">5min</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h6">
            Remaining Time: {remainingTime}s
          </Typography>
        </Box>
      </Box>

      {/* Period ID and Total Bet */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 4,
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Period ID: {currentBetSums ? currentBetSums.periodId : periodId}</Typography>
          <Typography>TOTAL Bet: {currentBetSums ? currentBetSums.numberBetSums.reduce((sum, bet) => sum + bet.totalBet, 0).toFixed(2) : totalBet.toFixed(2)}</Typography>
        </Box>
      </Paper>

      {/* Number Buttons */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(10)].map((_, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <BetButton 
              number={index} 
              totalBet={currentBetSums ? currentBetSums.numberBetSums[index].totalBet : 0}
              color={index % 2 === 0 ? 'error' : 'success'}
            />
          </Grid>
        ))}
      </Grid>

      {/* Size and Color Options */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard 
            title="Size: big"
            value={currentBetSums ? currentBetSums.sizeBetSums.big : 0}
            color="#1890FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard 
            title="Size: small"
            value={currentBetSums ? currentBetSums.sizeBetSums.small : 0}
            color="#FAAD14"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard 
            title="Color: green"
            value={currentBetSums ? currentBetSums.colorBetSums.green : 0}
            color="#52C41A"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard 
            title="Color: red"
            value={currentBetSums ? currentBetSums.colorBetSums.red : 0}
            color="#FF4D4F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard 
            title="Color: violet"
            value={currentBetSums ? currentBetSums.colorBetSums.violet : 0}
            color="#722ED1"
          />
        </Grid>
      </Grid>
       <ResultTable timer={timeInterval} />
    </Box>
  );
};

export default Wingo;