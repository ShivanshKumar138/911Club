import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Container,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Mobile from "../Components/Mobile";
import { useBank } from "./BankContext";

const banks = [
  "Bank of Baroda",
  "Union Bank of India",
  "Central Bank of India",
  "Yes Bank",
  "HDFC Bank",
  "Karnataka Bank",
  "Standard Chartered Bank",
  "IDBI Bank",
  "Bank of India",
  "Punjab National Bank",
  "ICICI Bank",
  "Canara Bank",
  "Kotak Mahindra Bank",
  "State Bank of India",
  "Indian Bank",
  "Axis Bank",
  "Syndicate Bank",
  "Citibank India"
];

function ChooseBank() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [customBank, setCustomBank] = useState("");
  const navigate = useNavigate();
  const bankContext = useBank();

  if (!bankContext) {
    console.error(
      "Bank context is undefined. Make sure ChooseBank is wrapped in BankProvider."
    );
    return <Typography>Error: Bank context not available</Typography>;
  }

  const { setSelectedBank } = bankContext;

  const filteredBanks = banks.filter((bank) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankClick = (bank) => {
    if (setSelectedBank) {
      setSelectedBank(bank);
      navigate(-1);
    } else {
      console.error("setSelectedBank is undefined");
    }
  };

  const handleCustomBankSubmit = () => {
    if (setSelectedBank) {
      setSelectedBank(customBank);
      navigate(-1);
      setCustomBank(""); // Clear the custom bank name after submission
      setOpenDialog(false); // Close the dialog
    } else {
      console.error("setSelectedBank is undefined");
    }
  };

  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(var(--vh, 1vh) * 150)"
        position="relative"
        sx={{ backgroundColor: "#f2f2f1" }}
      >
        <Box flexGrow={1}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#ffffff",
              padding: "5px 0",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "black", marginRight: "1rem" }}
                onClick={() => navigate(-1)}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                  flexGrow: 1,
                  textAlign: "center",
                  fontSize: "1.2rem",
                }}
              >
                Choose a bank
              </Typography>
            </Grid>
            <Grid item xs={2} />
          </Grid>

          <Box sx={{ padding: "0px", backgroundColor: "#ffffff" }}>
            <TextField
              fullWidth
              variant="filled"
              placeholder="Search bank"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#4782ff" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Container sx={{ flexGrow: 1, overflowY: "auto", padding: "12px" }}>
            <Box sx={{ backgroundColor: "#ffffff", borderRadius: "4px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
              <Typography variant="subtitle1" sx={{ padding: "16px", color: "#757575" }}>
                Choose a bank
              </Typography>
              <List>
                {filteredBanks.map((bank) => (
                  <ListItem
                    button
                    key={bank}
                    onClick={() => handleBankClick(bank)}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <ListItemText 
                      primary={bank} 
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: bank === "FEDERAL BANK" ? "#1976d2" : "inherit",
                        },
                      }}
                    />
                  </ListItem>
                ))}
                <ListItem
                  button
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <ListItemText primary="Other" />
                </ListItem>
              </List>
            </Box>
          </Container>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Enter Custom Bank Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Bank Name"
                type="text"
                fullWidth
                variant="outlined"
                value={customBank}
                onChange={(e) => setCustomBank(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleCustomBankSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Mobile>
  );
}

export default ChooseBank;