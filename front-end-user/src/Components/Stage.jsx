import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const RankingCard = () => {
  const stageBgUrl = '/assets/banners/stage.png';
  const crownUrl = '/assets/banners/cr2.png'; // Replace with actual path to crown image
  const rankUrls = [
    '/assets/banners/l1.png', // Replace with actual path to rank 1 image
    '/assets/banners/l2.png', // Replace with actual path to rank 2 image
    '/assets/banners/l3.png', // Replace with actual path to rank 3 image
  ];

  const players = [
    { rank: 'N01', name: 'Mem***FS4', income: '₹3,900,400.00', avatar: '/assets/banners/p1.png' },
    { rank: 'N02', name: 'Mem***8BW', income: '₹2,951,956.00', avatar: '/assets/banners/p2.png' },
    { rank: 'N03', name: 'Yad***jee', income: '₹1,122,100.00', avatar: '/assets/banners/p3.png' },
    { rank: '4', name: 'Mem***OA4', income: '₹894,857.60', avatar: '/assets/banners/p4.png' },
    { rank: '5', name: 'Mem***NQ7', income: '₹619,723.00', avatar: '/assets/banners/p5.png' },
  ];

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" sx={{
        fontSize: '16px',
        fontWeight: 900,
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        mb: 3,
        borderLeft: '3px solid #F95959',
        pl: 1,
        lineHeight: '1.5',
        width: 'fit-content',
        marginLeft: '-10px'
      }}>
        Today's Ranking Income
      </Box>

      <Box 
        sx={{
          position: 'relative',
          height: '120px',
          backgroundImage: `url(${stageBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          marginTop:"80px",
        }}
      >
        {/* Top 3 Players */}
        {players.slice(0, 3).map((player, index) => (
          <Box
            key={player.rank}
            sx={{
              position: 'absolute',
              top: index === 0 ? '5%' : '25%',
              left: index === 0 ? '50%' : index === 1 ? '13%' : '87%',
              transform: index === 0 ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
              zIndex: index === 0 ? 3 : index === 1 ? 1 : 2,
              textAlign: 'center',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={player.avatar}
                alt={player.name}
                sx={{
                  width: index === 0 ? 60 : 50,
                  height: index === 0 ? 60 : 50,
                  margin: '0 auto',
                  border: '4px solid white',
                }}
              />
              <Box
                component="img"
                src={crownUrl}
                alt="Crown"
                sx={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-10px',
                  width: '40px',
                  height: '40px',
                }}
              />
              <Box
                component="img"
                src={rankUrls[index]}
                alt={`Rank ${index + 1}`}
                sx={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '18px',
                }}
              />
            </Box>
            <Typography  mt={3} sx={{ fontSize: '13px', color: 'white',fontWeight: 400, fontFamily: 'bahnschrift' }}>
              {player.name}
            </Typography>
            <Typography  mt={1} color="secondary" sx={{ fontSize: '13px', color: 'white',fontWeight: 400, fontFamily: 'bahnschrift' }}>
              {player.income}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Remaining Players */}
      <Box mt={4}>
        {players.slice(3).map((player) => (
          <Box
            key={player.rank}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={1}
            mb={1}
            sx={{ backgroundColor: 'white', }}
          >
            <Box display="flex" alignItems="center">
              <Avatar src={player.avatar} alt={player.name} sx={{ width: 40, height: 40, mr: 2 }} />
              <Typography variant="subtitle1" sx={{fontSize: '13px',fontWeight: 400, fontFamily: 'bahnschrift' }}>
                {player.name}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'secondary',fontSize: '13px',fontWeight: 400, fontFamily: 'bahnschrift',backgroundColor: '#F95959',color: 'white',borderRadius: '12px',textTransform: 'lowercase',padding:"5px" }}> 
              {player.income}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RankingCard;