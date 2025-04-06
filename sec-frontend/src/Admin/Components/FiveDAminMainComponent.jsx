import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Grid,
  Divider,
} from "@mui/material";
import { display, styled } from "@mui/system";
import { domain, wssdomain } from "../../Components/config";
import SetResultForm from "./FiveDSetResultForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4782ff",
    },
    secondary: {
      main: "#ff6b6b",
    },
    background: {
      default: "#f0f4f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const StyledBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
  },
  overflow: "hidden",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 120,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.dark,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  "& .MuiTableHead-root": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiTableHead-root .MuiTableCell-head": {
    color: theme.palette.primary.contrastText,
    fontWeight: "bold",
  },
  "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FiveDAminMainComponent = () => {
  const [timer, setTimer] = useState("1min");
  const [periodId, setPeriodId] = useState("");
  const [betData, setBetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [betHistoryData, setBetHistoryData] = useState({});
  const [filterBetHistoryData, setFilterBetHistoryData] = useState([]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[timer]) {
        setRemainingTime(data.timers[timer].remainingTime);
        // console.log(data.timers[timer].remainingTime)
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [timer]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${domain}/latest-5d-bet-sums?timer=${timer}`,
        {
          withCredentials: true,
        }
      );
      setTotalBetAmount(response.data.totalBetAmount);
      setPeriodId(response.data.periodId);
      setBetData(response.data.totalBetSums);
      setError(null);
    } catch (error) {
      console.error("Error fetching bet data:", error);
      setError("Failed to fetch bet data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [timer]);

  const fetchHistory = async (timer) => {
    try {
      const betHistoryResult = await axios.get(
        `${domain}/5dgameresult?selectedTimer=${timer}`,
        {
          withCredentials: true,
        }
      );
      console.log("betHistoryResult:", betHistoryResult.data.results);
      setBetHistoryData(betHistoryResult.data.results);
      // console.log(betHistoryResult.data.results)
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchHistory(timer);
  }, [timer]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (Array.isArray(betHistoryData)) {
      setFilterBetHistoryData(betHistoryData.slice(0, 10));
      console.log(betHistoryData.slice(0, 10));
    } else {
      setFilterBetHistoryData([]); // or set it to an empty array instead of an object
    }
  }, [betHistoryData]);
  console.log("filterBetHistoryData:", filterBetHistoryData);

  const columns = [
    { field: "periodId", headerName: "Period ID", width: 150 },
    { field: "sectionOutcome", headerName: "Results", width: 150 },
    { field: "totalSum", headerName: "Sum", width: 150 },
  ];

  const isMediumScreen = useMediaQuery("(max-width:600px)");
  const isSmallScreen = useMediaQuery("(max-width:475px)");

  const renderSectionTable = (section) => (
    <StyledTableContainer component={Paper}>
      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>Numbers</TableCell>
            <TableCell colSpan={2}>Size</TableCell>
            <TableCell colSpan={2}>Parity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {[0, 1, 2, 3, 4].map((num) => (
              <TableCell key={num}>{num}</TableCell>
            ))}
            <TableCell>Small</TableCell>
            <TableCell>Big</TableCell>
            <TableCell>Even</TableCell>
            <TableCell>Odd</TableCell>
          </TableRow>
          <TableRow>
            {[0, 1, 2, 3, 4].map((num) => (
              <TableCell key={num}>{betData[section].numbers[num]}</TableCell>
            ))}
            <TableCell>{betData[section].size.Small}</TableCell>
            <TableCell>{betData[section].size.Big}</TableCell>
            <TableCell>{betData[section].parity.Even}</TableCell>
            <TableCell>{betData[section].parity.Odd}</TableCell>
          </TableRow>
          <TableRow>
            {[5, 6, 7, 8, 9].map((num) => (
              <TableCell key={num}>{num}</TableCell>
            ))}
            <TableCell colSpan={4}></TableCell>
          </TableRow>
          <TableRow>
            {[5, 6, 7, 8, 9].map((num) => (
              <TableCell key={num}>{betData[section].numbers[num]}</TableCell>
            ))}
            <TableCell colSpan={4}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledTableContainer>
  );

  const renderTotalSumTable = () => (
    <StyledTableContainer component={Paper}>
      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Size</TableCell>
            <TableCell colSpan={2}>Parity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Small</TableCell>
            <TableCell>Big</TableCell>
            <TableCell>Even</TableCell>
            <TableCell>Odd</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{betData.totalSum.size.Small}</TableCell>
            <TableCell>{betData.totalSum.size.Big}</TableCell>
            <TableCell>{betData.totalSum.parity.Even}</TableCell>
            <TableCell>{betData.totalSum.parity.Odd}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledTableContainer>
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledBox>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            color="primary"
            fontWeight="bold"
          >
            5D Game Dashboard
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", mt: isMobile ? 2 : 0 }}
          >
            <Typography variant="body1" sx={{ mr: 6 }}>
              Current Period ID:{" "}
              <Box component="span" fontWeight="bold" color="secondary">
                {periodId}
              </Box>
            </Typography>
            <StyledSelect
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              sx={{ width: isMobile ? "100%" : "auto" }}
            >
              <MenuItem value="1min">1 min</MenuItem>
              <MenuItem value="3min">3 min</MenuItem>
              <MenuItem value="5min">5 min</MenuItem>
              <MenuItem value="10min">10 min</MenuItem>
            </StyledSelect>
          </Box>
        </Box>

        <SetResultForm
          fetchData={fetchData}
          timer={timer}
          periodId={periodId}
          remainingTime={remainingTime}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="5D bet tabs"
          >
            <Tab label="Monitor Bet Details" />
            <Tab label="View Previous Bet Histories" />
          </Tabs>
        </Box>

        {tabValue === 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 3,
                backgroundColor: "rgba(15, 101, 24, 0.1)",
                borderRadius: theme.shape.borderRadius,
                padding: theme.spacing(2),
              }}
            >
              <Typography variant="body1">
                Total Bet Amount:{" "}
                <Box component="span" fontWeight="bold" color="secondary">
                  {totalBetAmount}
                </Box>
              </Typography>
            </Box>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress color="primary" />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              betData && (
                <Box sx={{ overflowX: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    {["A", "B", "C", "D", "E"].map((section) => (
                      <Box key={section}>
                        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                          Section {section}
                        </Typography>
                        {renderSectionTable(section)}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      Total Sum
                    </Typography>
                    {renderTotalSumTable()}
                  </Box>
                </Box>
              )
            )}
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: "center", overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#ccc" }}>
                  <TableCell sx={{ textAlign: "center" }}>Period ID</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Section Outcome
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Total Sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterBetHistoryData.map((row) => (
                  <>
                    <TableRow key={row._id}>
                      <TableCell
                        sx={{ textAlign: "center", borderBottom: "none" }}
                      >
                        {row.periodId}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          textAlign: "center",
                          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                          overflow: "hidden",
                          marginTop: "2.5px",
                        }}
                      >
                        {Object.values(row.sectionOutcome).map(
                          (outcome, index) => (
                            <div
                              key={index}
                              style={{
                                border: "1px solid black",
                                borderRadius: "50%",
                                aspectRatio: "1/1",
                                p: 1,
                                width: "20px",
                                textAlign: "center",
                              }}
                            >
                              {outcome.number}
                            </div>
                          )
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <div
                          style={{
                            borderRadius: "50%",
                            aspectRatio: "1/1",
                            color: "white",
                            width: "25px",
                            background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                            textAlign: "center",
                            verticalAlign: "center",
                            margin: "0px auto",
                            lineHeight: "24px",
                            borderBottom: "none",
                          }}
                        >
                          {row.totalSum.value}
                        </div>
                      </TableCell>
                    </TableRow>
                    <Divider sx={{ zIndex: "100" }} />
                  </>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </StyledBox>
    </ThemeProvider>
  );
};

export default FiveDAminMainComponent;
