import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Cookies from "js-cookie";
import axios from "axios";
import { domain } from "../../Components/config";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import format from "date-fns/format";
import { color } from "framer-motion";

const theme = createTheme({
  palette: {
    copy: {
      main: "#ffc107",
    },
    accept: {
      main: "#4caf50",
    },
    reject: {
      main: "#f44336",
    },
  },
  typography: {
    fontWeightSemiBold: 600,
  },
});

const styles = `
  .bold-header .MuiDataGrid-columnHeaderTitle {
    font-weight: 700;
  }
  .semibold-cell {
    font-weight: 600;
  }
  .custom-even-row {
    background-color: #f5f5f5;
  }
  .custom-odd-row {
    background-color: #ffffff;
  }
`;

function UpdateWithdrawRequest() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterRows();
  }, [searchQuery, startDate, endDate, rows]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${domain}/all-withdraw-history-admin_only`, {
        withCredentials: true,
      });

      const data = res.data.userWithdrawals
        .filter((result) => result.status === "Pending" && !result.withdrawDone)
        .map((result, index) => {
          const accountDetails =
            result.userId &&
            Array.isArray(result.userId.bankDetails) &&
            result.userId.bankDetails.length > 0
              ? result.userId.bankDetails[0]
              : {};
          const TRXAddress =
            result.userId &&
            Array.isArray(result.userId.TRXAddress) &&
            result.userId.TRXAddress.length > 0
              ? result.userId.TRXAddress[0]
              : null;

          const isUSDT = result.withdrawMethod === "USDT";
          const balance = isUSDT ? result.balance * 93 : result.balance;

          return {
            id: result._id,
            srNo: index + 1,
            name: accountDetails.name || "N/A", // Add name from bankDetails
            status: result.status,
            balance: balance,
            userId: result.userId ? result.userId._id : null,
            createdAt: new Date(result.createdAt),
            ...accountDetails,
            withdrawMethod: result.withdrawMethod,
            TRXAddress,
            remark: "",
          };
        });

      setRows(data);
      setFilteredRows(data);
      localStorage.setItem("withdrawals", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const filterRows = () => {
    let filtered = rows;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (row) => row.accountNo && row.accountNo.toLowerCase().includes(query)
      );
    }

    if (startDate || endDate) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.createdAt);
        return (
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate)
        );
      });
    }

    setFilteredRows(filtered);
  };

  const updateRowStatus = (id, newStatus, remark) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, status: newStatus, updatedAt: new Date(), remark }
        : row
    );

    setRows(updatedRows);
    setFilteredRows(updatedRows);
    localStorage.setItem("withdrawals", JSON.stringify(updatedRows));
  };

  const handleOpenDialog = (id, action) => {
    setSelectedId(id);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptReject = async () => {
    const token = Cookies.get("token");
    const remark = remarks[selectedId] || "";

    try {
      const res = await axios.post(
        `${domain}/update-withdraw-status`,
        {
          withdrawId: selectedId,
          acceptanceType: dialogAction === "accept" ? "Completed" : "Rejected",
          remark: remark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res.data);
      updateRowStatus(
        selectedId,
        dialogAction === "accept" ? "Completed" : "Rejected",
        remark
      );
      removeRowFromView(selectedId);
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating withdraw status:", error);
    }
  };

  const removeRowFromView = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    setFilteredRows(updatedRows);
    localStorage.setItem("withdrawals", JSON.stringify(updatedRows));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [id]: value,
    }));
  };

  const columns = [
    {
      field: "srNo",
      headerName: "ID",
      width: 60,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "name", // New Name column
      headerName: "Name",
      width: 150,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "withdrawMethod",
      headerName: "Withdraw Method",
      width: 150,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 120,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
      type: "number",
    },
    {
      field: "accountNo",
      headerName: "Account No",
      width: 200,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "bankName",
      headerName: "Bank Name",
      width: 150,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "ifscCode",
      headerName: "IFSC Code",
      width: 180,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 120,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 130,
      type: "dateTime",
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
      valueGetter: (params) => new Date(params.value),
      valueFormatter: ({ value }) => format(new Date(value), "yyyy-MM-dd"),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerClassName: "bold-header",
      cellClassName: "semibold-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="accept"
            onClick={() => handleOpenDialog(params.row.id, "accept")}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="reject"
            onClick={() => handleOpenDialog(params.row.id, "reject")}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Withdrawal Requests
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Search Account No"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#4782ff", // Default label color
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#4782ff", // Focused label color
                      },
                    }}
                  />
                )}
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
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#4782ff", // Default label color
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#4782ff", // Focused label color
                      },
                    }}
                  />
                )}
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
            </LocalizationProvider>
          </Box>
          <div style={{ height: 600, width: "100%", overflow: "hidden" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 30]}
              components={{ Toolbar: GridToolbar }}
              sx={{
                "& .MuiDataGrid-cell": {
                  fontWeight: "500",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#e3f2fd",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#f9f9f9",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#ffffff",
                },
                "& .MuiDataGrid-root": {
                  overflowX: "hidden",
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
          </div>
        </Paper>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === "accept" ? "Accept" : "Reject"} Withdrawal Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === "accept"
              ? "Are you sure you want to accept this withdrawal request?"
              : "Are you sure you want to reject this withdrawal request?"}
          </DialogContentText>
          <TextField
            margin="dense"
            id="remark"
            label="Remark"
            type="text"
            fullWidth
            variant="outlined"
            value={remarks[selectedId] || ""}
            onChange={(e) => handleRemarkChange(selectedId, e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAcceptReject}
            color={dialogAction === "accept" ? "accept" : "reject"}
          >
            {dialogAction === "accept" ? "Accept" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

UpdateWithdrawRequest.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default UpdateWithdrawRequest;
