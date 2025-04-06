import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Container,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { domain } from "../../Components/config";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4782ff",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#4782ff",
            },
            "&:hover fieldset": {
              borderColor: "#4782ff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4782ff",
            },
          },
        },
      },
    },
  },
});

function DummyUserMain() {
  // State for Create Dummy User
  const [dummyMobile, setDummyMobile] = useState("");
  const [dummyPassword, setDummyPassword] = useState("");
  const [loadingDummy, setLoadingDummy] = useState(false);
  const [successDummy, setSuccessDummy] = useState("");
  const [errorDummy, setErrorDummy] = useState("");

  // State for Create Role-Specific User
  const [roleMobile, setRoleMobile] = useState("");
  const [rolePassword, setRolePassword] = useState("");
  const [roleAccountType, setRoleAccountType] = useState("");
  const [loadingRole, setLoadingRole] = useState(false);
  const [successRole, setSuccessRole] = useState("");
  const [errorRole, setErrorRole] = useState("");

  // State for fetching users
  const [dummyUsers, setDummyUsers] = useState([]);
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // State for admin's invitation code
  const [adminInvitationCode, setAdminInvitationCode] = useState("");

  // State for tab selection
  const [tabValue, setTabValue] = useState(0);

  // Fetch admin user data to get invitationCode
  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
      });
      if (response.data.user) {
        setAdminInvitationCode(response.data.user.invitationCode);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setErrorRole("Failed to fetch admin data.");
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const dummyResponse = await axios.get(`${domain}/dummyusers`, {
        withCredentials: true,
      });
      if (dummyResponse.data.success) {
        setDummyUsers(dummyResponse.data.dummyUsers);
      }

      const roleResponse = await axios.get(`${domain}/filteredusers`, {
        withCredentials: true,
      });
      if (roleResponse.data.success) {
        setRoleUsers(roleResponse.data.filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorDummy("Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle Create Dummy User form submission
  const handleDummySubmit = async (e) => {
    e.preventDefault();
    setLoadingDummy(true);
    setSuccessDummy("");
    setErrorDummy("");

    try {
      const response = await axios.post(
        `${domain}/registerdummyuser`,
        { mobile: dummyMobile, password: dummyPassword },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuccessDummy("Dummy user created successfully!");
        setDummyMobile("");
        setDummyPassword("");
        fetchUsers(); // Refresh the list of users
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorDummy(error.response.data.msg);
      } else {
        setErrorDummy("An error occurred while creating the user.");
      }
    } finally {
      setLoadingDummy(false);
    }
  };

  // Handle Create Role-Specific User form submission
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoadingRole(true);
    setSuccessRole("");
    setErrorRole("");

    // Validate account type
    const allowedRoles = [
      "FinanceHead",
      "GameHead",
      "SettingsHead",
      "AdditionalHead",
      "SupportHead",
    ];
    if (!allowedRoles.includes(roleAccountType)) {
      setErrorRole("Invalid role selected.");
      setLoadingRole(false);
      return;
    }

    try {
      const payload = {
        mobile: roleMobile,
        password: rolePassword,
        invitecode: adminInvitationCode, // Automatically set invitecode
        accountType: roleAccountType,
      };

      const response = await axios.post(
        `${domain}/type/fuckyou`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessRole("Role-specific user created successfully!");
        setRoleMobile("");
        setRolePassword("");
        setRoleAccountType("");
        fetchUsers(); // Refresh the list of users
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorRole(error.response.data.msg);
      } else {
        setErrorRole("An error occurred while creating the user.");
      }
    } finally {
      setLoadingRole(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch admin data and users when component mounts
  useEffect(() => {
    fetchAdminData();
    fetchUsers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            textAlign="center"
            color="primary"
            fontWeight="bold"
          >
            User Management Dashboard
          </Typography>

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  Create Dummy User
                </Typography>
                <form onSubmit={handleDummySubmit}>
                  <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={dummyMobile}
                    onChange={(e) => setDummyMobile(e.target.value)}
                    required
                    type="number"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={dummyPassword}
                    onChange={(e) => setDummyPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loadingDummy}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {loadingDummy ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Dummy User"
                    )}
                  </Button>
                </form>
                {successDummy && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {successDummy}
                  </Alert>
                )}
                {errorDummy && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorDummy}
                  </Alert>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  Create Role-Specific User
                </Typography>
                <form onSubmit={handleRoleSubmit}>
                  <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={roleMobile}
                    onChange={(e) => setRoleMobile(e.target.value)}
                    required
                    type="number"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={rolePassword}
                    onChange={(e) => setRolePassword(e.target.value)}
                    required
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="account-type-label">
                      Account Type
                    </InputLabel>
                    <Select
                      labelId="account-type-label"
                      value={roleAccountType}
                      label="Account Type"
                      onChange={(e) => setRoleAccountType(e.target.value)}
                    >
                      <MenuItem value="FinanceHead">Finance Head</MenuItem>
                      <MenuItem value="GameHead">Game Head</MenuItem>
                      <MenuItem value="SettingsHead">Settings Head</MenuItem>
                      <MenuItem value="AdditionalHead">
                        Additional Head
                      </MenuItem>
                      <MenuItem value="SupportHead">Support Head</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loadingRole}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {loadingRole ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Role-Specific User"
                    )}
                  </Button>
                </form>
                {successRole && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {successRole}
                  </Alert>
                )}
                {errorRole && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorRole}
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Dummy Users" />
              <Tab label="Role-Specific Users" />
            </Tabs>

            {tabValue === 0 && (
              <>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Dummy Users List
                </Typography>
                {loadingUsers ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mobile Number</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Account Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dummyUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.mobile}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.accountType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}

            {tabValue === 1 && (
              <>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Role-Specific Users List
                </Typography>
                {loadingUsers ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mobile Number</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Account Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roleUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.mobile}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.accountType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}

            {errorDummy && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorDummy}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default DummyUserMain;
