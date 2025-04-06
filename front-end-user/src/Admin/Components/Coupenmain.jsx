import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  styled,
  tableCellClasses,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { domain } from "../../Components/config";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const Coupon = () => {
  const [code, setCode] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [redemptionLimit, setRedemptionLimit] = useState("");
  const [error, setError] = useState("");

  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 12).toUpperCase();
    setCode(newCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = {
      code: code,
      bonusAmount: bonusAmount,
      redemptionLimit: redemptionLimit,
    };
    axios
      .post(`${domain}/create-coupon`, response, { withCredentials: true })
      .then(function (response) {
        alert("Successful");
        setCode("");
        setBonusAmount("");
        setRedemptionLimit("");
      })
      .catch(function (error) {
        setError(
          "Coupon creation failed. Please check your inputs and try again."
        );
      });
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${domain}/coupons-list`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error while fetching coupons:", err);
      });
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard");
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "whitesmoke", p: 2 }}>
      <Grid container component="main">
        <Grid item xs={12}>
          <Box
            component="main"
            sx={{
              backgroundColor: "white",
              flexGrow: 1,
              flexDirection: "column",
              p: isSmallScreen ? 4 : 2,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, color: "#4782ff" }}
            >
              <b>Create Coupon</b>
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    label="Code"
                    name="code"
                    autoComplete="code"
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
                      marginBottom: { xs: "10px", sm: "0" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={generateCode}>
                            <AutorenewIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
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
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="bonusAmount"
                    label="Bonus Amount"
                    type="number"
                    id="bonusAmount"
                    autoComplete="bonus-amount"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
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
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="redemptionLimit"
                    label="Redemption Limit"
                    type="number"
                    id="redemptionLimit"
                    autoComplete="redemption-limit"
                    value={redemptionLimit}
                    onChange={(e) => setRedemptionLimit(e.target.value)}
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
                  sm={1}
                  display="flex"
                  justifyContent="center"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                      padding: isSmallScreen ? 0.5 : 1.5,
                      paddingLeft: isSmallScreen ? 0 : 7,
                      paddingRight: isSmallScreen ? 0 : 7,
                      color: "white",
                      marginTop: "12px",
                      marginLeft: isSmallScreen ? "40px" : "10px",
                      "&:hover": {
                        background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                        color: "white",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, backgroundColor: "white", p: 2, paddingBottom: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, mt: 3, color: "#4782ff" }}
        >
          <b>View Coupons</b>
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Code</StyledTableCell>
                <StyledTableCell align="center">Bonus Amount</StyledTableCell>
                <StyledTableCell align="center">
                  Redemption Limit
                </StyledTableCell>
                <StyledTableCell align="center">
                  Redemption Count
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {row.code}
                    <IconButton onClick={() => handleCopy(row.code)}>
                      <FileCopyIcon />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.bonusAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.redemptionLimit}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.redemptionCount}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Coupon;
