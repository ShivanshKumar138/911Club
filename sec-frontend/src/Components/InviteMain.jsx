import React, { useState, useEffect, useRef } from 'react';
import Mobile from './Mobile';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { domain } from './config';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const InviteMain = ({ children }) => {
  const [invitationLink, setInvitationLink] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState([
    {
      id: 1,
      backgroundImage: 'https://www.66lottery9.com/static/invitationBonus/poster.png',
      title: 'Full Odds Bonus Rate',
      subtitle: 'Permanent commission upto 85%'
    },
    {
      id: 2,
      backgroundImage: 'https://www.66lottery9.com/static/invitationBonus/poster.png',
      title: 'Welcome to  Games',
      subtitle: 'Up to 10 billion Commission'
    },
    {
      id: 3,
      backgroundImage: 'https://www.66lottery9.com/static/invitationBonus/poster.png',
      title: 'Best Lottery Platform',
      subtitle: 'Financial security guaranteed'
    }
  ]);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVh);
    setVh();

    return () => window.removeEventListener('resize', setVh);
  }, []);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  // Add a function to get the current base URL
  const getCurrentBaseUrl = () => {
    return window.location.origin; // Returns the protocol + hostname + port
  };

    // Function to extract invite code from a full referral link
    const extractInviteCode = (fullLink) => {
      if (!fullLink) return '';
      // Extract the invite code from the URL
      const match = fullLink.match(/invitecode=([^&]+)/);
      return match ? match[1] : '';
    };
  
    const getDynamicReferralLink = () => {
      if (!user || !user.referralLink) return '';
      
      const inviteCode = extractInviteCode(user.referralLink);
      if (!inviteCode) return user.referralLink; // Fallback to original if extraction fails
      
      return `${getCurrentBaseUrl()}/register?invitecode=${inviteCode}`;
    };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        if (response.data.user && response.data.user.referralLink) {
          setInvitationLink(response.data.user.referralLink);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleCopyLink = async () => {
    try {
      const dynamicLink = getDynamicReferralLink();
      await navigator.clipboard.writeText(dynamicLink);
      handleOpenSnackbar();
    } catch (err) {
      console.error('Failed to copy invitation link: ', err);
    }
  };
 // Update QR code value to use dynamic link as well
 const getQRCodeValue = () => {
  if (user && user.referralLink) {
    return getDynamicReferralLink();
  }
  return `${getCurrentBaseUrl()}/ref/${banners[currentBannerIndex].id}`;
};
  const handleDownload = () => {
    const div = document.getElementById(`banner-${currentBannerIndex}`);

    html2canvas(div).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, 'invitation.png');
      });
    });
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : banners.length - 1
    );
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex < banners.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Updated BannerCarousel component for better responsiveness
  const BannerCarousel = () => {
    return (
      <div className="carousel-container" style={{ 
        width: '100%', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Navigation arrows */}
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderRadius: '0 50% 50% 0',
          p: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={goToPreviousBanner}>
          <KeyboardArrowLeftIcon sx={{ color: '#333' }} />
        </Box>
        
        <Box sx={{ 
          position: 'absolute', 
          right: 0, 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderRadius: '50% 0 0 50%',
          p: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={goToNextBanner}>
          <KeyboardArrowRightIcon sx={{ color: '#333' }} />
        </Box>
        
        {/* Updated banner with better responsiveness */}
        <Box 
          id={`banner-${currentBannerIndex}`}
          sx={{
            width: '80%',
            margin: '0 auto',
            backgroundImage: `url(${banners[currentBannerIndex].backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '16px',
            height: {
              xs: '500px', // Fixed height for mobile
              sm: '600px'  // Slightly taller for larger screens
            },
            maxHeight: '62vh',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Top section */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              <Typography variant="h6" align="center" sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 1,
                mt: 1,
                fontSize: {
                  xs: '1rem', // Smaller font on mobile
                  sm: '1.25rem' // Regular h6 on larger screens
                }
              }}>
                Welcome to <br /> 747 Lottery <br /> Games
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 1,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Box sx={{ 
                  bgcolor: '#FFD166', 
                  color: '#333', 
                  p: 0.5,
                  px: 1, 
                  borderRadius: 1,
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}>
                  Fair and justice
                </Box>
                <Box sx={{ 
                  bgcolor: '#FFD166', 
                  color: '#333', 
                  p: 0.5,
                  px: 1, 
                  borderRadius: 1,
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}>
                  Open and transparent
                </Box>
              </Box>
              
              <Typography variant="h5" align="center" sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: {
                  xs: '1.2rem',  // Smaller on mobile
                  sm: '1.5rem'   // Regular h5 on larger screens
                }
              }}>
                {banners[currentBannerIndex].title}
              </Typography>
            </Box>
            
            {/* Middle section */}
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'space-between', 
              mb: 1
            }}>
              <Box sx={{ 
                border: '1px solid white',
                borderRadius: '8px', 
                p: 1, 
                width: '48%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{ mb: 0.5 }}>
                  <img src="assets/images/downloadinvi.png" alt="Financial security" width="30" />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  Financial security
                </Typography>
              </Box>
              
              <Box sx={{ 
                border: '1px solid white',
                borderRadius: '8px', 
                p: 1, 
                width: '48%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{ mb: 0.5 }}>
                  <img src="assets/images/download (18).png" alt="Quick withdrawal" width="30" />
                </Box>
                <Typography variant="body2" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  Quick withdrawal
                </Typography>
              </Box>
            </Box>
            
            {/* Bottom section with subtitle and QR code */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              <Typography variant="body2" align="center" sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                mb: 1
              }}>
                {banners[currentBannerIndex].subtitle}
              </Typography>
              
              <Box sx={{ 
                bgcolor: 'white', 
                p: 1.5, 
                borderRadius: '8px',
                mb: 1
              }}>
<QRCode 
  value={getQRCodeValue()} 
  size={120}
  style={{ maxWidth: '100%', height: 'auto' }}
/>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    );
  };

  // Add touch/swipe gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      // Calculate swipe distance
      const swipeDistance = touchStartX - touchEndX;
      
      // If significant swipe (more than 50px)
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // Swiped left - go to next
          goToNextBanner();
        } else {
          // Swiped right - go to previous
          goToPreviousBanner();
        }
      }
      
      // Reset values
      touchStartX = 0;
      touchEndX = 0;
    };
    
    // Add event listeners to the document
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 89)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: '#F95959',
                padding: '1px 12px',
                color: 'white'
              }}
            >
              <Grid item xs={2} textAlign="left">
                <IconButton color="inherit" onClick={() => navigate(-1)}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={8} textAlign="center">
                <Typography variant="h6" style={{ fontWeight: "bold" }}>Invite</Typography>
              </Grid>
              <Grid item xs={2} textAlign="right">
                <IconButton color="inherit" onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Box sx={{ padding: '10px 0', textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: '#666' }}>
                Please swipe left - right to choose your favorite poster
              </Typography>
            </Box>

            {/* The fixed carousel component */}
            <BannerCarousel />


            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              mb: 1
            }}>
              {banners.map((_, index) => (
                <Box 
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    mx: 0.5,
                    backgroundColor: currentBannerIndex === index ? '#F95959' : '#ccc',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', my: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Invite friends<span style={{ color: '#F95959' }}> Income 10 billion</span> Commission
              </Typography>
            </Box>

            <Grid container spacing={1} sx={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '90%',
              marginTop: '0px',
              marginBottom: "20px"
            }}>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleDownload} 
                  style={{ 
                    backgroundColor: '#F95959', 
                    color: "white", 
                    borderRadius: "20px",
                    padding: '10px'
                  }}
                >
                  SAVE IMAGE
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleCopyLink} 
                  style={{ 
                    color: '#F95959', 
                    borderColor: "#F95959", 
                    borderRadius: "20px",
                    padding: '12px'
                  }}
                >
                  Copy invitation link
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={1000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <MuiAlert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                }}
              >
                Invitation link copied successfully!
              </MuiAlert>
            </Snackbar>
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default InviteMain;