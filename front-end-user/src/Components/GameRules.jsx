import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Mobile from './Mobile';

const fakeData = [
  { days: 1, accumulated: '₹200.00', bonus: '₹5.00' },
  { days: 2, accumulated: '₹1,000.00', bonus: '₹18.00' },
  { days: 3, accumulated: '₹3,000.00', bonus: '₹100.00' },
  { days: 4, accumulated: '₹10,000.00', bonus: '₹200.00' },
  { days: 5, accumulated: '₹20,000.00', bonus: '₹400.00' },
  { days: 6, accumulated: '₹100,000.00', bonus: '₹3,000.00' },
  { days: 7, accumulated: '₹200,000.00', bonus: '₹7,000.00' },
  
];

const rules = [
  'The higher the number of consecutive login days, the more rewards you get, up to 7 consecutive days',
  'During the activity, please check once a day',
  'Players with no deposit history cannot claim the bonus',
  'Deposit requirements must be met from day one',
  'The platform reserves the right to final interpretation of this activity',
  'When you encounter problems, please contact customer service',
];

const GameRules = () => {
  return (
    <div><Mobile>
    <Container disableGutters maxWidth="xs" sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{  bgcolor: '#4782ff', padding: '8px 10px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <ChevronLeftIcon sx={{ fontSize: 30, cursor:"pointer" }} />
        <Typography variant="h6" sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px'
        }}>
          Game Rules
        </Typography>
      </Box>

      <Box sx={{p:2}}>
      <TableContainer component={Paper} sx={{ mt: 2, border: 'none' }} elevation={0}>
  <Table sx={{ border: 'none' }}>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#4782ff', border: 'none' }}>
        <TableCell align="center" sx={{ color: '#fff', border: 'none', padding: '4px 8px', }}>
          Continuous attendance
        </TableCell>
        <TableCell align="center" sx={{ color: '#fff', border: 'none', padding: '4px 8px'}}>
          Accumulated amount
        </TableCell>
        <TableCell align="center" sx={{ color: '#fff', border: 'none', padding: '4px 8px' }}>
          Attendance bonus
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {fakeData.map((row) => (
        <TableRow key={row.days} sx={{ backgroundColor: row.days % 2 === 0 ? '#fff' : '#f0f0f0', border: 'none' }}>
          <TableCell align="center" sx={{ border: 'none' }}>{row.days}</TableCell>
          <TableCell align="center" sx={{ border: 'none' }}>{row.accumulated}</TableCell>
          <TableCell align="center" sx={{ border: 'none' }}>{row.bonus}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Box sx={{ marginTop: 2, backgroundColor: '#FFF', padding: '16px', borderRadius: '8px' }}>
        <Typography variant="h6" align="center" sx={{ backgroundColor: '#4782ff', padding: '8px', borderRadius: '4px', color: 'white' }}>
          Rules
        </Typography>
        <Box component="ul" sx={{ padding: '0 16px', marginTop: '8px', listStyle: 'none' }}>
          {rules.map((rule, index) => (
            <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '8px', height: '8px', backgroundColor: '#FFD700', borderRadius: '50%', marginRight: '8px' }} />
              <Typography variant="body2">{rule}</Typography>
            </li>
          ))}
        </Box>
      </Box>
      </Box>

    
    </Container>
    </Mobile></div>
  );
};

export default GameRules;