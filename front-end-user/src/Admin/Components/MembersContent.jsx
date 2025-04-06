import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Badge,
  IconButton,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { domain } from "../../Components/config";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#4782ff",
    },
  },
  typography: {
    fontWeightBold: 700,
  },
});

const MembersContent = () => {
  const [users, setUsers] = useState([]);
  const [lockedUsers, setLockedUsers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("mobile");
  const [showSearchForm, setShowSearchForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(`${domain}/fetchuserdetails`, { withCredentials: true })
      .then((res) => {
        const allUsers = res.data.users;
        setUsers(allUsers.filter((user) => !user.locked));
        setLockedUsers(allUsers.filter((user) => user.locked));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLockUser = (mobile) => {
    axios
      .delete(`${domain}/deleteuser`, {
        data: { mobile: mobile },
        withCredentials: true,
      })
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error locking user:", error);
      });
  };

  const handleUnlockUser = (mobile) => {
    axios
      .put(
        `${domain}/unlockuser`,
        { mobile: mobile },
        { withCredentials: true }
      )
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Error unlocking user:", error);
      });
  };

  const handleProfile = (_id) => {
    navigate(`/profile/${_id}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "Sr No",
      width: 130,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "username",
      headerName: "Username",
      width: 220,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 220,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "uid",
      headerName: "UID",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "walletAmount",
      headerName: "Wallet Amount",
      width: 130,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "plainPassword",
      headerName: "Password",
      width: 130,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 240,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const onLockClick = () => {
          handleLockUser(params.row.mobile);
        };

        const onUnlockClick = () => {
          handleUnlockUser(params.row.mobile);
        };

        const onProfileClick = () => {
          handleProfile(params.row._id);
        };

        return (
          <Box>
            {tabIndex === 0 ? (
              <Button
                variant="contained"
                onClick={onLockClick}
                sx={{
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Lock Up
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={onUnlockClick}
                sx={{
                  background:
                    "linear-gradient(90deg, #32CD32 30%, #3CB371 90%)",
                  color: "white",
                }}
              >
                Unlock
              </Button>
            )}
            <Button
              variant="contained"
              onClick={onProfileClick}
              sx={{
                marginLeft: "10px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Profile
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      fetchUsers();
    } else {
      const filteredUsers = users.filter((user) =>
        user[searchType]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      const filteredLockedUsers = lockedUsers.filter((user) =>
        user[searchType]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
      setLockedUsers(filteredLockedUsers);
    }
  };

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  const handleReload = () => {
    fetchUsers();
    setSearchTerm("");
    setSearchType("mobile");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 3,
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            fontWeight: "bold",
            mb: 3,
            color: "#4782ff",
          }}
        >
          User Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab
              label={
                <Badge badgeContent={users.length} color="primary">
                  Unlock Users
                </Badge>
              }
              sx={{ mx: 2 }}
            />
            <Tab
              label={
                <Badge badgeContent={lockedUsers.length} color="secondary">
                  Locked Users
                </Badge>
              }
              sx={{ mx: 2 }}
            />
          </Tabs>
          <IconButton onClick={toggleSearchForm} color="primary">
            <SearchIcon />
          </IconButton>
        </Box>
        {showSearchForm && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 120, mr: 2 }}
            >
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                label="Search By"
              >
                <MenuItem value="mobile">Mobile</MenuItem>
                <MenuItem value="uid">UID</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search user by ${searchType}`}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                width: "60%",
                mr: 2,
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                },
                marginBottom: { xs: "10px", sm: "0" },
              }}
            />
            <IconButton onClick={handleSearch} color="primary">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleReload} color="primary">
              <RefreshIcon />
            </IconButton>
          </Box>
        )}
        <Paper
          elevation={3}
          sx={{ boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={(tabIndex === 0 ? users : lockedUsers).map(
                (user, index) => ({
                  ...user,
                  id: index + 1,
                })
              )}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={{
                backgroundColor: "white",
                "& .super-app-theme--header": {
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default MembersContent;
