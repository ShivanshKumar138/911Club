import React, { useState, useEffect } from "react";
import Mobile from "../Components/Mobile";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TranslateIcon from "@mui/icons-material/Translate";
import FlagIcon from "@mui/icons-material/Flag";
import ReactCountryFlag from "react-country-flag";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { RadioGroup, FormControlLabel, Radio, MenuItem } from "@mui/material";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { setLogLevel, LogLevel } from "@firebase/logger";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { domain } from "../Components/config";
import { InputAdornment } from "@mui/material";
import { Select } from "@mui/material";

const countryCodes = [{ code: "+91", country: "India" }];

const Register = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setOpenDrawer(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { login } = useAuth();
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [countryCode, setCountryCode] = useState("+91");
  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };
  const navigate = useNavigate();
  // Email registration states

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialInviteCode = query.get("invitecode");
  const [otp, setOtp] = useState("");
  const [mobile, setEmail] = useState("");
  const [email, setEmai] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitecode, setInviteCode] = useState(initialInviteCode || "");
  const [phone, setPhone] = useState("");

  const handleEmailRegister = async (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (mobile === "" || password === "" || password !== confirmPassword) {
      alert(
        "Please make sure all fields are filled out and the passwords match."
      );
      return;
    }

    if (invitecode === "") {
      alert("Please enter invite code");
      return;
    }

    try {
      const registerData = {
        mobile: mobile,
        password: password,
        invitecode: invitecode, // Always include invitecode since it's required
      };

      const response = await axios.post(`${domain}/fuckyou/`, registerData);

      if (response.data.success) {
        login(response.data.token);
        console.log(response);
        alert("Registration complete.");
        navigate("/");
      } else if (response.data.msg === "User already exists") {
        alert(response.data.msg);
      } else {
        alert("An error occurred while creating your account.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert(
          "An error occurred while creating your account. Please try again"
        );
      }
    }
  };

  const [serverOtp, setServerOtp] = useState("");
  const handlePhoneRegister = async (e) => {
    const phoneNumber = `${phone}`; // Removed countryCode and replace function
    console.log(phoneNumber);

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!phoneNumber.trim() || !email.trim()) {
      alert("Please enter a valid phone number and email.");
      return;
    }

    try {
      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpString = otp.toString(); // Convert OTP to a string
      setServerOtp(otpString); // Save the OTP string to verify later

      // Send the OTP to the user's phone number using Fast2SMS
      await axios({
        method: "post",
        url: "https://abclottery.shop/sendOtp", // Send requests to your new server
        data: {
          sender_id: "FSTSMS",
          message: otpString, // Use the OTP string
          language: "english",
          route: "otp",
          numbers: phoneNumber,
          variables_values: otpString,
        },
      });
      alert("OTP sent to your phone number. Please verify it.");
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the OTP. Please try again.");
    }
  };
  const handleOtpVerification = async () => {
    if (otp !== "" && otp === serverOtp) {
      alert(
        "OTP verified successfully. You can now proceed with registration."
      );
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();
    if (otp !== "" && otp === serverOtp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const referralLink = `${window.location.origin}/register?ref=${userCredential.user.uid}`; // Generate a unique referral link
        const username = `MEMBER${nanoid(6)}`; // Replace 6 with the number of characters you want after "MEMBER"
        const UID = Math.floor(1000000 + Math.random() * 9000000); // Generate a unique 7-digit number
        const referralUid = new URLSearchParams(window.location.search).get(
          "ref"
        );

        const newInviteCode = `INVITE${nanoid(6)}`; // Generate a unique invite code

        let walletAmount = 0;
        if (invitecode !== "") {
          alert("Applying invite code...");
          const sharedUserDoc = await getDocs(
            query(
              collection(db, "users"),
              where("invitationCode", "==", invitecode)
            )
          );
          await Promise.all(
            sharedUserDoc.docs.map(async (docSnapshot) => {
              const user = docSnapshot.data();
              const userRef = doc(db, "users", docSnapshot.id);
              await updateDoc(userRef, {
                wallet: user.wallet + 50, //Add 50 to the sharer's wallet
              });
            })
          );

          walletAmount = 20; //Add 20 to new user's wallet for using invite code.
          alert("Invite code applied.");
        }
        await setDoc(doc(db, "users", userCredential.user.uid), {
          phone: phone,
          email: email,
          invitationCode: newInviteCode,
          username: username,
          UID: UID,
          referralLink: referralLink,
          referral: referralUid,
        });

        alert("Account setup complete.");
        navigate("/");
      } catch (err) {
        console.error(err);
        alert(
          "An error occurred while creating your account. Please try again."
        );
      }
    } else {
      alert("Please verify OTP before proceeding with registration.");
    }
  };

  setLogLevel(LogLevel.DEBUG);

  const handleLogin = async () => {
    navigate("/login");
  };

  const handleRedirect = () => {
    navigate(-1);
  };
  useEffect(() => {
    // Get the invite code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCodeFromUrl = urlParams.get("ref"); // Changed 'inviteCode' to 'ref'

    // If there's an invite code in the URL, set it in the state
    if (inviteCodeFromUrl) {
      setInviteCode(inviteCodeFromUrl);
    }
  }, []);
  return (
    <div>
      <Mobile>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
            background: "#F95959",
            padding: "8px 16px",
            color: "#666",
          }}
        >
          <div id="recaptcha-container"></div>
          <Grid item xs={4} textAlign="left">
            <IconButton sx={{ color: "white" }} onClick={handleRedirect}>
              <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <img
              src="assets/genzwinlogo.png"
              alt="logo"
              style={{ width: "120px", height: "40px" }}
            />
          </Grid>
          <Grid item xs={4} textAlign="right">
            <IconButton
              onClick={() => setOpenDrawer(true)}
              sx={{
                color: "white",
                borderRadius: "20px",
              }}
            >
              <img
                src="/assets/banners/us.svg"
                alt="US flag"
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <span style={{ marginLeft: "8px", fontSize: "14px" }}>
                English
              </span>
            </IconButton>
          </Grid>
        </Grid>
        <Drawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            sx={{ padding: "16px" }}
          >
            <Button onClick={() => handleLanguageSelect("EN")}>
              <ReactCountryFlag countryCode="US" svg />
              EN
            </Button>
            <Button onClick={() => handleLanguageSelect("HN")}>
              <ReactCountryFlag countryCode="IN" svg />
              HN
            </Button>
          </Grid>
        </Drawer>

        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
            background: "#F95959",
            padding: "16px",
            color: "white",
            minHeight: "195px",
            position: "relative",
            overflow: "hidden",
          }}
          direction="column"
        >
          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              right: "-20px",
              top: "-60px",
              fontSize: "246px",
              fontWeight: 400,
              fontFamily: "serif",
              opacity: 0.1,
              color: "white",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            747
          </Typography>

          <Typography
            variant="h5"
            style={{
              fontSize: "23px",
              fontWeight: 700,
              fontFamily: "helvetica",
            }}
          >
            747 Lottery
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              marginTop: "35px",
              fontWeight: "700",
              fontSize: "1.3rem",
            }}
          >
            Create your account
          </Typography>

          <Button
            onClick={handleLogin}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              color: "#F95959",
              cursor: "pointer",
              textTransform: "none",
              textDecoration: "underline",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold" }}>
              i have account
            </span>
          </Button>
        </Grid>

        <Grid
          container
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{
            backgroundColor: "rgb(254,250,249)",
            padding: "16px",
            color: "white",
            minHeight: "fit-content",
            position: "relative",
            bottom: "27px",
            borderRadius: "2rem 2rem 0 0",
            boxShadow: "0 -4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Grid item xs={12} sx={{ marginBottom: "50px" }}>
            <form
              onSubmit={
                tabValue === 0 ? handleEmailRegister : handleRegistration
              }
            >
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: tabValue === 0 ? "#F95959" : "grey",
                    },
                  }}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Tab
                    icon={
                      <SendToMobileIcon
                        style={{
                          color: tabValue === 0 ? "#F95959" : "grey",
                        }}
                      />
                    }
                    label="Register With Mobile"
                    style={{ color: tabValue === 0 ? "#F95959" : "grey" }}
                  /> */}
              {/* Uncomment and update this Tab if needed
        <Tab
          icon={<PhoneIcon style={{ color: tabValue === 1 ? 'rgb(42,50,112)' : 'grey' }} />}
          label="Register Your Phone"
          style={{ color: tabValue === 1 ? '#FF7172' : 'grey' }}
        />
        */}
              {/* </Tabs>
              </Box> */}

              <TabPanel value={tabValue} index={0}>
                <Box display="flex" alignItems="center" mt={2}>
                  {/* <SendToMobileIcon sx={{ color: "#F95959" }} /> */}
                  {/* <SendToMobileIcon sx={{ color: "#4782ff" }} />
                   */}
                  <img
                    src="https://www.66lottery9.com/static/login/cellphone.png"
                    style={{ width: "25px" }}
                  />
                  <FormLabel
                    sx={{
                      color: "#666",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontFamily: "helvetica",
                    }}
                  >
                    Register via Mobile Number
                  </FormLabel>
                </Box>

                <TextField
                  label="Please enter phone number"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Please enter phone number"
                  sx={{
                    backgroundColor: "rgb(255,255,255)",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      "& fieldset": {
                        borderColor: "rgb(255,255,255) !important",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgb(71,129,255) !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgb(71,129,255) !important",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#666",
                      "&.Mui-focused": {
                        color: "rgb(71,129,255)",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#999",
                      opacity: 1,
                    },
                  }}
                  InputProps={{
                    style: { borderRadius: "10px", color: "#666" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          variant="standard"
                          disableUnderline
                          sx={{
                            width: "80px",
                            "& .MuiSelect-select": {
                              color: "#666",
                              padding: "0 5px",
                            },
                            "& .MuiSelect-icon": {
                              color: "#666",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: "rgb(255,255,255)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                "& .MuiMenuItem-root": {
                                  color: "#666",
                                  "&:hover": {
                                    backgroundColor: "rgba(71,129,255,0.1)",
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {countryCodes.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                              {item.code}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#666",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontFamily: "helvetica",
                    },
                    shrink: true,
                  }}
                />

                <Box
                  alignItems="center"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    fontSize: "0.1rem",
                  }}
                ></Box>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box display="flex" alignItems="center">
                  <EmailIcon sx={{ color: "#ffffff" }} />
                  <FormLabel sx={{ color: "#666" }}>Mobile No</FormLabel>
                </Box>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={mobile}
                  onChange={(e) => mobile(e.target.value)}
                  required
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#F95959 !important", // Initial border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#F95959 !important", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F95959 !important", // Border color when focused
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#666", // Text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Label color
                    },
                  }}
                  InputProps={{
                    style: { borderRadius: "10px", color: "#666" },
                  }}
                  InputLabelProps={{
                    style: { color: "#666" },
                  }}
                />

                <Box display="flex" alignItems="center" mt={2}>
                  {/* <PhoneIcon sx={{ color: "#ffffff" }} /> */}
                  <FormLabel
                    sx={{
                      color: "#666",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontFamily: "helvetica",
                    }}
                  >
                    Phone Number
                  </FormLabel>
                </Box>
                <TextField
                  label="Phone"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{
                    backgroundColor: "rgb(255,255,255)",
                    borderRadius: "10px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "45px",
                      "& fieldset": {
                        borderColor: "rgb(255,255,255) !important",
                      },
                      "&:hover fieldset": {
                        borderColor: "#F95959 !important",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F95959 !important",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      top: "50%",
                      transform: "translate(14px, -50%)",
                      "&.Mui-focused, &.MuiInputLabel-shrink": {
                        transform: "translate(14px, -140%) scale(0.75)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#666",
                      padding: "0 14px",
                    },
                  }}
                  InputProps={{
                    style: { borderRadius: "10px", color: "#666" },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#666",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontFamily: "helvetica",
                    },
                  }}
                />

                <Box display="flex" alignItems="center" mt={2}>
                  <LockIcon sx={{ color: "#F95959" }} />
                  <FormLabel sx={{ color: "#666" }}>Enter OTP</FormLabel>
                </Box>
                <TextField
                  label="OTP"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#F95959 !important", // Initial border color with increased specificity
                      },
                      "&:hover fieldset": {
                        borderColor: "#F95959 !important", // Border color on hover with increased specificity
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#F95959 !important", // Border color when focused with increased specificity
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#666", // Text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#666", // Label color
                    },
                  }}
                  InputProps={{
                    style: { borderRadius: "10px", color: "#666" },
                  }}
                  InputLabelProps={{
                    style: { color: "#666" },
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePhoneRegister}
                >
                  Send OTP
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOtpVerification}
                >
                  Verify OTP
                </Button>
              </TabPanel>

              <Box display="flex" alignItems="center">
                {/* <LockIcon sx={{ color: "#F95959" }} /> */}
                {/* <LockIcon sx={{ color: "#4782ff" }} />
                 */}
                <img
                  src="https://www.66lottery9.com/static/login/password.png"
                  style={{ width: "25px" }}
                />
                <FormLabel
                  sx={{
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  }}
                >
                  Set Password
                </FormLabel>
              </Box>
              <TextField
                label="Please enter password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                sx={{
                  backgroundColor: "rgb(255,255,255)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    "& fieldset": {
                      borderColor: "rgb(255,255,255) !important",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    top: "50%",
                    transform: "translate(14px, -50%)",
                    "&.Mui-focused, &.MuiInputLabel-shrink": {
                      transform: "translate(14px, -140%) scale(0.75)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#666",
                    padding: "0 14px",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#666" },
                  endAdornment: (
                    <IconButton
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{ color: "rgb(214,214,214)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: {
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  },
                }}
              />
              <Box
                alignItems="center"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  fontSize: "0.1rem",
                }}
              ></Box>

              <Box display="flex" alignItems="center">
                {/* <LockIcon sx={{ color: "#F95959" }} /> */}
                {/* <LockIcon sx={{ color: "#4782ff" }} /> */}
                <img
                  src="https://www.66lottery9.com/static/login/password.png"
                  style={{ width: "25px" }}
                />
                <FormLabel
                  sx={{
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  }}
                >
                  Confirm Password
                </FormLabel>
              </Box>

              <TextField
                label="Please enter confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{
                  backgroundColor: "rgb(255,255,255)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    "& fieldset": {
                      borderColor: "rgb(255,255,255) !important",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    top: "50%",
                    transform: "translate(14px, -50%)",
                    "&.Mui-focused, &.MuiInputLabel-shrink": {
                      transform: "translate(14px, -140%) scale(0.75)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#666",
                    padding: "0 14px",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "#666" },
                  endAdornment: (
                    <IconButton
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{ color: "rgb(214,214,214)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: {
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  },
                }}
              />
              {/* 
              <Box display="flex" alignItems="center" mt={2}>
                <LockIcon sx={{ color: "#F95959" }} />
                <FormLabel sx={{ color: "white" }}>Confirm Password</FormLabel>
              </Box>
              <TextField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#F95959", // Initial border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#F95959", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#F95959", // Border color when focused
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "white" },
                  endAdornment: (
                    <IconButton
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "white" },
                }}
              /> */}

              <Box display="flex" alignItems="center" mt={2}>
                {/* <MoveToInboxIcon sx={{ color: "#F95959" }} /> */}
                {/* <MoveToInboxIcon sx={{ color: "#4782ff" }} /> */}
                <img
                  src="https://www.66lottery9.com/static/login/invitation.png"
                  style={{ width: "25px" }}
                />
                <FormLabel
                  sx={{
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  }}
                >
                  Invitation Code
                </FormLabel>
              </Box>
              <TextField
                label="Please enter invitation code"
                value={invitecode}
                onChange={(e) => setInviteCode(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  style: { borderRadius: "10px", color: "#666" },
                }}
                InputLabelProps={{
                  style: {
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  },
                }}
                sx={{
                  backgroundColor: "rgb(255,255,255)",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    "& fieldset": {
                      borderColor: "rgb(255,255,255) !important",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(71,129,255) !important",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    top: "50%",
                    transform: "translate(14px, -50%)",
                    "&.Mui-focused, &.MuiInputLabel-shrink": {
                      transform: "translate(14px, -140%) scale(0.75)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#666",
                    padding: "0 14px",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RadioGroup row>
                  <FormControlLabel
                    value="remember"
                    control={
                      <Radio
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          fontFamily: "helvetica",
                          color: "#666",
                          textTransform: "lowercase",
                        }}
                      />
                    }
                    label="I have Read and Agree "
                    labelPlacement="end"
                    sx={{ color: "#666" }}
                  />
                </RadioGroup>
              </Box>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                style={{
                  marginBottom: "8px",
                  background: "#F95959",
                  borderRadius: "300px",
                  fontSize: "19px",
                  fontWeight: 700,
                  fontFamily: "helvetica",
                  maxWidth: "330px",

                  padding: "8px 30px",
                }}
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "18px", // Replace with the desired royal gold color if different
                }}
              >
                Register
              </Button>
              <Button
                onClick={handleLogin}
                variant="outlined"
                color="primary"
                fullWidth
                style={{
                  borderRadius: "300px",
                  borderColor: "#F95959",
                  marginBottom: "150px",
                  maxWidth: "330px",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    color: "#F95959",
                    marginLeft: "3px",
                    fontSize: "19px",
                    fontWeight: 600,
                    fontFamily: "helvetica",
                  }}
                >
                  {" "}
                  LOGIN
                </span>
              </Button>
            </form>
          </Grid>
        </Grid>
      </Mobile>
    </div>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

export default Register;
