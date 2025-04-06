import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  InputAdornment,
  Alert,
  Stack,
} from "@mui/material";
import Mobile from "../Components/Mobile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SubjectIcon from "@mui/icons-material/Subject";
import DescriptionIcon from "@mui/icons-material/Description";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SmsIcon from "@mui/icons-material/Sms";
import { useNavigate } from "react-router-dom";
import { domain } from "./config";

const priorities = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const predefinedSubjects = [
  "Deposit Not Receive",
  "Delete Bank Account",
  "IFSC Modification",
  "Bank Name Change",
  "Change ID Login Password",
  "Delete Old USDT Address and Rebind",
  "Retrieve Login ID Account",
  "Wingo 1Min Winstreak Bonus",
  "Other",
];

const RaiseTicketForm = ({
  onSubmit,
  error,
  success,
  formData,
  setFormData,
}) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "15px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      background: "linear-gradient(to bottom right, #f8f9ff, #e0e7ff)",
    }}
  >
    <Typography
      variant="h5"
      gutterBottom
      sx={{
        color: "#F95959",
        fontWeight: "bold",
        textAlign: "center",
        mb: 2,
      }}
    >
      Raise a New Ticket
    </Typography>
    {error && <Alert severity="error">{error}</Alert>}
    {success && <Alert severity="success">{success}</Alert>}
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <TextField
          select
          label="Subject"
          variant="outlined"
          fullWidth
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SubjectIcon sx={{ color: "#F95959" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              "& fieldset": {
                borderColor: "#F95959",
              },
              "&:hover fieldset": {
                borderColor: "#F95959",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#F95959",
              },
            },
          }}
        >
          {predefinedSubjects.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.subject === "Other" && (
        <Grid item xs={12}>
          <TextField
            label="Custom Subject"
            variant="outlined"
            fullWidth
            value={formData.customSubject}
            onChange={(e) =>
              setFormData({ ...formData, customSubject: e.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                background: "#fff",
                "& fieldset": {
                  borderColor: "#F95959",
                },
                "&:hover fieldset": {
                  borderColor: "#F95959",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#F95959",
                },
              },
            }}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon sx={{ color: "#F95959" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              "& fieldset": {
                borderColor: "#F95959",
              },
              "&:hover fieldset": {
                borderColor: "#F95959",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#F95959",
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Priority"
          variant="outlined"
          fullWidth
          select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PriorityHighIcon sx={{ color: "#F95959" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              "& fieldset": {
                borderColor: "#F95959",
              },
              "&:hover fieldset": {
                borderColor: "#F95959",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#F95959",
              },
            },
          }}
        >
          {priorities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Initial Message"
          variant="outlined"
          multiline
          rows={2}
          fullWidth
          value={formData.initialMessage}
          onChange={(e) =>
            setFormData({ ...formData, initialMessage: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SmsIcon sx={{ color: "#F95959" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              background: "#fff",
              "& fieldset": {
                borderColor: "#F95959",
              },
              "&:hover fieldset": {
                borderColor: "#F95959",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#F95959",
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          sx={{
            borderRadius: "30px",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(to right, #F95959, #F95959)",
            boxShadow: "0px 4px 15px #F95959",
            "&:hover": {
              background: "linear-gradient(to right, #F95959, #F95959)",
              boxShadow: "0px 6px 20px #F95959",
            },
          }}
        >
          Submit Ticket
        </Button>
      </Grid>
    </Grid>
  </Paper>
);


const ViewTickets = ({ tickets }) => {
  const navigate = useNavigate();

  const handleChatClick = (ticketId) => {
    navigate(`/chat/${ticketId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {tickets.map((ticket) => (
        <Paper
          key={ticket._id}
          // elevation={3}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            // boxShadow: 6,
            backgroundColor: '#ffffff',
            // transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
            // border: `1px solid #F95959`,
            '&:hover': {
              // boxShadow: 8,
              borderColor: '#F95959',
            },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 'bold',
                color: '#F95959',
                textAlign: 'left',
              }}
            >
              {ticket.subject}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: '#333',
                textAlign: 'left',
              }}
            >
              {ticket.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#F95959',
                textAlign: 'left',
              }}
            >
              <strong>Status:</strong> {ticket.status}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#F95959',
                textAlign: 'left',
              }}
            >
              <strong>Priority:</strong> {ticket.priority}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                textAlign: 'left',
              }}
            >
              <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
            </Typography>
            <Button
              variant="contained"
              sx={{
                alignSelf: 'flex-start',
                mt: 2,
                textTransform:"initial",
                backgroundColor: '#F95959',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#F95959',
                },
              }}
              onClick={() => handleChatClick(ticket._id)}
            >
              Chat Zone
            </Button>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

const ActivityMain = () => {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    subject: "",
    customSubject: "",
    description: "",
    priority: "",
    initialMessage: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tickets, setTickets] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    const { subject, customSubject, description, priority, initialMessage } =
      formData;

    if (!subject || !description || !priority || !initialMessage) {
      setError("All fields are required.");
      return;
    }

    if (subject === "Other" && !customSubject) {
      setError("Please provide a custom subject.");
      return;
    }

    const finalSubject = subject === "Other" ? customSubject : subject;

    try {
      const token = "your_token_here";
      const response = await axios.post(
        `${domain}/tickets/raise`,
        {
          ...formData,
          subject: finalSubject,
        },
        {
          withCredentials: true, // Include credentials with the request
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token in the header
          },
        }
      );
      setSuccess(response.data.message);
      setFormData({
        subject: "",
        customSubject: "",
        description: "",
        priority: "",
        initialMessage: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Server error. Could not raise the ticket."
      );
    }
  };

  const fetchTickets = async () => {
    try {
      const token = "your_token_here"; // Replace with your actual token
      const response = await axios.get(`${domain}/tickets/user`, {
        withCredentials: true, // Include credentials with the request
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token in the header
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    if (value === 1) {
      fetchTickets();
    }
  }, [value]);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#f2f2f1" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", // Green theme color
                padding: "8px 16px",
                color: "#ffffff", // White text color for contrast
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    sx={{ color: "#ffffff", ml: -5 }}
                    onClick={handleBackClick}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff", // White text color
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                      textTransform: "initial", // Reset text transformation
                    }}
                  >
                    Support
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ width: "100%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                sx={{
                  bgcolor: "", // Light green background for Tabs
                  color: "#F95959", // Dark green text color
                  "& .MuiTabs-indicator": {
                    bgcolor: "#F95959", // Green indicator for active tab
                  },
                }}
              >
                <Tab
                  label="Raise Ticket"
                  sx={{
                    color: "#F95959", // Dark green text color for Tab
                    "&.Mui-selected": {
                      color: "#F95959", // White text color when selected
                      // bgcolor: "#F95959", // Dark green background when selected
                    },
                  }}
                />
                <Tab
                  label="View Tickets"
                  sx={{
                    color: "#F95959", // Dark green text color for Tab
                    "&.Mui-selected": {
                      color: "#F95959", // White text color when selected
                      // bgcolor: "#F95959", // Dark green background when selected
                    },
                  }}
                />
              </Tabs>
              <Box sx={{ p: 2 }}>
                {value === 0 && (
                  <RaiseTicketForm
                    onSubmit={handleSubmit}
                    error={error}
                    success={success}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
                {value === 1 && <ViewTickets tickets={tickets} />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityMain;
