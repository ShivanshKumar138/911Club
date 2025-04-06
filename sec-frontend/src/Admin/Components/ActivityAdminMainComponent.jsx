import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  Stack,
  Container,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { domain } from "../../Components/config";

// Set withCredentials for every Axios request globally
axios.defaults.withCredentials = true;

const ActivityAdminMainComponent = () => {
  const [settings, setSettings] = useState([]);
  const [minBettingAmount, setMinBettingAmount] = useState("");
  const [activityAward, setActivityAward] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch existing settings from API
  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${domain}/api/activity-reward-settings`
      );
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle form submission for creating/updating
  const handleSubmit = async () => {
    const newSetting = {
      minimumBettingAmount: parseFloat(minBettingAmount),
      activityAward: parseFloat(activityAward),
    };

    try {
      if (isEditing) {
        await axios.put(
          `${domain}/api/activity-reward-settings/${editingId}`,
          newSetting
        );
        setIsEditing(false);
        setEditingId(null);
      } else {
        await axios.post(`${domain}/api/activity-reward-settings`, newSetting);
      }
      setMinBettingAmount("");
      setActivityAward("");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Handle delete setting
  const handleDelete = async () => {
    try {
      await axios.delete(`${domain}/api/activity-reward-settings/${deleteId}`);
      setDeleteId(null);
      setOpenDialog(false);
      fetchSettings();
    } catch (error) {
      console.error("Error deleting setting:", error);
    }
  };

  // Handle edit setting
  const handleEdit = (setting) => {
    setMinBettingAmount(setting.minimumBettingAmount);
    setActivityAward(setting.activityAward);
    setEditingId(setting._id);
    setIsEditing(true);
  };

  // Handle opening delete dialog
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  // Handle closing delete dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" color="#4782ff" gutterBottom sx={{ mb: 4 }}>
          Manage Activity Reward Settings
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              fullWidth
              label="Minimum Betting Amount"
              variant="outlined"
              value={minBettingAmount}
              onChange={(e) => setMinBettingAmount(e.target.value)}
              type="number"
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#4782ff !important", // Initial border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#4782ff !important", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4782ff !important", // Border color when focused
                  },
                },
                "& .MuiInputBase-input": {
                  color: "black", // Text color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#4782ff", // Label color on focus
                },
              }}
            />
            <TextField
              fullWidth
              label="Activity Award"
              variant="outlined"
              value={activityAward}
              onChange={(e) => setActivityAward(e.target.value)}
              type="number"
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#4782ff !important", // Border color when focused
                  },
                },
                "& .MuiInputBase-input": {
                  color: "black", // Text color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#4782ff", // Label color on focus
                },
              }}
            />
            <Button
              variant="contained"
              // color="primary"
              onClick={handleSubmit}
              sx={{ height: 55, bgcolor: "#4782ff" }}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </Stack>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center">Sl. No.</TableCell>
                <TableCell align="center">Minimum Betting Amount</TableCell>
                <TableCell align="center">Activity Award</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.length > 0 ? (
                settings.map((setting, index) => (
                  <TableRow key={setting._id} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {setting.minimumBettingAmount}
                    </TableCell>
                    <TableCell align="center">
                      {setting.activityAward}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        // color="primary"
                        sx={{ color: "#4782ff"}}
                        onClick={() => handleEdit(setting)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(setting._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No settings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this setting? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActivityAdminMainComponent;