import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TablePagination,
  Grid,
  Typography,
} from "@mui/material";
import AdminPanel from "./Admin";
import { domain } from "../../Components/config";

function BankDetailsEdit() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBankDetails, setNewBankDetails] = useState({
    name: "",
    accountNo: "",
    ifscCode: "",
    mobile: "",
    bankName: "",
  });
  const [newTRXAddress, setNewTRXAddress] = useState("");
  const [dialogType, setDialogType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchMobile, setSearchMobile] = useState("");
  const [searchUID, setSearchUID] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${domain}/fetchuserdetails`, {
          withCredentials: true,
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleOpenDialog = (user, type) => {
    setSelectedUser(user);
    setDialogType(type);

    if (type === "bankDetails") {
      setNewBankDetails(
        user.bankDetails[0] || {
          name: "",
          accountNo: "",
          ifscCode: "",
          mobile: "",
          bankName: "",
        }
      );
    } else if (type === "TRXAddress") {
      setNewTRXAddress(user.TRXAddress[0] || "");
    }
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogType("");
  };

  const handleBankDetailsSubmit = async () => {
    try {
      await axios.put(
        `${domain}/users/${selectedUser._id}/update-details`,
        {
          bankDetails: [newBankDetails],
        },
        { withCredentials: true }
      );
      alert("Bank details updated successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating bank details", error);
      alert("Failed to update bank details");
    }
  };

  const handleTRXAddressSubmit = async () => {
    try {
      await axios.put(
        `${domain}/users/${selectedUser._id}/update-details`,
        {
          TRXAddress: [newTRXAddress],
        },
        { withCredentials: true }
      );
      alert("TRX Address updated successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating TRX Address", error);
      alert("Failed to update TRX Address");
    }
  };

  const handleSearch = () => {
    let filtered = users;

    // First, filter by mobile
    if (searchMobile) {
      filtered = filtered.filter((user) =>
        String(user.mobile || "").includes(searchMobile)
      );
    }

    // Then, filter by UID
    if (searchUID) {
      filtered = filtered.filter((user) =>
        String(user.uid || "").includes(searchUID)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleSearchByMobile = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchByUID = (e) => {
    setSearchUID(e.target.value);
  };

  useEffect(() => {
    handleSearch();
  }, [searchMobile, searchUID]); // Re-run the search whenever inputs change

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AdminPanel>
      <Typography variant="h4" gutterBottom sx={{ color: "#4782ff" }}>
        User Bank Details and TRX Address Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Search by Mobile"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchMobile}
            onChange={handleSearchByMobile}
            sx={{
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
            label="Search by UID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchUID}
            onChange={handleSearchByUID}
            sx={{
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
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>SL No</TableCell>{" "}
              {/* Serial Number Column */}
              <TableCell sx={{ fontWeight: "bold" }}>UID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Wallet Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bank Details</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TRX Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>{" "}
                  {/* Display SL Number */}
                  <TableCell>{user.uid}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{String(user.mobile)}</TableCell>
                  <TableCell>{user.walletAmount}</TableCell>
                  <TableCell>
                    {user.bankDetails.length > 0 ? (
                      user.bankDetails.map((bank, idx) => (
                        <div key={idx}>
                          <p>{bank.bankName}</p>
                          <p>{bank.accountNo}</p>
                        </div>
                      ))
                    ) : (
                      <p>No Bank Details</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.TRXAddress.length > 0
                      ? user.TRXAddress.join(", ")
                      : "No TRX Address"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      // color="primary"
                      onClick={() => handleOpenDialog(user, "bankDetails")}
                      style={{
                        marginRight: "10px",
                        background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                      }}
                    >
                      Update Bank Details
                    </Button>
                    <Button
                      variant="contained"
                      // color="secondary"
                      sx={{ bgcolor: "#37A24B" }}
                      onClick={() => handleOpenDialog(user, "TRXAddress")}
                    >
                      Update TRX Address
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for updating bank details */}
      <Dialog
        open={!!selectedUser && dialogType === "bankDetails"}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Update Bank Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Bank Name"
            fullWidth
            margin="normal"
            value={newBankDetails.bankName}
            onChange={(e) =>
              setNewBankDetails({ ...newBankDetails, bankName: e.target.value })
            }
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="normal"
            value={newBankDetails.accountNo}
            onChange={(e) =>
              setNewBankDetails({
                ...newBankDetails,
                accountNo: e.target.value,
              })
            }
          />
          <TextField
            label="IFSC Code"
            fullWidth
            margin="normal"
            value={newBankDetails.ifscCode}
            onChange={(e) =>
              setNewBankDetails({ ...newBankDetails, ifscCode: e.target.value })
            }
          />
          <TextField
            label="Mobile"
            fullWidth
            margin="normal"
            value={newBankDetails.mobile}
            onChange={(e) =>
              setNewBankDetails({ ...newBankDetails, mobile: e.target.value })
            }
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newBankDetails.name}
            onChange={(e) =>
              setNewBankDetails({ ...newBankDetails, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBankDetailsSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for updating TRX Address */}
      <Dialog
        open={!!selectedUser && dialogType === "TRXAddress"}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Update TRX Address</DialogTitle>
        <DialogContent>
          <TextField
            label="TRX Address"
            fullWidth
            margin="normal"
            value={newTRXAddress}
            onChange={(e) => setNewTRXAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleTRXAddressSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AdminPanel>
  );
}

export default BankDetailsEdit;
