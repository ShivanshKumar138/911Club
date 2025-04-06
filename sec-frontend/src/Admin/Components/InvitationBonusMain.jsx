import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { domain } from "../../Components/config";

// Improved styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
  borderRadius: "50%",
  width: 56,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#4782ff",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#4782ff",
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
}));

function InvitationBonusMain() {
  const [minSubordinates, setMinSubordinates] = useState("");
  const [minDepositAmount, setMinDepositAmount] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [existingRecords, setExistingRecords] = useState([]);

  useEffect(() => {
    fetchExistingRecords();
  }, []);

  const fetchExistingRecords = async () => {
    try {
      const response = await axios.get(`${domain}/invitation-bonus`);
      setExistingRecords(
        Array.isArray(response.data.data) ? response.data.data : []
      );
    } catch (error) {
      console.error("Error fetching existing records:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const newRule = {
        minSubordinates: parseInt(minSubordinates, 10),
        minDepositAmount: parseFloat(minDepositAmount),
        bonusAmount: parseFloat(bonusAmount),
      };
      await axios.post(`${domain}/invitation-bonus`, newRule);
      fetchExistingRecords();
      setMinSubordinates("");
      setMinDepositAmount("");
      setBonusAmount("");
    } catch (error) {
      console.error("Error submitting new rule:", error);
    }
  };

  const StatCard = ({ icon: Icon, title, value }) => (
    <StyledCard>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <IconWrapper>
          <Icon sx={{ color: "white", fontSize: 28 }} />
        </IconWrapper>
        <Typography variant="h5" gutterBottom align="center">
          {value}
        </Typography>
        <Typography color="textSecondary" variant="body1" align="center">
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
          Invitation Bonus Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
            "&:hover": {
              backgroundColor: "#0d5614",
            },
            padding: "10px 20px",
            borderRadius: 2,
          }}
        >
          Add New Rule
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PersonAddIcon}
            title="Total Rules"
            value={existingRecords.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={MonetizationOnIcon}
            title="Highest Bonus"
            value={`₹${Math.max(
              ...existingRecords.map((r) => r.bonusAmount || 0),
              0
            )}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            title="Avg Deposit Req"
            value={`₹${Math.round(
              existingRecords.reduce(
                (acc, curr) => acc + (curr.minDepositAmount || 0),
                0
              ) / (existingRecords.length || 1)
            )}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CardGiftcardIcon}
            title="Total Bonus Types"
            value={existingRecords.length}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Add New Bonus Rule
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <StyledTextField
                fullWidth
                label="Minimum Subordinates"
                type="number"
                value={minSubordinates}
                onChange={(e) => setMinSubordinates(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <PersonAddIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Minimum Deposit Amount"
                type="number"
                value={minDepositAmount}
                onChange={(e) => setMinDepositAmount(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <MonetizationOnIcon
                      sx={{ color: "action.active", mr: 1 }}
                    />
                  ),
                }}
              />
              <StyledTextField
                fullWidth
                label="Bonus Amount"
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <CardGiftcardIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
            <Box
              sx={{ p: 3, borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Existing Bonus Rules
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Sr No</StyledTableCell>
                    <StyledTableCell>Min Subordinates</StyledTableCell>
                    <StyledTableCell>Min Deposit</StyledTableCell>
                    <StyledTableCell>Bonus Amount</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {existingRecords.map((record, index) => (
                    <TableRow key={record._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{record.minSubordinates}</TableCell>
                      <TableCell>₹{record.minDepositAmount}</TableCell>
                      <TableCell>₹{record.bonusAmount}</TableCell>
                    </TableRow>
                  ))}
                  {existingRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No existing records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default InvitationBonusMain;
