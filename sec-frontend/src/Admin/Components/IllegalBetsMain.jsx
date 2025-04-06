import React, { useState, useEffect, useCallback, useMemo } from "react"
import axios from "axios"
import { domain } from "../../Components/config"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
]
const ITEMS_PER_PAGE = 15
const MAX_ILLEGAL_BETS = 10
const UPDATE_INTERVAL = 1000 // 1 second

const IllegalBetsMain = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("highToLow")
  const [searchUid, setSearchUid] = useState("")
  const [selectedGame, setSelectedGame] = useState("All")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${domain}/illegal-bets`, {
        withCredentials: true,
      })
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, UPDATE_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data]
    if (searchUid) {
      result = result.filter((item) => item.userId.includes(searchUid))
    }
    if (selectedGame !== "All") {
      result = result.filter((item) => item.games[selectedGame])
    }
    result.sort((a, b) => {
      if (sortOrder === "highToLow") {
        return b.totalIllegalCount - a.totalIllegalCount
      } else {
        return a.totalIllegalCount - b.totalIllegalCount
      }
    })
    return result
  }, [data, sortOrder, searchUid, selectedGame])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedAndFilteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedAndFilteredData, currentPage])

  const totalPages = Math.ceil(sortedAndFilteredData.length / ITEMS_PER_PAGE)

  const aggregateData = useMemo(() => {
    const gameData = data.reduce((acc, item) => {
      Object.entries(item.games).forEach(([game, stats]) => {
        if (!acc[game]) acc[game] = { totalIllegalCount: 0, users: 0 }
        acc[game].totalIllegalCount += stats.totalIllegalCount
        if (stats.totalIllegalCount > 0) {
          acc[game].users += 1
        }
      })
      return acc
    }, {})
    const totalIllegalBets = Object.values(gameData).reduce(
      (sum, game) => sum + game.totalIllegalCount,
      0
    )
    return { totalIllegalBets, gameData }
  }, [data])

  const chartData = useMemo(() => {
    return Object.entries(aggregateData.gameData)
      .map(([game, stats]) => ({
        name: game,
        illegalBets: stats.totalIllegalCount,
        users: stats.users,
      }))
      .filter((item) => item.illegalBets > 0)
  }, [aggregateData])

  const pieChartData = useMemo(() => {
    const totalIllegalBets = chartData.reduce(
      (sum, item) => sum + item.illegalBets,
      0
    )
    return chartData.map((item) => ({
      name: item.name,
      value: (item.illegalBets / totalIllegalBets) * 100,
    }))
  }, [chartData])

  const scatterPlotData = useMemo(() => {
    return Object.entries(aggregateData.gameData).map(([game, stats]) => ({
      x: stats.totalIllegalCount,
      y: stats.users,
      z: stats.totalIllegalCount / stats.users,
      name: game,
    }))
  }, [aggregateData])

  const gameOptions = useMemo(() => {
    return ["All", ...new Set(data.flatMap((item) => Object.keys(item.games)))]
  }, [data])

  const getProgressColor = (count) => {
    const percentage = (count / MAX_ILLEGAL_BETS) * 100
    if (percentage <= 30) return "#4CAF50"
    if (percentage <= 60) return "#FFC107"
    return "#F44336"
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box padding={isMobile ? 1 : 2}>
      <Typography variant="h4" gutterBottom color="#4782ff" fontWeight="bold">
        Real-time Illegal Bets Dashboard
      </Typography>

      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Illegal Bets by Game
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="illegalBets" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Illegal Bets Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(2)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Illegal Bets vs Users Scatter Plot
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis type="number" dataKey="x" name="Total Illegal Bets" />
                  <YAxis type="number" dataKey="y" name="Number of Users" />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[20, 500]}
                    name="Avg. Illegal Bets per User"
                  />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Games" data={scatterPlotData} fill="#8884d8">
                    {scatterPlotData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by User ID"
            variant="outlined"
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#4782ff !important", // Initial border color
                },
                "&:hover fieldset": {
                  borderColor: "#4782ff !important", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4782ff !important", // Border color when focused
                },
              },
              "& .MuiInputBase-input": {
                color: "black", // Text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#4782ff", // Label color on focus
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#4782ff !important", // Initial border color
                },
                "&:hover fieldset": {
                  borderColor: "#4782ff !important", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4782ff !important",
                  color: "#4782ff",
                },
              },
              "& .MuiInputBase-input": {
                color: "black", // Text color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#4782ff", // Label color on focus
              },
            }}
          >
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort Order"
            >
              <MenuItem value="highToLow">High to Low</MenuItem>
              <MenuItem value="lowToHigh">Low to High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by Game</InputLabel>
            <Select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              label="Filter by Game"
            >
              {gameOptions.map((game) => (
                <MenuItem key={game} value={game}>
                  {game}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Total Illegal Count</TableCell>
              <TableCell>Progress (Max: {MAX_ILLEGAL_BETS})</TableCell>
              <TableCell>Games</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.userId}>
                <TableCell>{item.userId}</TableCell>
                <TableCell>{item.totalIllegalCount}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.totalIllegalCount / MAX_ILLEGAL_BETS) * 100
                        }
                        style={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgba(0,0,0,0.1)",
                        }}
                        sx={{
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)", // Custom color for the progress bar
                          },
                        }}
                      />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="textSecondary">
                        {`${item.totalIllegalCount}/${MAX_ILLEGAL_BETS}`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {Object.entries(item.games)
                    .map(
                      ([game, stats]) => `${game}: ${stats.totalIllegalCount}`
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {new Date(item.lastUpdated).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}

export default IllegalBetsMain
