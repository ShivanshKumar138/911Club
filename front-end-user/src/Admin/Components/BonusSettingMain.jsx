import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import { domain } from "../../Components/config";
const BonusSettingMain = () => {
  const [depositBonuses, setDepositBonuses] = useState([]);
  const [minimumDeposit, setMinimumDeposit] = useState("");
  const [bonus, setBonus] = useState("");
  const [errors, setErrors] = useState({ minimumDeposit: "", bonus: "" });

  const fetchDepositBonuses = async () => {
    try {
      const response = await axios.get(`${domain}/all-deposit-bonuses`, {
        withCredentials: true,
      });
      console.log("response--->", response.data);
      setDepositBonuses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDepositBonuses();
  }, []);

  const validate = () => {
    let valid = true;
    let errors = { minimumDeposit: "", bonus: "" };

    if (!minimumDeposit) {
      errors.minimumDeposit = "Minimum Deposit is required";
      valid = false;
    }
    if (!bonus) {
      errors.bonus = "Bonus is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const updateDepositBonus = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await axios.put(
        `${domain}/admin/update-deposit-bonus`,
        { minimumDeposit, bonus },
        { withCredentials: true }
      );
      setMinimumDeposit("");
      setBonus("");
      fetchDepositBonuses();
    } catch (err) {
      console.error(err);
    }
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.common.black,
      fontWeight: theme.typography.fontWeightBold,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.common.white,
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div>
      <Grid>
        <Box
          component="main"
          sx={{
            backgroundColor: "white",
            p: 1,
            paddingLeft: 7,

            paddingBottom: 5,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 2, mt: 3, color: "#4782ff" }}
          >
            <b>First Deposit Bonus</b>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <form onSubmit={updateDepositBonus}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Minimum Deposit"
                    fullWidth
                    value={minimumDeposit}
                    onChange={(e) => setMinimumDeposit(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
                      marginBottom: { xs: "10px", sm: "0" },
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    margin="normal"
                    required
                    error={!!errors.minimumDeposit}
                    helperText={errors.minimumDeposit}
                    InputLabelProps={{
                      sx: {
                        "&.Mui-focused": {
                          color: "#4782ff", // Focused label color
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Bonus"
                    fullWidth
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
                      marginBottom: { xs: "10px", sm: "0" },
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    margin="normal"
                    required
                    error={!!errors.bonus}
                    helperText={errors.bonus}
                    InputLabelProps={{
                      sx: {
                        "&.Mui-focused": {
                          color: "#4782ff", // Focused label color
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      marginTop: 1,
                      marginBottom: 1,
                      background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                      color: "white",
                      marginTop: "15px",

                      "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                      },
                    }}
                  >
                    Update Deposit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>

        <br />
        <br />
        <Box
          component="main"
          sx={{
            backgroundColor: "white",
            p: 5,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, color: "#4782ff" }}
          >
            <b>Deposit Bonus Criteria</b>
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Minimum Deposit</StyledTableCell>
                  <StyledTableCell>Bonus</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {depositBonuses.map((bonus) => (
                  <StyledTableRow key={bonus._id}>
                    <StyledTableCell>{bonus.minimumDeposit}</StyledTableCell>
                    <StyledTableCell>{bonus.bonus}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </div>
  );
};

export default BonusSettingMain;
