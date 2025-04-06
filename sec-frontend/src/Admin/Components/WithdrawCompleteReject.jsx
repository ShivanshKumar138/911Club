import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Grid,
  Container,
} from "@mui/material";
import axios from "axios";
import { domain } from "../../Components/config";

const WithdrawalStatus = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [searchAccountNo, setSearchAccountNo] = useState("");
  const [searchMobile, setSearchMobile] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);


  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${domain}/all-withdraw-history-admin_only`, {
        withCredentials: true,
      });
  
      if (!res?.data?.userWithdrawals) {
        setWithdrawals([]);
        return;
      }
  
      const data = res.data.userWithdrawals
        .filter(result => result && typeof result === 'object')
        .map((result) => {
          // Ensure userId is properly accessed
          const userInfo = result.userId || {};
          
          // Ensure bankDetails is an array or object
          const bankDetails = Array.isArray(userInfo.bankDetails) 
            ? userInfo.bankDetails[0] || {}
            : typeof userInfo.bankDetails === 'object' 
              ? userInfo.bankDetails 
              : {};
  
          // Format TRX address
          const trxAddress = (() => {
            if (!userInfo.TRXAddress) return "N/A";
            if (Array.isArray(userInfo.TRXAddress)) return userInfo.TRXAddress[0] || "N/A";
            if (typeof userInfo.TRXAddress === 'string') return userInfo.TRXAddress;
            return "N/A";
          })();
  
          // Ensure all returned values are strings or numbers
          return {
            id: String(result._id || ''),
            status: String(result.status || 'N/A'),
            balance: Number(result.balance || 0),
            accountNo: String(bankDetails.accountNo || 'N/A'),
            bankName: String(bankDetails.bankName || 'N/A'),
            ifscCode: String(bankDetails.ifscCode || 'N/A'),
            mobile: String(bankDetails.mobile || 'N/A'),
            name: String(bankDetails.name || 'N/A'),
            date: result.updatedAt ? new Date(result.updatedAt).toLocaleString() : 'N/A',
            withdrawMethod: String(result.withdrawMethod || 'N/A'),
            TRXAddress: String(trxAddress)
          };
        });
  
      setWithdrawals(data);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setError(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredWithdrawals = withdrawals.filter(
    (withdrawal) =>
      (tabValue === 0
        ? withdrawal.status === "Completed"
        : withdrawal.status === "Rejected") &&
      (!searchAccountNo ||
        (withdrawal.accountNo &&
          withdrawal.accountNo.includes(searchAccountNo))) &&
      (!searchMobile ||
        (withdrawal.mobile && withdrawal.mobile.includes(searchMobile)))
  );

  const columns = [
    { field: "slNo", headerName: "Sl No", width: 100 },
    { field: "id", headerName: "ID", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "balance", headerName: "Balance", width: 150 },
    { field: "accountNo", headerName: "Account No", width: 200 },
    { field: "bankName", headerName: "Bank Name", width: 150 },
    { field: "ifscCode", headerName: "IFSC Code", width: 200 },
    { field: "mobile", headerName: "Mobile", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "date", headerName: "Date and Time", width: 150 },
    { field: "withdrawMethod", headerName: "Withdraw Method", width: 150 },
    { field: "TRXAddress", headerName: "TRX Address", width: 250 },
  ];

  if (error) {
    return (
      <Typography variant="h6">
        Error fetching withdrawals. Please try again later.
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: "85vh" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h4"
          align="left"
          fontWeight="bold"
          gutterBottom
          color="#4782ff"
        >
          Withdrawal Status
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 3,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Search by Account No"
                variant="outlined"
                fullWidth
                value={searchAccountNo}
                onChange={(e) => setSearchAccountNo(e.target.value)}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Search by Mobile"
                variant="outlined"
                fullWidth
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
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
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Withdrawal Status Tabs"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  justifyContent: "space-between",
                  width: "100%",
                },
              }}
            >
              <Tab
                label="Completed Withdrawals"
                sx={{
                  fontWeight: "bold",
                  color: tabValue === 0 ? "#4782ff" : "#000000",
                  textTransform: "none",
                  fontSize: "17px",
                }}
              />
              <Tab
                label="Rejected Withdrawals"
                sx={{
                  fontWeight: "bold",
                  color: tabValue === 1 ? "#4782ff" : "#000000",
                  textTransform: "none",
                  fontSize: "17px",
                }}
              />
            </Tabs>
          </Box>
        </Box>
        <TableContainer
          sx={{ boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", maxHeight: 600 }}
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
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                      {index + 1}
                    </TableCell>
                    {columns.slice(1).map((column) => (
                      <TableCell
                        key={column.field}
                        align="center"
                        sx={{ borderBottom: "1px solid #e0e0e0" }}
                      >
                        {row[column.field]}
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
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default WithdrawalStatus;