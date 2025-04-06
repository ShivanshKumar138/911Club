import React, { useState, useEffect } from "react";
import { Drawer, Button, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./CalenderDrawerStyles.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const CalendarDrawer = ({ isOpen, onClose, onRangeSelect }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (isOpen) {
      setStartDate(today);
      setEndDate(today);
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
    }
  }, [isOpen]);

  const handleDateClick = (date) => {
    const dateStr = `${currentYear}-${currentMonth + 1}-${date}`;
    const selectedDate = new Date(dateStr);
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      } else {
        setStartDate(selectedDate);
        setEndDate(null);
      }
    }
  };

  const generateCalendarDays = () => {
    const date = new Date(currentYear, currentMonth, 1);
    const days = [];
    while (date.getMonth() === currentMonth) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isDateInRange = (date) => {
    const dateStr = `${currentYear}-${currentMonth + 1}-${date}`;
    const selectedDate = new Date(dateStr);
    return startDate && endDate && selectedDate >= startDate && selectedDate <= endDate;
  };

  const formatDateRange = () => {
    const formattedStart = startDate ? startDate.toLocaleDateString() : "";
    const formattedEnd = endDate ? endDate.toLocaleDateString() : "";
    if (startDate && endDate) {
      return `${formattedStart} - ${formattedEnd}`;
    } else if (startDate) {
      return formattedStart;
    }
    return "";
  };

  const handleApply = () => {
    onRangeSelect({ start: startDate, end: endDate });
    onClose();
  };

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose}
    sx= {{
      "& .MuiDrawer-paper": {
         width: "100%",
         height: "auto",
         margin: "0 auto",
         maxWidth: isSmallScreen ? "600px" : "396px",
         backgroundColor: "white",
         color: "black",
         borderTopLeftRadius: "16px",
         borderTopRightRadius: "16px",
       },
   }}
    >
      <Box className="drawer">
        <Box className="drawer-header">
          <Typography >Calendar</Typography>
          <span className="close-button" onClick={onClose}>
            
          </span>
        </Box>

        <Box className="month-year-selector">
          <IconButton onClick={() => handleMonthChange("prev")}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography >
            {months[currentMonth]} {currentYear}
          </Typography>
          <IconButton onClick={() => handleMonthChange("next")}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Box className="day-labels">
          <Typography>Sun</Typography>
          <Typography>Mon</Typography>
          <Typography>Tue</Typography>
          <Typography>Wed</Typography>
          <Typography>Thu</Typography>
          <Typography>Fri</Typography>
          <Typography>Sat</Typography>
        </Box>

        <Box className="date-grid">
          {generateCalendarDays().map((date) => (
            <Box
              key={date}
              className={`date ${
                startDate &&
                startDate.toLocaleDateString() ===
                  new Date(`${currentYear}-${currentMonth + 1}-${date}`).toLocaleDateString()
                  ? "selected-start"
                  : ""
              } ${
                endDate &&
                endDate.toLocaleDateString() ===
                  new Date(`${currentYear}-${currentMonth + 1}-${date}`).toLocaleDateString()
                  ? "selected-end"
                  : ""
              } ${isDateInRange(date) ? "in-range" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              {date}
            </Box>
          ))}
        </Box>

        <Box className="bottom-section">
          <Box className="date-range-display">
            <Typography>{formatDateRange()}</Typography>
          </Box>

          <Button
            className="confirm-button"
            onClick={handleApply}
            disabled={!startDate}
            sx={{
              background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "400",
              padding: "6px 14px",
              borderRadius: "8px",
              "&:hover": {
                background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CalendarDrawer;