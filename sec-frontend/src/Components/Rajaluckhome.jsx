import React, { useEffect, useRef, useState , memo, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { domain } from './config';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const sections = [
  {
    title: 'Slot',
    type: 'carousel',
    items: [
      { id: 'slot-1', image: '/assets/flash/229.png', title: 'Slot 1',gameId: "229" },
      { id: 'slot-2', image: '/assets/flash/224.png', title: 'Slot 2',gameId: "224" },
      { id: 'slot-3', image: '/assets/flash/232.png', title: 'Slot 3',gameId: "232" },
      { id: 'slot-4', image: '/assets/flash/233.png', title: 'Slot 4',gameId: "233" },
      { id: 'slot-5', image: '/assets/flash/235.png', title: 'Slot 5',gameId: "235" },
      { id: 'slot-6', image: '/assets/flash/236.png', title: 'Slot 6' ,gameId: "236"},
      { id: 'slot-7', image: '/assets/flash/241.png', title: 'Slot 7',gameId: "241" },
      { id: 'slot-8', image: '/assets/flash/242.png', title: 'Slot 8', gameId: "242" },
      { id: 'slot-9', image: '/assets/flash/254.png', title: 'Slot 9',gameId: "254" },
      { id: 'slot-10', image: '/assets/flash/261.png', title: 'Slot 10',gameId: "261" },
    ],
  },
  {
    title: 'Popular',
    type: 'carousel',
    items: [
      { id: 'popular-1', image: '/assets/flash/800.png', title: 'Popular 1',gameId: 800 },
      { id: 'popular-2', image: '/assets/flash/801.png', title: 'Popular 2',gameId: 801 },
      { id: 'popular-3', image: '/assets/flash/802.png', title: 'Popular 3',gameId: 202 },
      { id: 'popular-4', image: '/assets/flash/803.png', title: 'Popular 4',gameId: 803 },
      { id: 'popular-7', image: '/assets/flash/100.png', title: 'Popular 7',gameId: 100 },
      { id: 'popular-8', image: '/assets/flash/101.png', title: 'Popular 8',gameId: 101 },
      { id: 'popular-9', image: '/assets/flash/102.png', title: 'Popular 9',gameId: 102 },
      { id: 'popular-10', image: '/assets/flash/103.png', title: 'Popular 10',gameId: 103 },
      { id: 'popular-11', image: '/assets/flash/104.png', title: 'Popular 11',gameId: 104 },
      { id: 'popular-12', image: '/assets/flash/105.png', title: 'Popular 12',gameId: 105 },
      { id: 'popular-13', image: '/assets/flash/106.png', title: 'Popular 13',gameId: 106 },
      { id: 'popular-14', image: '/assets/flash/107.png', title: 'Popular 14',gameId: 107 },
      { id: 'popular-15', image: '/assets/flash/900.png', title: 'Popular 15',gameId: 900 },
      { id: 'popular-16', image: '/assets/flash/109.png', title: 'Popular 16',gameId: 109 },
      { id: 'popular-17', image: '/assets/flash/110.png', title: 'Popular 17',gameId: 110 },
      { id: 'popular-18', image: '/assets/flash/111.png', title: 'Popular 18',gameId: 111 },
      { id: 'popular-19', image: '/assets/flash/112.png', title: 'Popular 19',gameId: 112 },
      { id: 'popular-20', image: '/assets/flash/810.png', title: 'Popular 20',gameId: 810 },

    ],
  },
  {
    title: 'Platform recommendation',
    type: 'carousel',
    items: [
      { id: 'Platform-1', image: '/assets/flash/800.png', title: 'Platform 1',gameId: 800 },
      { id: 'Platform-2', image: '/assets/flash/801.png', title: 'Platform 2',gameId: 801 },
      { id: 'Platform-3', image: '/assets/flash/802.png', title: 'Platform 3',gameId: 202 },
      { id: 'Platform-4', image: '/assets/flash/803.png', title: 'Platform 4',gameId: 803 },
      { id: 'Platform-7', image: '/assets/flash/100.png', title: 'Platform 7',gameId: 100 },
      { id: 'Platform-8', image: '/assets/flash/101.png', title: 'Platform 8',gameId: 101 },
      { id: 'Platform-9', image: '/assets/flash/102.png', title: 'Platform 9',gameId: 102 },
      { id: 'Platform-10', image: '/assets/flash/103.png', title: 'Platform 10',gameId: 103 },
      { id: 'Platform-11', image: '/assets/flash/104.png', title: 'Platform 11',gameId: 104 },
      { id: 'Platform-12', image: '/assets/flash/105.png', title: 'Platform 12',gameId: 105 },
      { id: 'Platform-13', image: '/assets/flash/106.png', title: 'Platform 13',gameId: 106 },
      { id: 'Platform-14', image: '/assets/flash/107.png', title: 'Platform 14',gameId: 107 },
      { id: 'Platform-15', image: '/assets/flash/900.png', title: 'Platform 15',gameId: 900 },
      { id: 'Platform-16', image: '/assets/flash/109.png', title: 'Platform 16',gameId: 109 },
      { id: 'Platform-17', image: '/assets/flash/110.png', title: 'Platform 17',gameId: 110 },
      { id: 'Platform-18', image: '/assets/flash/111.png', title: 'Platform 18',gameId: 111 },
      { id: 'Platform-19', image: '/assets/flash/112.png', title: 'Platform 19',gameId: 112 },
      { id: 'Platform-20', image: '/assets/flash/810.png', title: 'Platform 20',gameId: 810 },
    ],
  },
  {
    type: 'bigBox',
    title: 'Game Live',
    items: [
      {
        id: 'game-live-1',
        title: 'GameLive',
        subtitle: 'live',
        image: '/assets/video/1.png',
      },
    ],
  },
  {
    type: 'bigBox',
    title: 'Sports Live',
    items: [
      {
        id: 'sports-live-1',
        title: 'SportsLive',
        subtitle: 'sports',
        image: '/assets/video/2.png',
      },
    ],
  },
  {
    title: 'Fish',
    type: 'carousel',
    items: [
      { id: 'video-1', image: '/assets/fish/1.png', title: 'Video 1',gameId: "1" },
      { id: 'video-2', image: '/assets/fish/20.png', title: 'Video 2',gameId: "20" },
      { id: 'video-3', image: '/assets/fish/42.png', title: 'Video 3',gameId: "42" },
      { id: 'video-4', image: '/assets/fish/32.png', title: 'Video 4' ,gameId: "32"},
      { id: 'video-5', image: '/assets/fish/71.png', title: 'Video 5',gameId: "71" },
      { id: 'video-6', image: '/assets/fish/74.png', title: 'Video 6',gameId: "74" },
      { id: 'video-7', image: '/assets/fish/119.png', title: 'Video 7',gameId: "119" },
      { id: 'video-8', image: '/assets/fish/7001.png', title: 'Video 8',gameId: "7001" },
      { id: 'video-9', image: '/assets/fish/7002.png', title: 'Video 9' ,gameId: "7002"},
      { id: 'video-10', image: '/assets/fish/7003.png', title: 'Video 10',gameId: "7003" },
    ],
  },
];



const BOX_WIDTH = 90;
const BOX_GAP = 16;
const TOTAL_BOX_WIDTH = BOX_WIDTH + BOX_GAP;

const GAME_TYPE_PREFIXES = {
  'Slot': 'jili',
  'Popular': 'topbet',
  'Platform': 'topbet',
  'Video': 'jili'
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "70%",
    maxWidth: "330px",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: "#4781ff",
  color: "white",
  padding: theme.spacing(1.5),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: "#f5f5f5",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  padding: theme.spacing(1, 2),
  textTransform: "none",
}));

// Memoized SectionHeader component
const SectionHeader = memo(({ title }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography 
      variant="h6" 
      component="h2" 
      sx={{ 
        display: 'flex', 
        fontSize: '16px',
        fontWeight: 900,
        fontFamily: 'Arial, sans-serif',
        alignItems: 'center',
        color: '#000',
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: '4px',
          height: '20px',
          backgroundColor: '#4D8FFF',
          marginRight: '8px'
        }
      }}
    >
      {title}
    </Typography>
    <Button 
      variant="contained" 
      size="small"
      sx={{ 
        backgroundColor: '#4D8FFF',
        color: 'white',
        '&:hover': {
          backgroundColor: '#4D8FFF'
        },
        borderRadius: '12px',
        textTransform: 'lowercase',
        fontWeight: '500',
        fontSize: '14px',
        fontFamily: 'sans-serif'
      }}
      onClick={() => window.location.href = '/all-games'}
    >
      view all
    </Button>
  </Box>
));

SectionHeader.displayName = 'SectionHeader';

// Memoized RechargeDialog component
const RechargeDialog = memo(({ open, onClose, onConfirm, selectedGame }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>
        <Typography variant="h6" component="div" fontWeight="bold">
          Recharge Required
        </Typography>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography sx={{ marginTop: "0.5rem" }} variant="body1" gutterBottom>
          To enter{" "}
          <Box component="span" fontWeight="bold">
            {selectedGame?.game}
          </Box>
          , you need to make a deposit first.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Recharging your account will allow you to enjoy all the exciting
          features of our games!
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton onClick={onClose} color="inherit">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={onConfirm}
          variant="contained"
          style={{ backgroundColor: "#4781ff", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
});

RechargeDialog.displayName = 'RechargeDialog';

// Memoized BigBox component
const BigBox = memo(({ title, items }) => {
  const item = items[0];
  const handleClick = useCallback(() => {
    console.log(`Clicked on ${item.title}`);
  }, [item.title]);

  return (
    <Box sx={{ mb: 4 }} onClick={handleClick}>
      <SectionHeader title={title} />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#4D8FFF',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '80px',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.01)',
            transition: 'transform 0.2s'
          }
        }}
      >
        <Box sx={{ p: 3, flex: 1, justifyItems: 'flex-start' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 400, fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
            {item.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 400, fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>
            {item.subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '150px',
            height: '80px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
});

BigBox.displayName = 'BigBox';

const Carousel = ({ title, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleConfirmRecharge = useCallback(() => {
    window.location.href = "/recharge";
  }, []);

  const jili = useCallback(async (gameId) => {
    try {
      const response = await axios.post(`${domain}/jilireal-test-login/`, { GameId: gameId });
      const { ErrorCode, Data } = response.data.responseData;
      
      if (ErrorCode === 0) {
        window.location.href = Data;
      }
    } catch (error) {
      console.error('Jili game error:', error);
    }
  }, []);

  const topbet = useCallback(async (app_id) => {
    try {
      const response = await axios.post(`${domain}/topbetgaming-login/`, { app_id });
      const { code, url } = response.data;
      
      if (code === 0) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Topbet game error:', error);
    }
  }, []);

  const handleClick = useCallback(async (item) => {
    if (!hasDeposit && !isDepositCheckLoading) {
      setSelectedGame({ game: item.title });
      setOpenDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const titlePrefix = item.title.split(' ')[0];
      const gameHandler = GAME_TYPE_PREFIXES[titlePrefix];
      
      if (!gameHandler) {
        console.log(`Unhandled game type: ${titlePrefix}`);
        return;
      }

      if (gameHandler === 'jili') {
        await jili(item.gameId);
      } else if (gameHandler === 'topbet') {
        await topbet(item.gameId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasDeposit, isDepositCheckLoading, jili, topbet]);

  useEffect(() => {
    const checkDepositStatus = async () => {
      setIsDepositCheckLoading(true);
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const userResponse = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const depositResponse = await axios.get(`${domain}/need-to-deposit-first`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const hasFirstDeposit = userResponse?.data?.user?.firstDepositMade;
        const needsDeposit = depositResponse?.data?.data?.needToDepositFirst;
  
        setHasDeposit(!needsDeposit || hasFirstDeposit);
      } catch (error) {
        console.error("Error checking deposit status:", error);
        setHasDeposit(false);
      } finally {
        setIsDepositCheckLoading(false);
      }
    };
  
    checkDepositStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (isAnimating && !isDragging) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= items.length - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [items.length, isAnimating, isDragging]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setIsAnimating(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(currentIndex * TOTAL_BOX_WIDTH);
  }, [currentIndex]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const distance = (x - startX);
    const newScrollLeft = scrollLeft - distance;
    
    let newIndex = Math.round(newScrollLeft / TOTAL_BOX_WIDTH);
    newIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    
    setCurrentIndex(newIndex);
  }, [isDragging, items.length, scrollLeft, startX]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsAnimating(true);
  }, []);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setIsAnimating(false);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(currentIndex * TOTAL_BOX_WIDTH);
  }, [currentIndex]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const distance = (x - startX);
    const newScrollLeft = scrollLeft - distance;
    let newIndex = Math.round(newScrollLeft / TOTAL_BOX_WIDTH);
    newIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    setCurrentIndex(newIndex);
  }, [isDragging, items.length, scrollLeft, startX]);

  return (
    <Box sx={{ mb: 4 }}>
      <SectionHeader title={title} />
      <Box 
        ref={containerRef}
        sx={{ 
          position: 'relative',
          width: `${(TOTAL_BOX_WIDTH * 3.6) - BOX_GAP}px`,
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseEnter={() => setIsAnimating(false)}
        onMouseLeave={() => {
          if (!isDragging) setIsAnimating(true);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <Box
          sx={{
            display: 'flex',
            gap: `${BOX_GAP}px`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
            transform: `translateX(${-TOTAL_BOX_WIDTH * currentIndex}px)`,
            touchAction: 'none'
          }}
        >
          {items.map((item) => (
             <Box
             key={item.id}
             sx={{
               minWidth: `${BOX_WIDTH}px`,
               height: `${BOX_WIDTH}px`,
               backgroundColor: '#A2C4FF',
               borderRadius: '12px',
               overflow: 'hidden',
               flexShrink: 0,
               cursor: 'pointer',
               transition: 'transform 0.2s',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               '&:hover': {
                 transform: isDragging ? 'none' : 'scale(1.05)'
               }
             }}
             onClick={() => handleClick(item)}
           >
             <img
               src={item.image}
               alt={item.title}
               style={{
                 maxWidth: '100%',
                 maxHeight: '100%',
                 objectFit: 'cover',
                 userSelect: 'none',
                 pointerEvents: 'none'
               }}
             />
           </Box>
          ))}
        </Box>
      </Box>
      <RechargeDialog
    open={openDialog}
    onClose={handleCloseDialog}
    onConfirm={handleConfirmRecharge}
    selectedGame={selectedGame}
  />
    </Box>
  );
};

const CarouselSection = ({ title, items, type }) => {
  if (type === 'bigBox') {
    return <BigBox title={title} items={items} />;
  }
  return <Carousel title={title} items={items} />;
};

const GameInterface = () => {
  return (
    <Box sx={{ p: 2, pl: 1, background: 'transparent' }}>
      {sections.map((section) => (
        <CarouselSection
          key={section.title}
          title={section.title}
          items={section.items}
          type={section.type}
        />
      ))}
    </Box>
  );
};

export default GameInterface;