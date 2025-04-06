import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CssBaseline,
  Paper,
} from "@mui/material";
import axios from "axios";
import { domain } from "../../Components/config";

function SettingsMain() {
  const [upi, setUpi] = useState("");
  const [trx, setTrx] = useState("");
  const [image, setImage] = useState(null);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [level4, setLevel4] = useState("");
  const [level5, setLevel5] = useState("");
  const [level1bet, setLevel1bet] = useState("");
  const [level2bet, setLevel2bet] = useState("");
  const [level3bet, setLevel3bet] = useState("");
  const [level4bet, setLevel4bet] = useState("");
  const [level5bet, setLevel5bet] = useState("");

  useEffect(() => {
    axios
      .get(`${domain}/Getid`, { withCredentials: true })
      .then((response) => {
        setUpi(response.data.Upi);
        setTrx(response.data.Trx);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${domain}/fetch-commission-rates`, { withCredentials: true })
      .then((response) => {
        const { data } = response;
        setLevel1(data.data.level1);
        setLevel2(data.data.level2);
        setLevel3(data.data.level3);
        setLevel4(data.data.level4);
        setLevel5(data.data.level5);
      })
      .catch((error) => {
        console.error("Error fetching commission rates:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${domain}/commissionRates-data-get`, { withCredentials: true })
      .then((response) => {
        const { data } = response;
        setLevel1bet(data.level1);
        setLevel2bet(data.level2);
        setLevel3bet(data.level3);
        setLevel4bet(data.level4);
        setLevel5bet(data.level5);
      })
      .catch((error) => {
        console.error("Error fetching commission rates:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("Upi", upi);
    data.append("Trx", trx);
    data.append("image", image);

    axios
      .post(`${domain}/upsertID`, data, { withCredentials: true })
      .then(() => {
        alert("Update Successful");
        setUpi("");
        setTrx("");
        setImage(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const formData = {
      level1,
      level2,
      level3,
      level4,
      level5,
    };

    axios
      .put(`${domain}/update-commission-rates`, formData, {
        withCredentials: true,
      })
      .then(() => {
        alert("Update Successful");
        setLevel1("");
        setLevel2("");
        setLevel3("");
        setLevel4("");
        setLevel5("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit3 = (e) => {
    e.preventDefault();
    const formData = {
      level1: level1bet,
      level2: level2bet,
      level3: level3bet,
      level4: level4bet,
      level5: level5bet,
    };

    axios
      .put(`${domain}/commissionRates`, formData, { withCredentials: true })
      .then(() => {
        alert("Update Successful");
        setLevel1bet("");
        setLevel2bet("");
        setLevel3bet("");
        setLevel4bet("");
        setLevel5bet("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ width: "100%", mt: 4 }}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Typography variant="h3" align="center" gutterBottom color="#4782ff">
          Settings
        </Typography>

        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Update UPI / TRX Address
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="upi"
              label="UPI Address"
              name="upi"
              autoComplete="upi"
              autoFocus
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="trx"
              label="TRX"
              name="trx"
              autoComplete="trx"
              value={trx}
              onChange={(e) => setTrx(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ margin: "16px 0", display: "block", width: "100%" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                borderRadius: 2,
                bgcolor: "#4782ff",
                "&:hover": {
                  bgcolor: "#4782ff",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Paper>

        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Update Deposit Bonus Commission
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit2}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="level1"
              label="Level 1"
              name="level1"
              autoComplete="level1"
              value={level1}
              onChange={(e) => setLevel1(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level2"
              label="Level 2"
              name="level2"
              autoComplete="level2"
              value={level2}
              onChange={(e) => setLevel2(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level3"
              label="Level 3"
              name="level3"
              autoComplete="level3"
              value={level3}
              onChange={(e) => setLevel3(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level4"
              label="Level 4"
              name="level4"
              autoComplete="level4"
              value={level4}
              onChange={(e) => setLevel4(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level5"
              label="Level 5"
              name="level5"
              autoComplete="level5"
              value={level5}
              onChange={(e) => setLevel5(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                borderRadius: 2,
                bgcolor: "#4782ff",
                "&:hover": {
                  bgcolor: "#4782ff",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Paper>

        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Update Commission Rates
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit3}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="level1bet"
              label="Level 1"
              name="level1bet"
              autoComplete="level1bet"
              value={level1bet}
              onChange={(e) => setLevel1bet(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level2bet"
              label="Level 2"
              name="level2bet"
              autoComplete="level2bet"
              value={level2bet}
              onChange={(e) => setLevel2bet(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level3bet"
              label="Level 3"
              name="level3bet"
              autoComplete="level3bet"
              value={level3bet}
              onChange={(e) => setLevel3bet(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level4bet"
              label="Level 4"
              name="level4bet"
              autoComplete="level4bet"
              value={level4bet}
              onChange={(e) => setLevel4bet(e.target.value)}
              variant="outlined"
              // color="secondary"
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="level5bet"
              label="Level 5"
              name="level5bet"
              autoComplete="level5bet"
              value={level5bet}
              onChange={(e) => setLevel5bet(e.target.value)}
              variant="outlined"
              // color="secondary"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#4782ff",
                  },
                },
                marginBottom: { xs: "10px", sm: "0" },
              }}
              InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              InputLabelProps={{
                sx: {
                  "&.Mui-focused": {
                    color: "#4782ff", // Focused label color
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // color="secondary"
              sx={{
                mt: 2,
                borderRadius: 2,
                bgcolor: "#4782ff",
                "&:hover": {
                  bgcolor: "#4782ff",
                },
              }}
            >
              Update
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default SettingsMain;
