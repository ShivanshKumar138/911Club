import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const VerticalPicker = ({ initialValue, onChange, options }) => {
  const [selectedIndex, setSelectedIndex] = useState(options.indexOf(initialValue));
  const containerRef = useRef(null);
  const itemHeight = 40; // Height of each item in pixels

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const newIndex = Math.round(scrollTop / itemHeight);
        if (newIndex >= 1 && newIndex < options.length && newIndex !== selectedIndex) {
          setSelectedIndex(newIndex);
          onChange(options[newIndex]);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [selectedIndex, onChange, options]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, [selectedIndex]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: 120,
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <Box sx={{ height: itemHeight * 2 }} />
      {options.map((option, index) => (
        <Box
          key={option}
          sx={{
            height: itemHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'center',
            opacity: index === selectedIndex ? 1 : 0.5,
            transition: 'opacity 0.2s',
            visibility: index === 0 ? 'hidden' : 'visible', // Hide the 0 option
          }}
        >
          <Typography variant="body1">{option}</Typography>
        </Box>
      ))}
      <Box sx={{ height: itemHeight * 2 }} />
    </Box>
  );
};

export default VerticalPicker;