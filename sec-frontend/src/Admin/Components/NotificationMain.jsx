import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import { domain } from "../../Components/config";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

function NotificationMain() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title: title,
      message: message,
    };

    try {
      const response = await axios.post(
        `${domain}/createNotification`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Notification created successfully",
          severity: "success",
        });
        setTitle("");
        setMessage("");
        fetchNotifications();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to create notification",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "An error occurred",
        severity: "error",
      });
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.common.black,
      fontWeight: theme.typography.fontWeightBold,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      whiteSpace: "pre-wrap",
      maxWidth: "300px",
      overflowWrap: "break-word",
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

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${domain}/notifications`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to fetch notifications",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching notifications",
        severity: "error",
      });
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(`${domain}/deletenotifications`, {
        data: { notificationId },
        withCredentials: true,
      });
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Notification deleted successfully",
          severity: "success",
        });
        setNotifications(
          notifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to delete notification",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the notification",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ minHeight: "85vh", backgroundColor: "whitesmoke" }}>
      <Box
        sx={{
          border: "1px solid #D9D9D9",
          margin: "0 auto",
          maxWidth: "1200px",
        }}
      >
        <Box
          component="main"
          sx={{ backgroundColor: "white", flexGrow: 2, p: 4 }}
        >
          <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column" }}>
            <Typography
              component="h1"
              variant="h5"
              align="left"
              sx={{ mt: 1, mb: 2, color: "#4782ff" }}
            >
              <b>Create Notification</b>
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      marginBottom: 2,
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
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
                    margin="normal"
                    required
                    fullWidth
                    id="message"
                    label="Message"
                    name="message"
                    autoComplete="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                      marginBottom: 2,
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#4782ff",
                        },
                      },
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
                <Grid item xs={2}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      height: "56px",
                      background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                      color: "white",
                      marginTop: "12px",
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
        </Box>
      </Box>
      <Box sx={{ mt: 6, backgroundColor: "white", p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, mt: 2, color: "#4782ff" }}
        >
          <b>View Notifications</b>
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table
            sx={{ minWidth: 650, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Serial No.</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Message</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification, index) => (
                <StyledTableRow key={notification._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{notification.title}</StyledTableCell>
                  <StyledTableCell>{notification.message}</StyledTableCell>
                  <StyledTableCell>
                    {notification.global ? "Global" : "User-specific"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(notification.date).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      onClick={() => handleDelete(notification._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default NotificationMain;
