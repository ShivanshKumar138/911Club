import React from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  ChevronRight,
  CloudUpload,
  CameraAlt,
  Videocam
} from '@mui/icons-material';

const DepositIssueForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        bgcolor: 'background.paper', 
        minHeight: '100vh', 
        p: isMobile ? 1 : 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}
        >
          Your deposit has not yet been credited to your account?
        </Typography>
        
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            fontSize: isMobile ? '0.575rem' : '0.8rem'
          }}
        >
          Please fill in the information in detail. You need to provide pictures, bank PDF statements and video files.
        </Alert>

        <Box 
          component="form" 
          sx={{ 
            '& .MuiTextField-root': { 
              mb: 2,
              width: '100%'
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <TextField
              fullWidth
              label="Please choose the order number"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
           
          </Box>

          {['UTR Number', "Recipient's Bank Account", 'PDF Password'].map((label) => (
            <TextField
              key={label}
              fullWidth
              label={label}
              placeholder={`Please enter ${label}`}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ mb: 2 }}
            />
          ))}

          <TextField
            fullWidth
            label="Your Question"
            placeholder="Please enter your question description"
            multiline
            rows={isMobile ? 3 : 4}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ mb: 3 }}
          />

          <Box sx={{ 
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {['Photo', 'PDF file', 'Video'].map((type, index) => (
              <Box key={type} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" gutterBottom>
                  Attach {type}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    width: isMobile ? 80 : 100,
                    height: isMobile ? 80 : 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {index === 0 && <CameraAlt sx={{ mb: 1, fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                  {index === 1 && <CloudUpload sx={{ mb: 1, fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                  {index === 2 && <Videocam sx={{ mb: 1, fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                  <Typography variant="caption">
                    {index === 1 ? 'Upload' : 'photo'}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#ff6f61',
              color: 'white',
              py: isMobile ? 1.5 : 2,
              mb: 3,
              fontSize: isMobile ? '0.9rem' : '1rem',
              '&:hover': {
                bgcolor: '#ff5c4d'
              }
            }}
          >
            Submit
          </Button>

          <Box sx={{ 
            color: 'text.secondary',
            px: isMobile ? 1 : 0 
          }}>
            {[
              '1. Submit your order for a quick transaction, no need to contact customer service.',
              '2. If your deposit is not credited within 5 minutes, you can select the order and upload detailed payment proofs (multiple uploads allowed). After uploading, click submit and wait for 10 minutes, our professionals will handle it.',
              '3. If you have uploaded and waited for 10 minutes and the transaction is still not credited, you can submit again or contact customer service.'
            ].map((text, index) => (
              <Typography 
                key={index}
                variant="body2" 
                paragraph={index !== 2}
                sx={{ 
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  mb: 1.5
                }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DepositIssueForm;