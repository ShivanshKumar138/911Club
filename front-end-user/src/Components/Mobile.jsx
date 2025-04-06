

// export default Mobile;
import React, { useEffect, useState } from "react";
import { Box, Container, useMediaQuery, IconButton } from "@mui/material";
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";
import telegramIcon from "../../public/headerIcon/telegramIcon.png";

const Mobile = ({ children }) => {
  const location = useLocation();

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.overflow = "hidden";  // Disable body scroll when component mounts

    const savedPosition = localStorage.getItem("chatButtonPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }

    return () => {
      document.body.style.overflow = "auto";  // Re-enable scroll on unmount
    };
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleDragStart = (e, data) => {
    // For mouse events
    if (e.type.startsWith('mouse')) {
      setTouchStart({ x: e.clientX, y: e.clientY });
    } 
    // For touch events
    else if (e.type === 'touchstart') {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
    
    setIsDragging(false);
  };

  const handleDragStop = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem("chatButtonPosition", JSON.stringify(newPosition));
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStart.x);
      const deltaY = Math.abs(touch.clientY - touchStart.y);
      
      // If movement exceeds 10 pixels, consider it a drag
      if (deltaX > 10 || deltaY > 10) {
        setIsDragging(true);
      }
    }
  };

  // Wrapper to handle click only when NOT dragging
  const handleButtonClick = (callback) => (e) => {
    // Prevent default to stop propagation
    e.preventDefault();
    
    // Check if it's a touch event or mouse event
    const isTouchEvent = e.type.startsWith('touch');
    
    // For mouse events, directly check dragging
    // For touch events, use the calculated isDragging
    if (!isDragging) {
      callback(e);
    }
    
    // Reset dragging state
    setIsDragging(false);
  };

  const handleCustomerServiceClick = () => {
    window.location.href = "/service";
  };

  const handleInstagramClick = () => {
    window.open("https://www.telegram.com", "_blank");
  };

  const showDraggable = ["/home", "/login", "/register"].includes(location.pathname);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey"
    >
      <Container
        maxWidth={isSmallScreen ? false : "xs"}
        sx={{
          height: "100vh",
          position: "relative",
          padding: 0,
          margin: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box
          bgcolor="#f2f2f1"
          textAlign="center"
          minHeight="100%"
          maxHeight="100vh"
          width="100%"
          paddingX={0}
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            wordWrap: "break-word",
          }}
        >
          {children}
        </Box>

        {/* Draggable Buttons Only on Specific Pages */}
        {showDraggable && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <Draggable
              position={position}
              onStart={handleDragStart}
              onStop={handleDragStop}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  pointerEvents: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                onTouchMove={handleTouchMove}
              >
                {/* Customer Service Button */}
                <IconButton
                  sx={{
                    bgcolor: "transparent",
                    width: 70,
                    height: 70,
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  }}
                  onClick={handleButtonClick(handleCustomerServiceClick)}
                  onTouchEnd={handleButtonClick(handleCustomerServiceClick)}
                >
                  <img
                    src="https://www.66lottery9.com/static/common/india_icon_sevice_new.png"
                    alt="Customer Service"
                    width={80}
                    height={80}
                    draggable="false"
                  />
                </IconButton>

                {/* Telegram Button */}
                {/* <IconButton
                  sx={{
                    bgcolor: "rgb(245,68,68)",
                    width: 60,
                    height: 60,
                  }}
                  onClick={handleButtonClick(handleInstagramClick)}
                  onTouchEnd={handleButtonClick(handleInstagramClick)}
                >
                  <img
                    src={telegramIcon}
                    width={60}
                    height={60}
                    alt="Telegram"
                    draggable="false"
                  />
                </IconButton> */}
              </Box>
            </Draggable>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Mobile;


