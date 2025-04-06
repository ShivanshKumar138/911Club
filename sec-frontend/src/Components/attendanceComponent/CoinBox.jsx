import React from 'react';
import { Box, Grid, Typography, styled } from '@mui/material';
import coinimg from '../../assets/coin.png';

const StyledBox = styled(Box)(({ theme, disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  gap: theme.spacing(1),
  '&:hover': {
    transform: disabled ? 'none' : 'scale(1.02)',
    boxShadow: disabled ? 'none' : theme.shadows[3]
  }
}));

const CoinImage = styled('img')({
  width: 50,
  height: 50,
  objectFit: 'contain'
});

function CoinBox({ coinboxAmount, coinboxDay, onClick, disabled }) {
  return (
    <StyledBox disabled={disabled} onClick={disabled ? null : onClick}>
      <Typography variant="h6" color="text.primary">
        {coinboxAmount}
      </Typography>
      <Box>
        <CoinImage src={coinimg} alt="coin" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {coinboxDay}
      </Typography>
    </StyledBox>
  );
}

// Example of how to use CoinBox in a grid layout
export const CoinBoxGrid = ({ coinBoxes }) => {
  return (
    <Grid container spacing={3} sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      {coinBoxes.map((box, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CoinBox {...box} />
        </Grid>
      ))}
    </Grid>
  );
}

export default CoinBox;