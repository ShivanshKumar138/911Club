import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { domain } from "../../Components/config";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

const WithdrawalLimitsMain = () => {
  const classes = useStyles();
  const [settings, setSettings] = useState({
    withdrawalStartHour: "",
    withdrawalStartPeriod: "AM",
    withdrawalEndHour: "",
    withdrawalEndPeriod: "PM",
    maxWithdrawRequestsPerDay: "",
    minWithdrawAmount: "",
    maxWithdrawAmount: "",
    isAllTimeWithdrawal: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${domain}/settings`, {
        withCredentials: true,
      });
      setSettings({
        ...response.data,
        isAllTimeWithdrawal:
          response.data.withdrawalStartHour === 0 &&
          response.data.withdrawalEndHour === 23 &&
          response.data.withdrawalStartPeriod === "AM" &&
          response.data.withdrawalEndPeriod === "PM",
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
      showSnackbar("Error fetching settings", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]:
        type === "checkbox"
          ? checked
          : name.includes("Hour") ||
            name.includes("Amount") ||
            name.includes("RequestsPerDay")
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...settings };

      if (settings.isAllTimeWithdrawal) {
        dataToSubmit.withdrawalStartHour = 0;
        dataToSubmit.withdrawalStartPeriod = "AM";
        dataToSubmit.withdrawalEndHour = 23;
        dataToSubmit.withdrawalEndPeriod = "PM";
      }

      delete dataToSubmit.isAllTimeWithdrawal;

      const response = await axios.put(
        `${domain}/settings-modify-withdrawl`,
        dataToSubmit,
        { withCredentials: true }
      );
      showSnackbar("Settings updated successfully", "success");
      setSettings({
        ...response.data,
        isAllTimeWithdrawal:
          response.data.withdrawalStartHour === 0 &&
          response.data.withdrawalEndHour === 23 &&
          response.data.withdrawalStartPeriod === "AM" &&
          response.data.withdrawalEndPeriod === "PM",
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      showSnackbar(
        `Error: ${err.response?.data?.message || err.message}`,
        "error"
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: "85vh" }}>
      <Paper className={classes.paper} elevation={3}>
        <Typography
          variant="h5"
          align="left"
          fontWeight="bold"
          gutterBottom
          style={{ paddingLeft: "6px", color: "#4782ff" }}
        >
          Modify Withdrawal Limits
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.isAllTimeWithdrawal}
                    onChange={handleChange}
                    name="isAllTimeWithdrawal"
                    // color="primary"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#4782ff", // Thumb color when checked
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)", // Track color when checked
                        },
                    }}
                  />
                }
                label="Allow withdrawals 24/7"
              />
            </Grid>
            {!settings.isAllTimeWithdrawal && (
              <>
                <Grid item xs={6}>
                  <TextField
                    name="withdrawalStartHour"
                    label="Withdrawal Start Hour"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 23 } }}
                    value={settings.withdrawalStartHour}
                    onChange={handleChange}
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
                <Grid item xs={6}>
                  <TextField
                    select
                    name="withdrawalStartPeriod"
                    label="Start Period"
                    variant="outlined"
                    fullWidth
                    value={settings.withdrawalStartPeriod}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "black",
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
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="withdrawalEndHour"
                    label="Withdrawal End Hour"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 23 } }}
                    value={settings.withdrawalEndHour}
                    onChange={handleChange}
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
                <Grid item xs={6}>
                  <TextField
                    select
                    name="withdrawalEndPeriod"
                    label="End Period"
                    variant="outlined"
                    fullWidth
                    value={settings.withdrawalEndPeriod}
                    onChange={handleChange}
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
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </TextField>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                name="maxWithdrawRequestsPerDay"
                label="Max Withdraw Requests Per Day"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={settings.maxWithdrawRequestsPerDay}
                onChange={handleChange}
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
            <Grid item xs={12}>
              <TextField
                name="minWithdrawAmount"
                label="Min Withdraw Amount"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={settings.minWithdrawAmount}
                onChange={handleChange}
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
            <Grid item xs={12}>
              <TextField
                name="maxWithdrawAmount"
                label="Max Withdraw Amount"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={settings.maxWithdrawAmount}
                onChange={handleChange}
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "white",
              },
            }}
          >
            Update Settings
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
};

export default WithdrawalLimitsMain;
