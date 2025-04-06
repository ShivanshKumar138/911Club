import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar } from '@mui/material';

const WinningDetails = () => {
  const allItems = [
    {
      id: 1,
      username: "Im***n",
      amount: "₹16.60",
      game: "lucky",
      avatarUrl: "/assets/banners/p6.png",
      vendorurl: "/assets/banners/s1.png"
    },
    {
      id: 2,
      username: "Me***YT",
      amount: "₹26.00",
      game: "lucky",
      avatarUrl: "/assets/banners/p7.png",
      vendorurl: "/assets/banners/s2.png"
    },
    {
      id: 3,
      username: "Me***IL",
      amount: "₹70.45",
      game: "roulette",
      avatarUrl: "/assets/banners/p9.png",
        vendorurl: "/assets/banners/s3.png"
    },
    {
      id: 4,
      username: "Me***ll",
      amount: "₹78.30",
      game: "roulette",
      avatarUrl: "/assets/banners/p10.png",
        vendorurl: "/assets/banners/s4.png"
    },
    {
      id: 5,
      username: "Me***BW",
      amount: "₹74.50",
      game: "roulette",
      avatarUrl: "https://rajaluck-casino.com/img/ico/5.png",
        vendorurl: "/assets/banners/s5.png"
    },
    {
      id: 6,
      username: "Kr***PL",
      amount: "₹95.20",
      game: "lucky",
      avatarUrl: "https://rajaluck-casino.com/img/ico/6.png",
        vendorurl: "/assets/banners/s1.png"
    },
    {
      id: 7,
      username: "An***RS",
      amount: "₹20.75",
      game: "roulette",
      avatarUrl: "/assets/banners/p6.png",
        vendorurl: "/assets/banners/s2.png"
    },
    {
      id: 8,
      username: "Sa***KM",
      amount: "₹45.60",
      game: "lucky",
      avatarUrl: "/assets/banners/p7.png",
        vendorurl: "/assets/banners/s3.png"
    },
    {
      id: 9,
      username: "Vi***JK",
      amount: "₹82.90",
      game: "roulette",
      avatarUrl: "/assets/banners/p8.png",
        vendorurl: "/assets/banners/s3.png"
    },
    {
      id: 10,
      username: "Ra***ST",
      amount: "₹50.30",
      game: "lucky",
      avatarUrl: "/assets/banners/p9.png",
        vendorurl: "/assets/banners/s4.png"
    }
  ];

  const getRandomItems = () => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5).map((item, index) => ({
      ...item,
      position: index
    }));
  };

  const [items, setItems] = useState(getRandomItems());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setItems(prevItems => {
        return prevItems.map(item => ({
          ...item,
          position: (item.position + 1) % 5
        }));
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
     <br />
      <Box sx={{ 
        position: 'relative',
        height: 380,
        overflow: 'hidden',
        margin: '0 8px'
      }}>
        {items.map((winning) => (
          <Box
            key={winning.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.5,
              px: 1,
              bgcolor: '#FFFFFF',
              borderRadius: 1,
              position: 'absolute',
              left: 0,
              right: 0,
              transition: 'all 1s ease',
              transform: `translateY(${winning.position * 76}px)`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={winning.avatarUrl}
                alt={winning.username}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="body1" sx={{ fontWeight: 400 , fontSize: '13px', fontFamily: 'bahnschrift' }}>
                {winning.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 ,  }}>
              <img
                src={winning.vendorurl}
                alt={winning.game}
                style={{ 
                  width: '80px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  backgroundColor: '#F95959'
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 600 }}>
                  Got {winning.amount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  total winnings
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WinningDetails;