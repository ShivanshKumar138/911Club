import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Container,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { domain } from "../../Components/config";

const AdminTaskControl = () => {
  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({ task: "", NumberOfSpin: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingWork, setEditingWork] = useState({
    task: "",
    NumberOfSpin: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winningAmount, setWinningAmount] = useState({
    section1: "",
    section2: "",
    section3: "",
    section4: "",
    section5: "",
    section6: "",
    section7: "",
    section8: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWinningAmount({
      section1: "",
      section2: "",
      section3: "",
      section4: "",
      section5: "",
      section6: "",
      section7: "",
      section8: "",
    });
  }, []);

  

  const handleOnChange = useCallback((section) => (e) => {
    setWinningAmount((prevWinningAmount) => ({
      ...prevWinningAmount,
      [section]: e.target.value,
    }));
  }, []);

  useEffect(() => {
    fetchWorks();
    fetchWinningAmount();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${domain}/getwork`);
      setWorks(response.data.work || []);
    } catch (error) {
      console.error("Error fetching works:", error);
      showSnackbar("Error fetching works", "error");
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWinningAmount = async () => {
    try {
      const response = await axios.get(`${domain}/getWinningAmount`);
      const fetchedWinningAmount = response.data.winningAmount || {};
      setWinningAmount(prevState => ({
        section1: fetchedWinningAmount.section1 || "",
        section2: fetchedWinningAmount.section2 || "",
        section3: fetchedWinningAmount.section3 || "",
        section4: fetchedWinningAmount.section4 || "",
        section5: fetchedWinningAmount.section5 || "",
        section6: fetchedWinningAmount.section6 || "",
        section7: fetchedWinningAmount.section7 || "",
        section8: fetchedWinningAmount.section8 || "",
      }));
    } catch (error) {
      console.error("Error fetching winning amount:", error);
      showSnackbar("Error fetching winning amount", "error");
    }
  };
  const handleAddWork = async () => {
    try {
      const workData = { work: [newWork] };
      await axios.post(`${domain}/addWork`, workData, {
        withCredentials: true,
      });
      showSnackbar("Work added successfully");
      setNewWork({ task: "", NumberOfSpin: "" });
      fetchWorks();
    } catch (error) {
      console.error("Error adding work:", error);
      showSnackbar(
        `Error adding work: ${error.response?.data?.error || error.message}`,
        "error"
      );
    }
  };

  const handleUpdateWork = async () => {
    try {
      await axios.put(`${domain}/updateWork/${editingIndex}`, {
        work: editingWork,
      });
      showSnackbar("Work updated successfully");
      setEditingIndex(null);
      setEditingWork({ task: "", NumberOfSpin: "" });
      fetchWorks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating work:", error);
      showSnackbar("Error updating work", "error");
    }
  };

  const handleDeleteWork = async (index) => {
    try {
      await axios.delete(`${domain}/deleteWork/${index}`);
      showSnackbar("Work deleted successfully");
      fetchWorks();
    } catch (error) {
      console.error("Error deleting work:", error);
      showSnackbar("Error deleting work", "error");
    }
  };

  const handleWinningAmountAction = async (action) => {
    try {
      let response;
      switch (action) {
        case "add":
          response = await axios.post(`${domain}/addWinningAmount`, {
            winningAmount,
          });
          break;
        case "update":
          response = await axios.put(`${domain}/updateWinningAmount`, {
            winningAmount,
          });
          break;
        case "delete":
          response = await axios.delete(`${domain}/deleteWinningAmount`);
          setWinningAmount({
            section1: "",
            section2: "",
            section3: "",
            section4: "",
            section5: "",
            section6: "",
            section7: "",
            section8: "",
          });
          break;
        default:
          throw new Error("Invalid action");
      }
      showSnackbar(`Winning amount ${action}d successfully`);
      if (action !== "delete") fetchWinningAmount();
    } catch (error) {
      console.error(`Error ${action}ing winning amount:`, error);
      showSnackbar(`Error ${action}ing winning amount`, "error");
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold", color: "#4782ff" }}
      >
        Admin Task Control
      </Typography>

      <Accordion sx={{ mb: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="instructions-content"
          id="instructions-header"
        >
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            <InfoIcon sx={{ mr: 1 }} /> Instructions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            How it works:
          </Typography>
          <ul>
            <li>The "Task" means the amount the user needs to deposit.</li>
            <li>Users get spins based on the amount they deposit.</li>
            <li>Sections 1 to 7 in the Winning Amount are numbers.</li>
            <li>
              Section 8 in the Winning Amount is a word or short phrase.(means
              you have to enter a text like: Better Luck Next TIme!!)
            </li>
          </ul>
          <Typography variant="body2" color="text.secondary">
            Example: If you set Task as 100 and Number of Spin as 5, it means
            when a user deposits 100, they get 5 spins.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Grid container spacing={4}>
        {/* Works Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Works
                <Tooltip title="Refresh Works">
                  <IconButton onClick={fetchWorks} size="small">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                  value={newWork.task}
                  onChange={(e) =>
                    setNewWork({ ...newWork, task: e.target.value })
                  }
                  label="Task Number"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <TextField
                  value={newWork.NumberOfSpin}
                  onChange={(e) =>
                    setNewWork({ ...newWork, NumberOfSpin: e.target.value })
                  }
                  label="Number of Spin"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddWork}
                  startIcon={<AddIcon />}
                  sx={{
                    background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                    "&:hover": { backgroundColor: "#0a4f12" },
                  }}
                >
                  Add
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress />
                </Box>
              ) : works.length > 0 ? (
                <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {works.map((work, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Task: ${work.task}`}
                        secondary={`Spins: ${work.NumberOfSpin}`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {
                              setEditingIndex(index);
                              setEditingWork(work);
                              setIsModalOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteWork(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No works available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Winning Amount Section */}
        <Grid item xs={12} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Winning Amount
                <Tooltip title="Refresh Winning Amount">
                  <IconButton onClick={fetchWinningAmount} size="small">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Grid container spacing={2}>
              {Object.keys(winningAmount).map((section, index) => (
  <Grid item xs={6} sm={3} key={section}>
    <TextField
      label={`Section ${index + 1}`}
      value={winningAmount[section]}
      onChange={handleOnChange(section)}
      variant="outlined"
      size="small"
      fullWidth
    />
  </Grid>
))}
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleWinningAmountAction("add")}
                sx={{
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  "&:hover": { backgroundColor: "#0a4f12" },
                  mr: 1,
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => handleWinningAmountAction("update")}
                sx={{
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  "&:hover": { backgroundColor: "#0a4f12" },
                  mr: 1,
                }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleWinningAmountAction("delete")}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog for editing work */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Edit Work</DialogTitle>
        <DialogContent>
          <TextField
            value={editingWork.task}
            onChange={(e) =>
              setEditingWork({ ...editingWork, task: e.target.value })
            }
            label="Task Number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            value={editingWork.NumberOfSpin}
            onChange={(e) =>
              setEditingWork({ ...editingWork, NumberOfSpin: e.target.value })
            }
            label="Number of Spin"
            variant="outlined"
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateWork}
            sx={{
              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
              color: "#fff",
              "&:hover": { backgroundColor: "#0a4f12" },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminTaskControl;