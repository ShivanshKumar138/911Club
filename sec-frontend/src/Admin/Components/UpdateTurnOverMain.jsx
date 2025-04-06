import React, { useState, useEffect } from "react"
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
  Typography,
  Box,
  Snackbar,
  CircularProgress,
  TablePagination,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import axios from "axios"
import { domain } from "../../Components/config"

function UpdateTurnOverMain() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "" })
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(10)
  const [alert, setAlert] = useState({ open: false, message: "" })
  const [searchUID, setSearchUID] = useState("")
  const theme = useTheme()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${domain}/admin/users-remaining-bets`, {
        withCredentials: true,
      })

      if (response.data.success) {
        setUsers(
          response.data.users.map((user) => ({
            ...user,
            newAdjustment: user.manualBetAdjustment,
            calculatedRemainingBet: user.remainingBetAmount,
          }))
        )
      } else {
        setError("Failed to fetch users: " + response.data.message)
      }
    } catch (err) {
      setError("Failed to fetch users: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustmentChange = (userId, value) => {
    setUsers(
      users.map((user) => {
        if (user.userId === userId) {
          const newAdjustment = parseFloat(value) || 0
          const calculatedRemainingBet = Math.max(
            0,
            user.requiredBetAmount - user.totalBet - newAdjustment
          )
          return {
            ...user,
            newAdjustment: value,
            calculatedRemainingBet,
          }
        }
        return user
      })
    )
  }

  const updateAdjustment = async (userId, adjustmentAmount) => {
    const user = users.find((u) => u.userId === userId)
    if (!user) return

    const adjustment = parseFloat(adjustmentAmount)

    if (isNaN(adjustment)) {
      setAlert({
        open: true,
        message: "Invalid adjustment amount.",
      })
      return
    }

    try {
      await axios.post(
        `${domain}/admin/adjust-bet`,
        { userId, adjustmentAmount: adjustment },
        { withCredentials: true }
      )
      setSnackbar({ open: true, message: "Adjustment updated successfully" })
      fetchUsers() // Refresh the user data after update
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update adjustment" })
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false })
  }

  const filteredUsers = users.filter((user) => {
    const uidString = user.uid ? user.uid.toString() : ""
    return uidString.includes(searchUID)
  })

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#4782ff", fontWeight: "bold" }}
      >
        Update User Turnover
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Search by UID"
          variant="outlined"
          value={searchUID}
          onChange={(e) => setSearchUID(e.target.value)}
          size="small"
          fullWidth
          sx={{
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
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#4782ff",
            color: "white",
            "&:hover": {
              bgcolor: "#4782ff",
            },
          }}
          onClick={() => setSearchUID("")}
        >
          Clear
        </Button>
      </Box>

      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  UID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Total Deposit
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Total Bet
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Required Bet Amount
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Current Manual Adjustment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  New Adjustment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Calculated Remaining Bet
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.userId} hover>
                    <TableCell>{user.uid}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.totalDeposit}</TableCell>
                    <TableCell>{user.totalBet}</TableCell>
                    <TableCell>{user.requiredBetAmount}</TableCell>
                    <TableCell>{user.manualBetAdjustment}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={user.newAdjustment}
                        onChange={(e) =>
                          handleAdjustmentChange(user.userId, e.target.value)
                        }
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            "& fieldset": {
                              borderColor: "#4782ff",
                            },
                          },
                        }}
                        size="small"
                        InputLabelProps={{
                          sx: {
                            "&.Mui-focused": {
                              color: "#4782ff", // Focused label color
                            },
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: theme.palette.grey[300],
                          padding: "8px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {user.calculatedRemainingBet}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{ color: "white", bgcolor: "#4782ff" }}
                        onClick={() =>
                          updateAdjustment(user.userId, user.newAdjustment)
                        }
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      <Dialog open={alert.open} onClose={handleAlertClose}>
        <DialogTitle>Invalid Adjustment</DialogTitle>
        <DialogContent>
          <Typography>{alert.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UpdateTurnOverMain