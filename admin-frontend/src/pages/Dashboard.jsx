import {
  UserPlus,
  DollarSign,
  ArrowDownToLine,
  Building2,
  Users,
  MessageCircle,
  CheckCircle,
  FileText,
  Monitor,
  HelpCircle,
} from "lucide-react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  ShoppingBag as OrderIcon,
  Visibility as VisitsIcon,
  AccountBalance as BalanceIcon,
  AttachMoney as SaleIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, color, chartData }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      height: "100%",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${color}15`,
        }}
      >
        <Icon sx={{ color: color }} />
      </Box>
    </Box>
    {chartData && (
      <Box sx={{ height: 100, mt: 2 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { display: false },
              y: { display: false },
            },
            elements: {
              line: {
                tension: 0.4,
                borderWidth: 2,
                borderColor: color,
                fill: "start",
                backgroundColor: `${color}15`,
              },
              point: { radius: 0 },
            },
          }}
        />
      </Box>
    )}
  </Paper>
);

const SectionTitle = ({ title, action }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Typography variant="h6">{title}</Typography>
    {action}
  </Box>
);

const ExportButton = () => (
  <IconButton
    sx={{
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      px: 2,
      py: 1,
      "&:hover": { bgcolor: "background.paper" },
    }}
  >
    <ExportIcon sx={{ mr: 1 }} />
    <Typography variant="button">Export</Typography>
  </IconButton>
);

const StatsCard = ({
  icon: Icon,
  title,
  value,
  variant = "blue",
  showChart = false,
}) => {
  const gradientColors = {
    purple: {
      bg: "linear-gradient(135deg, #8B5CF6 0%, #8B5CF6 100%)",
      iconBg: "rgba(255, 255, 255, 0.1)",
    },
    blue: {
      bg: "linear-gradient(135deg, #8B5CF6 0%, #8B5CF6 100%)",
      iconBg: "rgba(255, 255, 255, 0.1)",
    },
  };

  // Sample mini chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [30, 40, 25, 50, 35, 45],
        borderColor: "#ffffff",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        background: gradientColors[variant].bg,
        color: "white",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <Box
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: gradientColors[variant].iconBg,
            mb: { xs: 1, sm: 2 },
          }}
        >
          <Icon size={20} />
        </Box>

        {/* Content */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Mini Chart */}
      {showChart && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "50%",
            height: "50%",
            opacity: 0.2,
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </Box>
      )}
    </Paper>
  );
};

const Dashboard = () => {
  const [successRecharge, setSuccessRecharge] = useState(0);
  const [todayUsers, setTodayUsers] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [todayRecharge, setTodayRecharge] = useState({
    amount: 0,
    count: 0,
  });
  const [todayWithdrawal, setTodayWithdrawal] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingRecharge, setPendingRecharge] = useState({
    amount: 0,
    count: 0,
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState(0);

  // Add new state for historical data
  const [userHistory, setUserHistory] = useState({
    labels: [],
    totalUsers: [],
    dailyJoins: [],
  });

  // Add function to fetch today's registrations
  const fetchTodayRegistrations = async () => {
    try {
      const response = await apiCall("/todays-registrations");
      if (response.success) {
        setTodayUsers(response.countOfDailyUsers);
      }
    } catch (error) {
      console.error("Failed to fetch today's registrations:", error);
    }
  };

  // Add function to fetch user balance
  const fetchUserBalance = async () => {
    try {
      const response = await apiCall("/admin/normal-users-wallet-summary");
      if (response.success) {
        setUserBalance(response.totalWalletAmount);
      }
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  // Add function to fetch today's recharge data
  const fetchTodayRecharge = async () => {
    try {
      const response = await apiCall("/recharge-today");
      console.log("response", response);
      if (response.success) {
        setTodayRecharge({
          amount: response.totalRechargeAmount,
          count: response.rechargeCount,
        });
      }
    } catch (error) {
      console.error("Failed to fetch today's recharge:", error);
    }
  };

  // Add function to fetch today's withdrawal data
  const fetchTodayWithdrawal = async () => {
    try {
      const response = await apiCall("/total-withdraw-amount-last-24-hours");
      if (response.success) {
        setTodayWithdrawal(response.totalWithdrawAmount);
      }
    } catch (error) {
      console.error("Failed to fetch today's withdrawal:", error);
    }
  };

  // Add function to fetch total users
  const fetchTotalUsers = async () => {
    try {
      const response = await apiCall("/total-registrations");
      if (response.success) {
        setTotalUsers(response.count);
      }
    } catch (error) {
      console.error("Failed to fetch total users:", error);
    }
  };

  // Add function to fetch pending recharge data
  const fetchPendingRecharge = async () => {
    try {
      const response = await apiCall("/pending-recharge");
      if (response.success) {
        setPendingRecharge({
          amount: response.pendingAmount,
          count: response.count,
        });
      }
    } catch (error) {
      console.error("Failed to fetch pending recharge:", error);
    }
  };

  // Add function to fetch success recharge data
  const fetchSuccessRecharge = async () => {
    try {
      const response = await apiCall("/success-recharge");
      if (response.success) {
        setSuccessRecharge(response.successAmount);
      }
    } catch (error) {
      console.error("Failed to fetch success recharge:", error);
    }
  };

  // Add function to fetch withdrawal requests data
  const fetchWithdrawalRequests = async () => {
    try {
      const response = await apiCall("/total-withdrawl-amount");
      if (response.success) {
        setWithdrawalRequests(response.completeWithdrawAmount);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawal requests:", error);
    }
  };

  // Add function to prepare chart data
  const prepareUserChartData = () => ({
    labels: userHistory.labels,
    datasets: [
      {
        label: "Total Users",
        data: userHistory.totalUsers,
        borderColor: "#8B5CF6",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(33, 150, 243, 0.2)");
          gradient.addColorStop(1, "rgba(33, 150, 243, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: "Daily New Users",
        data: userHistory.dailyJoins,
        borderColor: "#FF4081",
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  });

  // Update chart options
  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: true,
        text: "User Growth Overview",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Last 7 Days",
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
        },
        title: {
          display: true,
          text: "Number of Users",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // Function to get the last 7 days dates
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }
    return dates;
  };

  // Update useEffect to include mock historical data
  useEffect(() => {
    fetchTodayRegistrations();
    fetchUserBalance();
    fetchTodayRecharge();
    fetchTodayWithdrawal();
    fetchTotalUsers();
    fetchPendingRecharge();
    fetchSuccessRecharge();
    fetchWithdrawalRequests();

    // Set mock historical data
    // In a real application, you would fetch this data from an API
    setUserHistory({
      labels: getLast7Days(),
      totalUsers: [
        totalUsers - 50,
        totalUsers - 40,
        totalUsers - 30,
        totalUsers - 20,
        totalUsers - 10,
        totalUsers - 5,
        totalUsers,
      ],
      dailyJoins: [8, 12, 15, 10, 8, 5, todayUsers],
    });
  }, [totalUsers, todayUsers]); // Add dependency on totalUsers and todayUsers

  // Sample data for the main sales chart
  const salesChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
        borderColor: "#8B5CF6",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(33, 150, 243, 0.2)");
          gradient.addColorStop(1, "rgba(33, 150, 243, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: "Orders",
        data: [30, 25, 45, 30, 25, 35, 20, 30, 25, 45, 30, 25],
        borderColor: "#FF4081",
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
        },
        ticks: {
          callback: (value) => `$${value}k`,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };
  const [gameWinningType, setGameWinningType] = useState(true); // true for Most, false for Least
  const [needToDepositFirst, setNeedToDepositFirst] = useState(true); // true for Required, false for Optional

  const handleGameWinningTypeToggle = () => {
    setGameWinningType(!gameWinningType);
  };

  const handleNeedToDepositFirstToggle = () => {
    setNeedToDepositFirst(!needToDepositFirst);
  };

  // Update the pie chart data
  const buyersChartData = {
    labels: ["Today's Recharge", "Pending Recharges", "Success Recharge"],
    datasets: [
      {
        data: [
          Number(todayRecharge.amount) || 0,
          Number(pendingRecharge.amount) || 0,
          Number(successRecharge) || 0,
        ],
        backgroundColor: ["#56CA00", "#FFB400", "#8B5CF6"],
        borderWidth: 0,
        borderRadius: 5,
      },
    ],
  };

  // Update the pie chart options
  const buyersChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, index) => ({
              text: `${label}: ₹${Number(
                data.datasets[0].data[index]
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              fillStyle: data.datasets[0].backgroundColor[index],
              pointStyle: "circle",
            }));
          },
        },
      },
      title: {
        display: true,
        text: "Recharge Overview",
        font: {
          size: 16,
        },
      },
    },
    cutout: "65%",
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: "100vw",
        overflow: "hidden",
        mt: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Stats Cards */}
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={UserPlus}
            title="Today User Join"
            value={todayUsers.toString()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={DollarSign}
            title="Today's Recharge"
            value={`₹${Number(todayRecharge.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={ArrowDownToLine}
            title="Today's Withdrawal"
            value={`₹${Number(todayWithdrawal).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={Building2}
            title="User Balance"
            value={`₹${Number(userBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={Users}
            title="Total User"
            value={totalUsers.toString()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={MessageCircle}
            title="Pending Recharges"
            value={`₹${Number(pendingRecharge.amount).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={CheckCircle}
            title="Success Recharge"
            value={`₹${
              isNaN(Number(successRecharge))
                ? "0.00"
                : Number(successRecharge).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
            }`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={FileText}
            title="Withdrawal Requests"
            value={`₹${Number(withdrawalRequests).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* User Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: { xs: 1, sm: 2, md: 3 },
              height: "100%",
              minHeight: { xs: 300, sm: 400 },
            }}
          >
            <SectionTitle
              title="User Growth Overview"
              action={
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <ExportButton />
                </Box>
              }
            />
            <Box
              sx={{
                height: { xs: 250, sm: 300, md: 400 },
                width: "100%",
              }}
            >
              <Line data={prepareUserChartData()} options={userChartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Recharge Overview Chart */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: { xs: 1, sm: 2, md: 3 },
              height: "100%",
              minHeight: { xs: 300, sm: 400 },
            }}
          >
            <SectionTitle title="Recharge Overview" />
            <Box
              sx={{
                height: { xs: 250, sm: 300, md: 400 },
                width: "100%",
              }}
            >
              <Pie data={buyersChartData} options={buyersChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
