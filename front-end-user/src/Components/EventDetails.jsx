import React from "react";
import {
  Typography,
  List,
  ListItem,
  Grid,
  IconButton,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  SvgIcon,
  TableRow, 
  Paper, 
  ThemeProvider, 
  createTheme, 
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "./Mobile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        paper: '#ffffff',
      },
    },
  });

  const rules = [
    "Members must reach the single deposit amount and cumulative deposit amount to be eligible to participate in the lottery",
    <>Conditions for withdrawal of wheel rewards: <Typography component="span" sx={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>1</Typography> times turnover required.</>,
    "If you receive monetary rewards, there is no need to apply, the system will automatically add them to your member ID (please contact customer service to receive physical rewards)",
    <>The lottery round starts every morning at <Typography component="span" sx={{  color: "red", fontSize: "12px", fontWeight: "bold" }}>00:00</Typography>. After making your deposit, you need to wait 5 minutes before the draw wheel starts.</>
  ];
  
  const tasks = [
    { amount: 500.00, spins: 1 },
    { amount: 1000.00, spins: 1 },
    { amount: 2000.00, spins: 1 },
    { amount: 5000.00, spins: 1 },
    { amount: 10000.00, spins: 2 },
    { amount: 50000.00, spins: 2 },
    { amount: 100000.00, spins: 3 },
  ];

  const RhombusIcon = (props) => (
    <SvgIcon {...props}>
      <path d="M12 2L22 12L12 22L2 12L12 2Z" />
    </SvgIcon>
  );

const EventDetails = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#4782ff", py: 1 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "white", ml: -2 }} // White color for the icon
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "white", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Activity Details
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{mt: 1, padding: 1}}>
      <TableContainer component={Paper} sx={{ maxWidth: 400, margin: 'auto', backgroundColor: '#4782ff', overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': {  color: '#fff', fontSize: '1rem', textAlign: 'center', textWrap: "nowrap" } }}>
              <TableCell sx={{padding: 1}}>Task</TableCell>
              <TableCell sx={{padding: 1}}>Number of spins</TableCell>
              <TableCell sx={{padding: 1}}>spin time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: '#ffffff' },
                  '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#ff4d4d', fontWeight: 'bold',fontSize: '12px' }}>₹{task.amount.toFixed(2)}</div>
                  <div style={{ color: '#999', fontSize: '10px' }}>Cumulative depositsBalance</div>
                </TableCell>
                <TableCell sx={{ color: '#000', textAlign: 'center',fontSize: '12px' }}>+{task.spins}</TableCell>
                <TableCell sx={{ color: '#999', textAlign: 'center', textWrap: "nowrap",fontSize: '12px' }}>00:00-23:59</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "5px", margin: 1 }}>
      <Box
        sx={{
          bgcolor: "#4782ff",
          py: 0.5,
          maxWidth: 200,
          margin: "0 auto",
          px: 1,
          textAlign: "center",
          borderBottomLeftRadius: "50px",
          borderBottomRightRadius: "50px",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "white" }}
        >
        Rules
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
      {rules.map((rule, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "start",
            mt: index === 0 ? 0 : 0,
            paddingX: "5%",

          }}
        >
          <RhombusIcon
            sx={{ color: "#4782ff", mr: 1, mt: "4px", fontSize: 10 }}
          />
          <Typography
            variant="body2"
            paragraph
            sx={{ textAlign: "justify", fontSize: "12px"}}
          >
            {rule}
          </Typography>
        </Box>
      ))}
    </Box>
      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2, mb: 1, textAlign: "left", mx: 2, }}>
      {/* Example text */}
      <Typography variant="body1" sx={{ mb: 0, fontSize: "12px" }}>
        For example:
      </Typography>

      {/* Description text with highlighted spans */}
      <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: "12px" }}>
        If a member's single deposit exceeds{" "}
        <Typography component="span" sx={{ fontWeight: "bold", color: "red", fontSize: "12px" }}>
          ₹100,000.00
        </Typography>{" "}
        on the same day, he or she will receive{" "}
        <Typography component="span" sx={{ fontWeight: "bold", color: "red", fontSize: "12px" }}>
          3
        </Typography>{" "}
        lucky draw opportunities. The lottery draws are valid for the same day and
        cannot be accumulated to the next day!
      </Typography>
    </Box>
    </Paper>
        </Box>
        <br/>
        <br/>
        <br/>
      </Mobile>{" "}
    </div>
  );
};

export default EventDetails;