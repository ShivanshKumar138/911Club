import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CircularProgress,
  Alert,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  RefreshCw,
  TrendingUp,
  Percent,
  Users,
  Hash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddIcon from "@mui/icons-material/Add";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { styled } from "@mui/system";
import { domain } from "../../Components/config";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#4782ff",
      light: "#4c8c53",
      dark: "#003d00",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#f0f7f1",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

const timerOptions = ["30sec", "1min", "3min", "5min", "10min"];
const timerOptionsK3 = ["1min", "3min", "5min", "10min"];

const timeFrameOptions = [
  "today",
  "yesterday",
  "this_week",
  "this_month",
  "this_quarter",
  "all",
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  transition: "all 0.3s",
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: theme.spacing(1),
}));

const CardValue = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "white",
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const SummaryStats = ({ summary }) => {
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ overflowX: "auto", mb: 4 }}>
      <Grid
        container
        spacing={3}
        sx={{
          flexWrap: isXsScreen ? "wrap" : "nowrap",
          minWidth: isXsScreen ? "auto" : "min-content",
        }}
      >
        {Object.entries(summary).map(([key, value]) => (
          <Grid
            item
            key={key}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ minWidth: isXsScreen ? "auto" : "200px" }}
          >
            <StyledPaper>
              <IconWrapper>
                {key === "totalTaxAmount" && <AddIcon size={24} />}
                {key === "totalWinAmount" && <CloseFullscreenIcon size={24} />}
                {key === "profitMargin" && <Percent size={24} />}
                {key === "totalProfitLoss" && <TrendingUp size={24} />}
                {key === "totalBetAmount" && <CurrencyRupeeIcon size={24} />}
                {key === "totalUsers" && <Users size={24} />}
                {key === "totalBets" && <Hash size={24} />}
              </IconWrapper>
              <CardTitle>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </CardTitle>
              <CardValue>
                {typeof value === "number" ? value.toFixed(2) : value}
              </CardValue>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ProfitAndLossCharts = ({ history }) => {
  const isSmScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const chartData = history
    .map((item) => ({
      periodId: item.periodId,
      profitLoss: item.profitLoss,
      totalBetAmount: item.totalBetAmount,
      totalWinAmount: item.totalWinAmount,
    }))
    .reverse();

  return (
    <Box mb={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "primary.main", mb: 3 }}
          >
            Bet Amount vs Win Amount
          </Typography>
          <Box height={isSmScreen ? 300 : 400} mb={6}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalBetAmount"
                  fill="#3498db"
                  name="Bet Amount"
                />
                <Bar
                  dataKey="totalWinAmount"
                  fill="#e74c3c"
                  name="Win Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "primary.main", mb: 3 }}
          >
            Cumulative Profit/Loss
          </Typography>
          <Box height={isSmScreen ? 300 : 400}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="profitLoss"
                  stroke="#2ecc71"
                  fill="url(#colorGradient)"
                  name="Cumulative Profit/Loss"
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const RecentBetsTable = ({ history }) => {
  const isSmScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "primary.main", mb: 3 }}
      >
        Recent Bets (Last 10)
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}
      >
        <Table size={isSmScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell
                sx={{ color: "primary.contrastText", fontWeight: "bold" }}
              >
                Period ID
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "primary.contrastText", fontWeight: "bold" }}
              >
                Total Bet Amount
              </TableCell>
              {!isSmScreen && (
                <TableCell
                  align="right"
                  sx={{ color: "primary.contrastText", fontWeight: "bold" }}
                >
                  Total Tax Amount
                </TableCell>
              )}
              <TableCell
                align="right"
                sx={{ color: "primary.contrastText", fontWeight: "bold" }}
              >
                Total Win Amount
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "primary.contrastText", fontWeight: "bold" }}
              >
                Profit/Loss
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.slice(0, 10).map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                  transition: "background-color 0.3s",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.periodId}
                </TableCell>
                <TableCell align="right">
                  ₹{row.totalBetAmount.toFixed(2)}
                </TableCell>
                {!isSmScreen && (
                  <TableCell align="right">
                    ₹{row.totalTaxAmount.toFixed(2)}
                  </TableCell>
                )}
                <TableCell align="right">
                  ₹{row.totalWinAmount.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: row.profitLoss >= 0 ? "success.main" : "error.main",
                    fontWeight: "bold",
                  }}
                >
                  ₹{row.profitLoss.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const WingoStats = () => {
  const [timer, setTimer] = useState("30sec");
  const [timeFrame, setTimeFrame] = useState("today");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const isSmScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useEffect(() => {
    if (isExpanded) {
      fetchWingoStats();
    }
  }, [timer, timeFrame, isExpanded]);

  const fetchWingoStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${domain}/wingo-profit-loss-history`,
        { timerType: timer, timeFrame },
        {
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching Wingo stats:", error);
      setError("Failed to fetch Wingo statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    // Implementation for CSV download
    console.log("Downloading CSV...");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      elevation={3}
      sx={{ bgcolor: "background.paper", borderRadius: 4, p: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          Wingo Statistics
        </Typography>
        <IconButton onClick={toggleExpand} color="primary">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Grid container spacing={3} alignItems="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timeFrameOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadCSV}
              fullWidth
              sx={{ borderColor: "primary.main", color: "primary.main" }}
            >
              Download CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<RefreshCw />}
              onClick={fetchWingoStats}
              fullWidth
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ color: "primary.main" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {stats && (
          <>
            <SummaryStats summary={stats.summary} />
            <ProfitAndLossCharts history={stats.history} />
            <RecentBetsTable history={stats.history} />
          </>
        )}
      </Collapse>
    </Card>
  );
};

const K3Stats = () => {
  const [timeFrame, setTimeFrame] = useState("today");
  const [timer, setTimer] = useState("1min");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (isExpanded) {
      fetchK3Stats();
    }
  }, [timer, timeFrame, isExpanded]);

  const fetchK3Stats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${domain}/k3-profit-loss-history`,
        { timerType: timer, timeFrame },
        {
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching K3 stats:", error);
      setError("Failed to fetch K3 statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    // Implementation for CSV download
    console.log("Downloading K3 CSV...");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      elevation={3}
      sx={{ bgcolor: "background.paper", borderRadius: 4, p: 4, mt: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          K3 Statistics
        </Typography>
        <IconButton onClick={toggleExpand} color="primary">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Grid container spacing={3} alignItems="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timerOptionsK3.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timeFrameOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadCSV}
              fullWidth
              sx={{ borderColor: "primary.main", color: "primary.main" }}
            >
              Download CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<RefreshCw />}
              onClick={fetchK3Stats}
              fullWidth
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ color: "primary.main" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {stats && (
          <>
            <SummaryStats summary={stats.summary} />
            <ProfitAndLossCharts history={stats.history} />
            <RecentBetsTable history={stats.history} />
          </>
        )}
      </Collapse>
    </Card>
  );
};

const FiveDStats = () => {
  const [timeFrame, setTimeFrame] = useState("today");
  const [timer, setTimer] = useState("1min");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (isExpanded) {
      fetchK3Stats();
    }
  }, [timer, timeFrame, isExpanded]);

  const fetchK3Stats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${domain}/5d-profit-loss-history`,
        { timerType: timer, timeFrame },
        {
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching 5D stats:", error);
      setError("Failed to fetch 5D statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    // Implementation for CSV download
    console.log("Downloading 5D CSV...");
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card
      elevation={3}
      sx={{ bgcolor: "background.paper", borderRadius: 4, p: 4, mt: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h5"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          K3 Statistics
        </Typography>
        <IconButton onClick={toggleExpand} color="primary">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Grid container spacing={3} alignItems="center" mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timerOptionsK3.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              fullWidth
              size="small"
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              {timeFrameOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadCSV}
              fullWidth
              sx={{ borderColor: "primary.main", color: "primary.main" }}
            >
              Download CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<RefreshCw />}
              onClick={fetchK3Stats}
              fullWidth
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {loading && <CircularProgress sx={{ color: "primary.main" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {stats && (
          <>
            <SummaryStats summary={stats.summary} />
            <ProfitAndLossCharts history={stats.history} />
            <RecentBetsTable history={stats.history} />
          </>
        )}
      </Collapse>
    </Card>
  );
};

const ProfitAndLossStatsMain = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: 4, bgcolor: "background.default" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
        >
          Games Profit And Loss Stats
        </Typography>

        <WingoStats />
        <K3Stats />
        <FiveDStats />

      </Box>
    </ThemeProvider>
  );
};
export default ProfitAndLossStatsMain;
