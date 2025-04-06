import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  tableCellClasses,
  styled,
  Grid,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { domain } from "../../Components/config";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  formControl: {
    minWidth: 120,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));
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

const SalaryForm = () => {
  const classes = useStyles();
  const [uid, setUid] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [salaryFrequency, setSalaryFrequency] = useState("");
  const [frequencyLimit, setFrequencyLimit] = useState("");
  const [remark, setRemark] = useState(""); // New state for remark

  const handleSubmit = async (event) => {
    event.preventDefault();

    const salaryDetails = {
      uid,
      salaryAmount,
      salaryFrequency,
      frequencyLimit,
      remark, // Include remark in the payload
    };

    try {
      await axios.post(`${domain}/set-salary`, salaryDetails, {
        withCredentials: true,
      });
      alert("Salary details set successfully");
    } catch (error) {
      console.error("Error setting salary details:", error);
    }
  };

  const [salaryRecords, setSalaryRecords] = useState([]);

  useEffect(() => {
    const fetchSalaryRecords = async () => {
      try {
        const response = await axios.get(`${domain}/get-salary-records`, {
          withCredentials: true,
        });
        setSalaryRecords(response.data);
      } catch (error) {
        console.error("Error fetching salary records:", error);
      }
    };

    fetchSalaryRecords();
  }, []);

  return (
    <div style={{ minHeight: "85vh" }}>
      <Box className={classes.root}>
        <Typography
          variant="h5"
          className={classes.title}
          mt={1}
          mb={3}
          color="#4782ff"
        >
          <b>Set Salary Details</b>
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="UID"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                  marginBottom: { xs: "10px", sm: "0" },
                }}
                required
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#4782ff", // Focused label color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary Amount"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                  marginBottom: { xs: "10px", sm: "0" },
                }}
                required
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#4782ff", // Focused label color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required className={classes.formControl}>
                <TextField
                  label="Salary Frequency"
                  select
                  fullWidth
                  labelId="salary-frequency-label"
                  id="salary-frequency"
                  value={salaryFrequency}
                  onChange={(e) => setSalaryFrequency(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& fieldset": {
                        borderColor: "#4782ff",
                      },
                    },
                    marginBottom: { xs: "10px", sm: "0" },
                  }}
                  InputLabelProps={{
                    sx: {
                      "&.Mui-focused": {
                        color: "#4782ff", // Focused label color
                      },
                    },
                  }}
                  variant="outlined"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="Minutely">Minutely</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Frequency Limit"
                value={frequencyLimit}
                onChange={(e) => setFrequencyLimit(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                  marginBottom: { xs: "10px", sm: "0" },
                }}
                required
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "#4782ff", // Focused label color
                    },
                  },
                }}
              />
            </Grid>

            {/* New Remark Field */}
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#4782ff",
                    },
                  },
                  marginBottom: { xs: "10px", sm: "0" },
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

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              <Button
                type="submit"
                variant="contained"
                className={classes.button}
                sx={{
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                    color: "white",
                  },
                }}
              >
                Start Salary Cron Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <br></br>
      <Box sx={{ mt: 3, backgroundColor: "white", p: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, mt: 3, color: "#4782ff" }}
        >
          <b>Salary Details</b>
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>UID</StyledTableCell>
                <StyledTableCell align="center">Salary Amount</StyledTableCell>
                <StyledTableCell align="center">
                  Salary Frequency
                </StyledTableCell>
                <StyledTableCell align="center">
                  Frequency Limit
                </StyledTableCell>
                <StyledTableCell align="center">Remark</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {salaryRecords.map((record) => (
                <StyledTableRow key={record.uid}>
                  <StyledTableCell component="th" scope="row">
                    {record.uid}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {record.salaryAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {record.salaryFrequency}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {record.frequencyLimit}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {record.remark || "N/A"}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default SalaryForm;
