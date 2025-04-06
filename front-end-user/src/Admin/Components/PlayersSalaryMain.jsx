import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import axios from "axios";
import { domain } from "../../Components/config";

const DepositBonusAdmin = () => {
  const [data, setData] = useState([]);
  const [minimumDeposit, setMinimumDeposit] = useState("");
  const [bonus, setBonus] = useState("");
  const [minimumSubordinates, setMinimumSubordinates] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${domain}/get-salary-criteria`, {
        withCredentials: true,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${domain}/update-salary-criteria`,
        {
          minimumDepositAmount: minimumDeposit,
          bonusAmount: bonus,
          minimumSubordinates,
        },
        { withCredentials: true }
      );
      setMinimumDeposit("");
      setBonus("");
      setMinimumSubordinates("");
      fetchData();
    } catch (error) {
      console.error("Error updating deposit bonus", error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Update Deposit Bonus
                </Typography>
              }
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Minimum Subordinates"
                      value={minimumSubordinates}
                      onChange={(e) => setMinimumSubordinates(e.target.value)}
                      fullWidth
                      variant="outlined"
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                        marginBottom: { xs: "10px", sm: "0" },
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Minimum Deposit"
                      value={minimumDeposit}
                      onChange={(e) => setMinimumDeposit(e.target.value)}
                      fullWidth
                      variant="outlined"
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                        marginBottom: { xs: "10px", sm: "0" },
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Bonus"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                      fullWidth
                      variant="outlined"
                      type="number"
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                        marginBottom: { xs: "10px", sm: "0" },
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#FFC107",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Current Criteria
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                    <TableRow>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Minimum Subordinates
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Minimum Deposit
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Bonus
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                        }}
                      >
                        <TableCell align="left">
                          {row.minimumSubordinates}
                        </TableCell>
                        <TableCell align="left">
                          {row.minimumDepositAmount}
                        </TableCell>
                        <TableCell align="left">{row.bonusAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DepositBonusAdmin;