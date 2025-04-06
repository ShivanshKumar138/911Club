// import  { useState } from "react";
// import {
//   Container, Paper, Typography, TextField, Button, FormControlLabel, Switch,
//   Grid, MenuItem, Select
// } from "@mui/material";

// const WithdrawalLimits = () => {
//   const [allow24x7, setAllow24x7] = useState(false);
//   const [startHour, setStartHour] = useState("");
//   const [startPeriod, setStartPeriod] = useState("AM");
//   const [endHour, setEndHour] = useState("");
//   const [endPeriod, setEndPeriod] = useState("PM");
//   const [maxRequests, setMaxRequests] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");

//   return (
//     <Container maxWidth="sm" style={{ marginTop: 40 }}>
//       <Paper elevation={3} style={{ padding: 20, borderRadius: 10 }}>
//         <Typography variant="h5" color="primary" gutterBottom>
//           Modify Withdrawal Limits
//         </Typography>

//         <FormControlLabel
//           control={<Switch checked={allow24x7} onChange={(e) => setAllow24x7(e.target.checked)} />}
//           label="Allow withdrawals 24/7"
//         />

//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth label="Withdrawal Start Hour"
//               value={startHour} onChange={(e) => setStartHour(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Select fullWidth value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)}>
//               <MenuItem value="AM">AM</MenuItem>
//               <MenuItem value="PM">PM</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth label="Withdrawal End Hour"
//               value={endHour} onChange={(e) => setEndHour(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Select fullWidth value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)}>
//               <MenuItem value="AM">AM</MenuItem>
//               <MenuItem value="PM">PM</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth label="Max Withdraw Requests Per Day"
//               value={maxRequests} onChange={(e) => setMaxRequests(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth label="Min Withdraw Amount"
//               value={minAmount} onChange={(e) => setMinAmount(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth label="Max Withdraw Amount"
//               value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)}
//             />
//           </Grid>
//         </Grid>

//         <Button
//           fullWidth variant="contained" color="primary"
//           style={{ marginTop: 20 }}
//         >
//           UPDATE SETTINGS
//         </Button>
//       </Paper>
//     </Container>
//   );
// };

// export default WithdrawalLimits;

/*eslint-disable*/

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useToast } from "@/components/ui/use-toast";
import { apiCall } from "@/utils/api";

const WithdrawalLimits = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    isUsdt: false,
    withdrawalStartPeriod: "AM",
    withdrawalEndPeriod: "PM",
    withdrawalStartHour: 7,
    withdrawalEndHour: 8,
    maxWithdrawRequestsPerDay: 4,
    minWithdrawAmount: 1000,
    maxWithdrawAmount: 100000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiCall("/settings-modify-withdrawl", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      console.log("Submit response:", response);

      toast({
        title: "Success",
        description: "Settings updated successfully",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while updating settings",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Modify Withdrawal Settings
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isUsdt}
                  onChange={handleSwitchChange}
                  name="isUsdt"
                  color="primary"
                />
              }
              label="Enable USDT"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="withdrawalStartPeriod-label">
                Withdrawal Start Period
              </InputLabel>
              <Select
                labelId="withdrawalStartPeriod-label"
                id="withdrawalStartPeriod"
                name="withdrawalStartPeriod"
                value={formData.withdrawalStartPeriod}
                onChange={handleChange}
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="withdrawalEndPeriod-label">
                Withdrawal End Period
              </InputLabel>
              <Select
                labelId="withdrawalEndPeriod-label"
                id="withdrawalEndPeriod"
                name="withdrawalEndPeriod"
                value={formData.withdrawalEndPeriod}
                onChange={handleChange}
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="withdrawalStartHour"
              label="Withdrawal Start Hour"
              name="withdrawalStartHour"
              type="number"
              value={formData.withdrawalStartHour}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="withdrawalEndHour"
              label="Withdrawal End Hour"
              name="withdrawalEndHour"
              type="number"
              value={formData.withdrawalEndHour}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="maxWithdrawRequestsPerDay"
              label="Max Withdraw Requests Per Day"
              name="maxWithdrawRequestsPerDay"
              type="number"
              value={formData.maxWithdrawRequestsPerDay}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="minWithdrawAmount"
              label="Min Withdraw Amount"
              name="minWithdrawAmount"
              type="number"
              value={formData.minWithdrawAmount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="maxWithdrawAmount"
              label="Max Withdraw Amount"
              name="maxWithdrawAmount"
              type="number"
              value={formData.maxWithdrawAmount}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default WithdrawalLimits;
