import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Tab,
  Tabs,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { domain } from "../../Components/config";

const Recharge = () => {
  const [deposits, setDeposits] = useState([]);
  const [tabValue, setTabValue] = useState(0); // 0 for Completed Deposits, 1 for Rejected Deposits
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = () => {
    axios
      .get(`${domain}/admin/deposit/history`, { withCredentials: true })
      .then((res) => setDeposits(res.data))
      .catch((err) => console.error(err));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter deposits based on the tab value and the search term
  const filteredDeposits = deposits
    .filter((deposit) => {
      if (tabValue === 0) {
        return deposit.depositStatus === "completed";
      } else {
        return deposit.depositStatus === "failed";
      }
    })
    .filter((deposit) => {
      return deposit.uid.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // Columns with Serial Number added
  const columns = [
    { field: "serialNumber", headerName: "Sl No", width: 100 },
    { field: "depositId", headerName: "UTR", width: 150 },
    { field: "uid", headerName: "UID", width: 150 },
    { field: "depositAmount", headerName: "Amount", width: 150 },
    { field: "depositDate", headerName: "Date", width: 150 },
    { field: "depositStatus", headerName: "Status", width: 150 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, minHeight: "85vh" }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          align="left"
          fontWeight="bold"
          gutterBottom
          style={{ paddingLeft: "15px", color: "#4782ff" }}
        >
          Recharge Status
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Deposit Status Tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
                width: "100%",
              },
            }}
          >
            <Tab
              label="Completed Deposits"
              sx={{
                fontWeight: "bold",
                color: tabValue === 0 ? "#4782ff" : "#000000",
                textTransform: "none",
                fontSize: "17px",
              }}
            />
            <Tab
              label="Rejected Deposits"
              sx={{
                fontWeight: "bold",
                color: tabValue === 1 ? "#4782ff" : "#000000",
                textTransform: "none",
                fontSize: "17px",
              }}
            />
          </Tabs>
        </Box>
        <TextField
          variant="outlined"
          label="Search by UID"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            mb: 3,
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
        <TableContainer sx={{ boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #e0e0e0",
                      bgcolor: "#e8e8e8",
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeposits.map((row, index) => (
                <TableRow
                  key={row._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e0e0e0" }}
                  >
                    {index + 1}
                  </TableCell>
                  {columns.slice(1).map((column) => (
                    <TableCell
                      key={column.field}
                      align="center"
                      sx={{ borderRight: "1px solid #e0e0e0" }}
                    >
                      {row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {filteredDeposits.length === 0 && (
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

export default Recharge;
