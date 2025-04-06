import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Alert } from "@mui/material";
import { domain } from "../../Components/config";

const DepositPendingRequestContent = ({ onAccept, onReject }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterDate, pendingRequests]);

  const fetchPendingRequests = () => {
    setLoading(true);
    axios
      .get(`${domain}/admin/deposit/history`, { withCredentials: true })
      .then((res) => {
        const filteredRequests = res.data.filter(
          (request) => request.depositStatus === "pending"
        );
        setPendingRequests(filteredRequests);
        setFilteredRequests(filteredRequests);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pending recharge requests:", err);
        setError("Failed to fetch pending requests.");
        setSnackbarOpen(true);
        setLoading(false);
      });
  };

  const applyFilters = () => {
    let updatedRequests = pendingRequests;

    if (searchQuery) {
      updatedRequests = updatedRequests.filter((request) =>
        request.uid.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDate) {
      updatedRequests = updatedRequests.filter((request) => {
        const requestDate = new Date(request.depositDate)
          .toISOString()
          .split("T")[0];
        return requestDate === filterDate;
      });
    }

    setFilteredRequests(updatedRequests);
  };

  const handleAccept = (request) => {
    setLoading(true);

    axios
      .post(
        `${domain}/wallet-manual`,
        {
          userId: request.userId,
          amount: request.depositAmount,
          depositId: request._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const updatedRequests = pendingRequests.filter(
          (req) => req._id !== request._id
        );
        setPendingRequests(updatedRequests);
        setLoading(false);
        setSnackbarOpen(true);
        if (onAccept) onAccept(request);
      })
      .catch((err) => {
        console.error("Error accepting deposit:", err);
        setError("Failed to accept deposit. Please try again later.");
        setLoading(false);
        setSnackbarOpen(true);
      });
  };

  const handleReject = (request) => {
    setLoading(true);

    axios
      .post(
        `${domain}/rejectDeposit`,
        { userId: request.userId, depositId: request._id },
        { withCredentials: true }
      )
      .then((res) => {
        const updatedRequests = pendingRequests.filter(
          (req) => req._id !== request._id
        );
        setPendingRequests(updatedRequests);
        setLoading(false);
        setSnackbarOpen(true);
        if (onReject) onReject(request);
      })
      .catch((err) => {
        console.error("Error rejecting deposit:", err);
        setError("Failed to reject deposit. Please try again later.");
        setLoading(false);
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError(null);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        backgroundColor: "whitesmoke",
        minHeight: "85vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "#4782ff" }}
        >
          Pending Recharge Requests
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search by UID"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: "200px",
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
          <TextField
            label="Filter by Date"
            type="date"
            variant="outlined"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            sx={{
              width: "200px",
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
              shrink: true,
            }}
          />
        </Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 650, borderCollapse: "collapse" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  Sl No
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  UTR
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderBottom: "1px solid #dee2e6",
                    textAlign: "center",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  UID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  Mobile
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderBottom: "1px solid #dee2e6" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((row, index) => (
                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "inherit",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {row.depositAmount}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {row.depositId}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                      textAlign: "center",
                    }}
                  >
                    {new Date(row.depositDate).toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <span
                      style={{
                        background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        color: "white",
                      }}
                    >
                      {row.depositStatus}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {row.uid}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    {row.mobile}
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #dee2e6" }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#4caf50", color: "white", mr: 1 }}
                      size="small"
                      disabled={loading}
                      onClick={() => handleAccept(row)}
                    >
                      {loading ? <CircularProgress size={24} /> : "Accept"}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#f44336", color: "white" }}
                      size="small"
                      disabled={loading}
                      onClick={() => handleReject(row)}
                    >
                      {loading ? <CircularProgress size={24} /> : "Reject"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error ? error : "Operation successful"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepositPendingRequestContent;
