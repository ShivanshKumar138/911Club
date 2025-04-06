import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { domain, wssdomain } from "../../Components/config";
import {
  Grid,
  Typography,
  Button,
  MenuItem,
  Box,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Container,
  Paper,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Casino, Timer, Assessment } from "@mui/icons-material";

const mainColor = "#4782ff";

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  // background: `linear-gradient(145deg, #ffffff, ${mainColor}22)`,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 6px 20px ${mainColor}66`,
  },
}));

const CardHeader = styled(Box)(() => ({
  background: mainColor,
  color: "#ffffff",
  padding: "16px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
}));

const CardBody = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
}));

const CardValue = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginTop: theme.spacing(2),
  color: mainColor,
}));

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const DiceContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: mainColor,
    },
    "&:hover fieldset": {
      borderColor: mainColor,
    },
    "&.Mui-focused fieldset": {
      borderColor: mainColor,
    },
  },
  "& .MuiInputLabel-root": {
    color: mainColor,
  },
}));

const ResultContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: "8px",
  backgroundColor: `${mainColor}22`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  borderRadius: "8px",
  boxShadow: `0 4px 10px ${mainColor}66`,
  transition: "transform 0.2s ease-in-out",
  backgroundColor: mainColor,
  color: "#ffffff",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 12px ${mainColor}88`,
    backgroundColor: `${mainColor}ee`,
  },
}));

const K3GamesContent = () => {
  const [totalBets, setTotalBets] = useState({
    totalSum: 0,
    twoSameOneDifferent: 0,
    threeSame: 0,
    threeDifferentNumbers: 0,
  });
  const [selectedTimer, setSelectedTimer] = useState("1min");
  const [currentPeriodId, setCurrentPeriodId] = useState(null);
  const [dice1, setDice1] = useState("");
  const [dice2, setDice2] = useState("");
  const [dice3, setDice3] = useState("");
  const [size, setSize] = useState("");
  const [parity, setParity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [betHistoryData, setBetHistoryData] = useState({});
  const [filterBetHistoryData, setFilterBetHistoryData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.timers && data.timers && data.timers[selectedTimer]) {
        const newPeriodId = data.timers[selectedTimer].periodId;
        if (currentPeriodId !== newPeriodId) {
          setCurrentPeriodId(newPeriodId);
          // fetchData();
        }
        setRemainingTime(data.timers[selectedTimer].remainingTime);
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [selectedTimer, currentPeriodId]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${domain}/latest-k3-bet-sums`, {
        params: { timer: selectedTimer },
        withCredentials: true,
      });

      const { periodId, totals } = response.data;
      setData(response.data);
      setCurrentPeriodId(periodId);
      setTotalBets({
        totalSum: totals.totalSum,
        twoSameOneDifferent: totals.twoSameOneDifferent,
        threeSame: totals.threeSame,
        threeDifferentNumbers: totals.threeDifferentNumbers,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  }, [selectedTimer]);

  const fetchHistory = async (selectedTimer) => {
    try {
      const betHistoryResult = await axios.get(
        `${domain}/k3gameresult?selectedTimer=${selectedTimer}`,
        {
          withCredentials: true,
        }
      );
      console.log("betHistoryResult:", betHistoryResult.data.results);
      setBetHistoryData(betHistoryResult.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchHistory(selectedTimer);
  }, [selectedTimer]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleTimerChange = (event) => {
    setSelectedTimer(event.target.value);
  };

  const handleDiceChange = (event) => {
    const { name, value } = event.target;
    if (name === "dice1") setDice1(value);
    if (name === "dice2") setDice2(value);
    if (name === "dice3") setDice3(value);
  };

  const calculateSize = (dice1, dice2, dice3) => {
    const total = Number(dice1) + Number(dice2) + Number(dice3);
    return total <= 10 ? "Small" : "Big";
  };

  const calculateParity = (dice1, dice2, dice3) => {
    const total = Number(dice1) + Number(dice2) + Number(dice3);
    return total % 2 === 0 ? "Even" : "Odd";
  };

  useEffect(() => {
    if (dice1 && dice2 && dice3) {
      setSize(calculateSize(dice1, dice2, dice3));
      setParity(calculateParity(dice1, dice2, dice3));
    } else {
      setSize("");
      setParity("");
    }
  }, [dice1, dice2, dice3]);

  const handleSubmit = async () => {
    const totalSum = Number(dice1) + Number(dice2) + Number(dice3);
    const diceOutcome = [Number(dice1), Number(dice2), Number(dice3)];

    const postData = {
      timerName: selectedTimer,
      periodId: currentPeriodId,
      totalSum,
      size,
      parity,
      diceOutcome,
    };

    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`${domain}/k3/manual-result`, postData, {
        withCredentials: true,
      });
      alert("Manual result set successfully!");
      setDice1("");
      setDice2("");
      setDice3("");
      setSize("");
      setParity("");
      fetchData();
    } catch (error) {
      console.error("Error setting manual result:", error);
      setError("Failed to set manual result. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";

  useEffect(() => {
    if (Array.isArray(betHistoryData)) {
      setFilterBetHistoryData(betHistoryData.slice(0, 10));
    } else {
      setFilterBetHistoryData([]); // or set it to an empty array instead of an object
    }
  }, [betHistoryData]);
  console.log("filterBetHistoryData:", filterBetHistoryData);

  const columns = [
    { field: "periodId", headerName: "Period ID", width: 150 },
    { field: "totalSum", headerName: "Total Sum", width: 150 },
    { field: "size", headerName: "Size", width: 150 },
    { field: "parity", headerName: "Odd / Even", width: 150 },
    { field: "diceOutcome", headerName: "Dice Outcome", width: 150 },
  ];

  return (
    <PageContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <HeaderContainer>
          <Box display="flex" alignItems="center">
            <Casino style={{ color: mainColor }} fontSize="large" />
            <Typography
              variant="h4"
              component="h1"
              ml={2}
              style={{ color: mainColor }}
            >
              K3 Games Dashboard
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Timer style={{ color: mainColor }} />
            <StyledFormControl variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
              <InputLabel
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4782ff", // Label color on focus
                  },
                }}
              >
                Timer
              </InputLabel>
              <Select
                value={selectedTimer}
                onChange={handleTimerChange}
                label="Timer"
              >
                <MenuItem value="1min">1 min</MenuItem>
                <MenuItem value="3min">3 min</MenuItem>
                <MenuItem value="5min">5 min</MenuItem>
                <MenuItem value="10min">10 min</MenuItem>
              </Select>
            </StyledFormControl>
          </Box>
        </HeaderContainer>
        <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" gutterBottom style={{ color: mainColor }}>
            Current Period ID: {currentPeriodId || "Loading..."}
          </Typography>
          <Box>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#4782ff",
                borderRadius: "4px",
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  width: "16px",
                  height: "22px",
                  marginTop: "12px",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "#ffffff",
                  textAlign: "center",
                  fontWeight: "bold",
                  lineHeight: "25px",
                  margin: "2px 2px",
                }}
              >
                {minutes[0]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  width: "16px",
                  height: "22px",
                  marginTop: "8px",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "0 2px",
                }}
              >
                {minutes[1]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  width: "16px",
                  height: "22px",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "#ffffff",
                  marginTop: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "20px",
                  margin: "0 2px",
                }}
              >
                :
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  width: "16px",
                  height: "22px",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "#ffffff",
                  marginTop: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "0 2px",
                }}
              >
                {seconds[0]}
              </Box>
              <Box
                sx={{
                  display: "inline-block",
                  width: "16px",
                  height: "22px",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "#ffffff",
                  fontWeight: "bold",
                  marginTop: "8px",
                  textAlign: "center",
                  lineHeight: "25px",
                  margin: "2px 2px",
                }}
              >
                {seconds[1]}
              </Box>
            </Typography>
          </Box>
        </Grid>

        <Grid container spacing={3} mt={2}>
          {Object.entries(totalBets).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <StyledCard>
                <CardHeader>
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    {key === "totalSum"
                      ? "Total"
                      : key === "twoSameOneDifferent"
                      ? "2 Same"
                      : key === "threeSame"
                      ? "3 Same"
                      : "All Different"}
                  </Typography>
                </CardHeader>
                <CardBody>
                  <Assessment style={{ color: mainColor }} fontSize="large" />
                  <CardValue>{value}</CardValue>
                </CardBody>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        <FormContainer>
          <Typography variant="h5" gutterBottom style={{ color: mainColor }}>
            Set Manual Result
          </Typography>
          <DiceContainer>
            {[
              { name: "dice1", label: "Dice 1", value: dice1 },
              { name: "dice2", label: "Dice 2", value: dice2 },
              { name: "dice3", label: "Dice 3", value: dice3 },
            ].map((dice) => (
              <StyledFormControl key={dice.name} variant="outlined">
                <InputLabel>{dice.label}</InputLabel>
                <Select
                  value={dice.value}
                  onChange={handleDiceChange}
                  name={dice.name}
                  label={dice.label}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            ))}
          </DiceContainer>

          <ResultContainer>
            <Typography variant="h6" style={{ color: mainColor }}>
              Size: <strong>{size || "N/A"}</strong>
            </Typography>
            <Typography variant="h6" style={{ color: mainColor }}>
              Parity: <strong>{parity || "N/A"}</strong>
            </Typography>
          </ResultContainer>

          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || !dice1 || !dice2 || !dice3}
            startIcon={isLoading ? <CircularProgress size={24} /> : null}
          >
            {isLoading ? "Setting Result..." : "Set Result"}
          </StyledButton>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </FormContainer>
      </StyledPaper>
      <Card
        sx={{
          // maxWidth: { xs: 320, sm: 400 },
          width: "100%",
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent
          sx={{
            maxHeight: { xs: "auto", lg: "none" }, // Adjust maxHeight for small screens
            overflowY: { xs: "auto", lg: "visible" }, // Enable scrolling on small screens
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align="center"
                    sx={{
                      color: "#4782ff",
                      fontWeight: "bold",
                      bgcolor: "#c8d9c9",
                      textWrap: "nowrap",
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filterBetHistoryData.length > 0 ? (
                filterBetHistoryData.map((row, index) => (
                  <TableRow
                    key={row._id} // Using _id for unique key assignment
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.field}
                        align="center"
                        sx={{ borderBottom: "1px solid #e0e0e0" }}
                      >
                        {/* Render diceOutcome as images for column index 4 */}
                        {colIndex === 4 && Array.isArray(row[column.field])
                          ? row[column.field].map((outcome, idx) => (
                              <img
                                key={idx} // Unique key for each dice outcome
                                src={`../../games/assets/num${outcome}-tiranga.png`} // Correct path for dice images
                                alt={`Dice ${outcome}`}
                                width="20"
                                height="20"
                                style={{ margin: "3px" }}
                              />
                            ))
                          : row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default K3GamesContent;
