import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { domain, wssdomain } from "../../Components/config";
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Card,
  CardContent,
  CardActions,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const numberColorMap = {
  0: ["violet", "red"],
  1: "green",
  2: "red",
  3: "green",
  4: "red",
  5: ["violet", "green"],
  6: "red",
  7: "green",
  8: "red",
  9: "green",
};

const getColorForNumber = (number) => {
  const colorMap = {
    0: "linear-gradient(to right, #d13838, #9a47da)",
    1: "#16b15e",
    2: "#d23838",
    3: "#16b15e",
    4: "#d23838",
    5: "linear-gradient(to right, #19b25f, #9a47da)",
    6: "#d23838",
    7: "#16b15e",
    8: "#d23838",
    9: "#16b15e",
  };

  return colorMap[number];
};

const GamesContent = () => {
  const [data, setData] = useState({});
  const [betHistoryData, setBetHistoryData] = useState({});
  const [filterBetHistoryData, setFilterBetHistoryData] = useState([]);
  const [selectedTimer, setSelectedTimer] = useState("1min");
  const [manualResult, setManualResult] = useState("");
  const [colorOutcome, setColorOutcome] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setRemainingTime(data.timers[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [selectedTimer]);

  const fetchData = useCallback(async () => {
    try {
      const result = await axios.get(`${domain}/latest-bet-sums`, {
        withCredentials: true,
      });
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  }, []);

  const fetchHistory = async (selectedTimer) => {
    try {
      const betHistoryResult = await axios.get(
        `${domain}/wingoresult?timer=${selectedTimer}`,
        {
          withCredentials: true,
        }
      );
      console.log("betHistoryResult:", betHistoryResult.data.Result);
      setBetHistoryData(betHistoryResult.data.Result);
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
    // fetchHistory()
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTimerChange = (event) => {
    setSelectedTimer(event.target.value);
  };

  const handleManualResultChange = (event) => {
    const result = event.target.value;
    setManualResult(result);
    setColorOutcome(numberColorMap[result]);
  };

  const determineSize = (numberOutcome) => {
    const number = parseInt(numberOutcome);
    if (number >= 0 && number <= 4) {
      return "small";
    } else if (number >= 5 && number <= 9) {
      return "big";
    } else {
      return "";
    }
  };

  const handleSubmit = async () => {
    const postData = {
      periodId: data[selectedTimer]?.periodId,
      numberOutcome: manualResult,
      colorOutcome: numberColorMap[manualResult],
      sizeOutcome: determineSize(manualResult),
      timer: selectedTimer,
    };

    try {
      await axios.post(`${domain}/set-manual-result`, postData, {
        withCredentials: true,
      });
      alert("Manual result set successfully!");
      fetchData(); // Refresh data after submitting
    } catch (error) {
      console.error("Error setting manual result:", error);
      alert("Failed to set manual result. Please try again.");
      setError("Failed to set manual result. Please try again.");
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
    { field: "numberOutcome", headerName: "Number Outcome", width: 150 },
    { field: "sizeOutcome", headerName: "Size Outcome", width: 150 },
    { field: "colorOutcome", headerName: "Color Outcome", width: 150 },
  ];

  const renderGrid = (betSums) => {
    const numberTotalBet = Object.values(betSums.numberBetSums).reduce(
      (sum, item) => sum + item.totalBet,
      0
    );
    const sizeTotalBet = Object.values(betSums.sizeBetSums).reduce(
      (sum, value) => sum + value,
      0
    );
    const colorTotalBet = Object.values(betSums.colorBetSums).reduce(
      (sum, value) => sum + value,
      0
    );

    const totalBet = numberTotalBet + sizeTotalBet + colorTotalBet;

    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              Period ID:{" "}
              <span style={{ color: "red" }}>{betSums.periodId}</span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                marginTop: "15px",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "18px", sm: "22px" },
                  color: "black",
                }}
              >
                TOTAL Bet:
              </Typography>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  fontWeight: "bold",
                  marginLeft: "10px",
                  color: "#f57c00",
                }}
              >
                {totalBet.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          {betSums.numberBetSums.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Paper style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="body1">Number: {item.number}</Typography>
                <div
                  style={{
                    background: getColorForNumber(item.number),
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "10px",
                  }}
                >
                  <Typography variant="body2">
                    Total Bet: {item.totalBet}
                  </Typography>
                </div>
              </Paper>
            </Grid>
          ))}
          {Object.entries(betSums.sizeBetSums).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
              <Paper style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="body1">Size: {key}</Typography>
                <div
                  style={{
                    backgroundColor: key === "big" ? "#5088d3" : "#dd9138",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "10px",
                  }}
                >
                  <Typography variant="body2">Total Bet: {value}</Typography>
                </div>
              </Paper>
            </Grid>
          ))}
          {Object.entries(betSums.colorBetSums).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
              <Paper style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="body1">Color: {key}</Typography>
                <div
                  style={{
                    backgroundColor:
                      key === "green"
                        ? "#40ad72"
                        : key === "red"
                        ? "#fd565d"
                        : key === "violet"
                        ? "#b659ff"
                        : "defaultColor",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    marginTop: "10px",
                  }}
                >
                  <Typography variant="body2">Total Bet: {value}</Typography>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <TextField
          select
          value={selectedTimer}
          onChange={handleTimerChange}
          variant="outlined"
          sx={{
            width: { xs: "150px", sm: "200px" },
            "& .MuiInputBase-root": {
              height: { xs: "40px", sm: "50px" },
              fontSize: { xs: "16px", sm: "20px" },
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& fieldset": {
                borderColor: "#4782ff",
              },
            },
          }}
          InputLabelProps={{
            sx: {
              "&.Mui-focused": {
                color: "#4782ff", // Focused label color
              },
            },
          }}
        >
          <MenuItem value="30sec">30sec</MenuItem>
          <MenuItem value="1min">1min</MenuItem>
          <MenuItem value="3min">3min</MenuItem>
          <MenuItem value="5min">5min</MenuItem>
        </TextField>
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
      </Box>
      {error ? (
        <Typography variant="body1" align="center" style={{ color: "red" }}>
          {error}
        </Typography>
      ) : (
        data[selectedTimer] && renderGrid(data[selectedTimer])
      )}
      <Box
        sx={{
          marginTop: { xs: "20px", sm: "40px" },
          textAlign: "center",
          display: "flex",
          flexDirection: {
            sm: "column",
            xs: "column",
            md: "column",
            lg: "row",
          },
        }}
      >
        <Card
          sx={{
            maxWidth: { xs: 320, sm: 400, md: 700, lg: 600 },
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3, color: "#4782ff" }}
            >
              Set Manual Result
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <TextField
                select
                label="Select Timer"
                value={selectedTimer}
                onChange={handleTimerChange}
                variant="outlined"
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                }}
              >
                <MenuItem value="30sec">30sec</MenuItem>
                <MenuItem value="1min">1min</MenuItem>
                <MenuItem value="3min">3min</MenuItem>
                <MenuItem value="5min">5min</MenuItem>
              </TextField>
              <TextField
                label="Latest Period ID"
                value={data[selectedTimer]?.periodId || ""}
                disabled
                variant="outlined"
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                }}
              />
              <TextField
                select
                label="Choose Result"
                value={manualResult}
                onChange={handleManualResultChange}
                variant="outlined"
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#4782ff", // Focused label color
                    },
                  },
                }}
              >
                {[...Array(10)].map((_, index) => (
                  <MenuItem key={index} value={`${index}`}>
                    {index}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Color Outcome"
                value={colorOutcome}
                disabled
                variant="outlined"
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                }}
              />
              <TextField
                label="Size Outcome"
                value={determineSize(manualResult)}
                disabled
                variant="outlined"
                sx={{
                  minWidth: { xs: "120px", sm: "200px" },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                }}
              />
            </Box>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                "&:hover": {
                  backgroundColor: "#0f8558",
                },
                fontWeight: "bold",
              }}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
        <Card
          sx={{
            maxWidth: { xs: 320, sm: 400, md: 600, lg: 600 },
            margin: { xs: "10px auto", lg: "0 auto" },
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
                        fontWeight: "bold",
                        borderBottom: "2px solid #e0e0e0",
                        bgcolor: "#e8e8e8",
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
                      key={row.id}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {columns.map((column, index) => (
                        <TableCell
                          key={column.field}
                          align="center"
                          sx={{ borderBottom: "1px solid #e0e0e0" }}
                        >
                          {index === 3 && Array.isArray(row[column.field])
                            ? row[column.field].map((color, idx) => (
                                <span key={idx} style={{ color }}>
                                  {color}
                                  {idx < row[column.field].length - 1
                                    ? ", "
                                    : ""}
                                </span>
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
      </Box>
    </Box>
  );
};

export default GamesContent;
