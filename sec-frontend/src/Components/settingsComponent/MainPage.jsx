import React, { useState, useEffect } from "react"
import "./MainPage.css"
import uidimg from "../../assets/uidimg.png"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import SettingBottomBox from "./settingBottom"
import lockimg from "../../assets/lock.png"
import mailBox from "../../assets/mail.png"
import googleVerification from "../../assets/googleValidation.png"
import update from "../../assets/version.png"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import modalimg from "../../assets/person.png"
import axios from "axios"
import Alert from "@mui/material/Alert"
import { domain } from "../config"
import { useNavigate } from "react-router-dom"
import { LockReset } from "@mui/icons-material"
import { DeleteSweep } from '@mui/icons-material';


function MainPage() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [openResetPassword, setOpenResetPassword] = useState(false)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)

  const [userData, setUserData] = useState(null)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Data-->", response.data);
        setUserData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
  }, []);

  const handleOpenResetPassword = () => {
    setOpenResetPassword(true)
  }

  const handleCloseResetPassword = () => {
    setOpenResetPassword(false)
  }
  const handleResetPassword = async (event) => {
    event.preventDefault()

    try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.post(
            `${domain}/ChangePassword`,
            { 
                oldPassword,
                newPassword,
            },
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.status === 200) {
            setAlertOpen(true)
            handleCloseResetPassword()
        }
    } catch (err) {
        console.error(err)
    }
}

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)
  const [openChangeUsername, setOpenChangeUsername] = useState(false)

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      console.log(response.data.user);
      setUsername(response.data.user.username);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleOpenChangeUsername = () => {
    setOpenChangeUsername(true)
  }

  const handleCloseChangeUsername = () => {
    setOpenChangeUsername(false)
  }

  const handleChangeUsername = async (event) => {
    event.preventDefault();
  
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.put(
        `${domain}/user/username`,
        {
          username,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setUserData({ ...userData, username }); // update the username in the local state
        handleCloseChangeUsername();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = () => {
    navigate("/avatar-change", { state: { avatar: user.avatar } });
  };


  // Add function near other handlers
const clearCache = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
    window.location.reload();
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
};

  return (

    <div className="settingpage-main-container">
      <div style={{
        backgroundColor:"#F95959",
        marginBottom:"20px"
      }}>
        <div className="settingpage-info">
          <div className="avatar">
          <div className="avatar-image">
  {console.log("Avatar URL:", user?.avatar)} {/* Debug logging */}
  <img 
    src={user?.avatar}
    alt="Profile Avatar"
    style={{
      width: '100px', // Set explicit dimensions
      height: '100px',
      objectFit: 'cover',
      borderRadius: '50%'
    }}
    onError={(e) => {
      console.error("Image load error:", e); // Debug logging
      e.target.onerror = null;
      e.target.src = '/assets/profile-1.png'; // Fallback image
    }}
    crossOrigin="anonymous" // Handle CORS
  />
</div>
            <div className="change-avatar">
              <span>Change Avatar</span>
              <KeyboardArrowRightIcon onClick={handleAvatarChange} />
            </div>
          </div>
          <div className="settingpage-name">
            <h4>Nickname</h4>
            <div className="name">
              <Button
                sx={{ color: "rgb(99, 99, 99)" }}
                
              >
                <span>{user ? username : "Loading..."}</span>
                <KeyboardArrowRightIcon />
              </Button>
            </div>

            <Dialog
  open={openResetPassword}
  onClose={handleCloseResetPassword}
  PaperProps={{
    component: "form",
    onSubmit: handleResetPassword,
    sx: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      minWidth: "400px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      p: 2
    },
  }}
  TransitionProps={{
    timeout: 500
  }}
>
  <DialogTitle sx={{ 
    color: "#1a237e",
    fontSize: "1.5rem",
    fontWeight: 600,
    textAlign: "center",
    pb: 1
  }}>
    <LockReset sx={{ mr: 1, color: "#4782ff" }} />
    Reset Password
  </DialogTitle>
  
  <DialogContent sx={{ px: 3 }}>
    <DialogContentText sx={{ 
      color: "#64748b",
      textAlign: "center",
      mb: 3 
    }}>
      Enter your old password and new password.
    </DialogContentText>

    <TextField
      autoFocus
      required
      margin="dense"
      id="oldPassword"
      name="oldPassword"
      label="Old Password"
      type="password"
      fullWidth
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          '& fieldset': {
            borderColor: '#e2e8f0',
          },
          '&:hover fieldset': {
            borderColor: '#4782ff',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4782ff',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#64748b',
          '&.Mui-focused': {
            color: '#4782ff',
          },
        },
      }}
    />

    <TextField
      required
      margin="dense"
      id="newPassword"
      name="newPassword"
      label="New Password"
      type="password"
      fullWidth
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          '& fieldset': {
            borderColor: '#e2e8f0',
          },
          '&:hover fieldset': {
            borderColor: '#4782ff',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4782ff',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#64748b',
          '&.Mui-focused': {
            color: '#4782ff',
          },
        },
      }}
    />
  </DialogContent>

  <DialogActions sx={{ 
    px: 3, 
    pb: 3, 
    justifyContent: 'center',
    gap: 2 
  }}>
    <Button 
      onClick={handleCloseResetPassword}
      variant="outlined"
      sx={{
        borderRadius: '10px',
        px: 3,
        py: 1,
        color: '#4782ff',
        borderColor: '#4782ff',
        '&:hover': {
          borderColor: '#3361d8',
          backgroundColor: 'rgba(71, 130, 255, 0.04)'
        }
      }}
    >
      Cancel
    </Button>
    <Button 
      type="submit"
      variant="contained"
      sx={{
        borderRadius: '10px',
        px: 3,
        py: 1,
        backgroundColor: '#F95959',
        '&:hover': {
          backgroundColor: '#3361d8'
        }
      }}
    >
      Change Password
    </Button>
  </DialogActions>
</Dialog>

            <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
              <Alert severity="success">Password changed successfully!</Alert>
            </Dialog>
          </div>

          <div className="settingpage-uid">
            <h4>UID</h4>
            <div className="uid">
              <span>{user && user.uid ? user.uid : "Loading..."}</span>
              <ContentCopyIcon sx={{ color: "white" }} />
            </div>
          </div>

        </div>
      </div>
      <div className="bottom-page">
        <div
          className="bottom-heading"
          style={{ textAlign: "left", color: "black",marginTop:"20px" }}
        >
          <h3>Safety Information</h3>
        </div>

        <Dialog
          open={openChangeUsername}
          onClose={handleCloseChangeUsername}
          PaperProps={{
            component: "form",
            onSubmit: handleChangeUsername,
            sx: {
              backgroundColor: "#ffffff",
              color: "black",
            },
          }}
        >
          <DialogTitle sx={{ color: "black" }}>Change Username</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "black" }}>
              Enter your new username.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="New Username"
              type="text"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "rgb(102,100,98)" },
                "& .MuiInputLabel-root": { color: "rgb(102,100,98)" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#4782ff", // Default outline color
                  },
                  "&:hover fieldset": {
                    borderColor: "#4782ff", // Outline color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4782ff", // Outline color when focused
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangeUsername} sx={{ color: "black" }}>
              Cancel
            </Button>
            <Button type="submit" sx={{ color: "black" }}>
              Change Username
            </Button>
          </DialogActions>
        </Dialog>

        <div className="bottom-box-container">
          <SettingBottomBox
            settingBottomImage="https://www.66lottery9.com/static/setting/editPswIcon.png"
            bottomBoxName="Login Password"
            bottomGoto="Edit"
            onClick={handleOpenResetPassword}
          />

          {/* <SettingBottomBox
            settingBottomImage={mailBox}
            bottomBoxName="Bind Mailbox"
            bottomGoto="Edit"
          /> */}

          {/* <SettingBottomBox
                        settingBottomImage={googleVerification}
                        bottomBoxName='Google Verification'
                        bottomGoto='Edit' /> */}

          <SettingBottomBox
            settingBottomImage="https://www.66lottery9.com/static/setting/versionUpdate.png"
            bottomBoxName="Updated Version"
            bottomGoto="1.0.1"
          />

<Button
  variant="contained"
  startIcon={<DeleteSweep />}
  onClick={clearCache}
  sx={{
    width: '100%',
    mt: 2,
    py: 1.5,
    backgroundColor: '#F95959',
    color: 'white',
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(71, 130, 255, 0.2)',
    '&:hover': {
      backgroundColor: '#F95959',
      boxShadow: '0 6px 16px rgba(71, 130, 255, 0.3)',
    }
  }}
>
  Clear Cache
</Button>
        </div>
      </div>
    </div>
  )
}

export default MainPage