import React, { useState, useCallback } from "react";
import {
  Grid,
  Button,
  IconButton,
  Drawer,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Modal,
  MenuItem,
} from "@mui/material";
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Translate as TranslateIcon,
  Flag as FlagIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { domain } from "../Components/config";
import PuzzleSlider from "../Components/PuzzleComponent";
import Mobile from "../Components/Mobile";
import { Divider } from "@mui/material";
import { InputAdornment, Select } from "@mui/material";
import { useEffect } from "react";

const countryCodes = [{ code: "+91", country: "India" }];

const Login = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("calling");
      console.log(localStorage.getItem("token"));
      login(localStorage.getItem("token"), false);
    }
  }, []);
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setOpenDrawer(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    console.log(domain);
    try {
      const response = await axios.post(`${domain}/login`, {
        mobile,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        const isAdmin =
          response.data.user.accountType === "Admin" ||
          response.data.user.accountType === "FinanceHead" ||
          response.data.user.accountType === "GameHead" ||
          response.data.user.accountType === "SettingsHead" ||
          response.data.user.accountType === "AdditionalHead" ||
          response.data.user.accountType === "SupportHead";
        localStorage.setItem("UserPhone", mobile);
        login(response.data.token, isAdmin);

        setShowPuzzle(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("An error occurred while logging in. Please try again");
      }
    }
  };

  const handlePuzzleSolved = useCallback(() => {
    setShowPuzzle(false);
    navigate("/");
  }, [navigate]);

  const handleRegister = () => {
    navigate("/register");
  };

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <Mobile>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#F95959",
          padding: "8px 16px",
          color: "black",
        }}
      >
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
            <span style={{ marginLeft: "8px", fontSize: "14px" }}>English</span>
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
          sx={{ padding: "10px" }}
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
          style={{ fontSize: "23px", fontWeight: 700, fontFamily: "helvetica" }}
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
          Login to your Account
        </Typography>

        <Button
          onClick={handleRegister}
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
            No Account ?
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
          <form onSubmit={handleEmailLogin}>
            {/* <Tabs
              value={tabValue}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)",
                  width: "50%",
                  textAlign: "center",
                },
              }}
            >
              <Tab
                sx={{ width: "50%" }}
                icon={
                  <SendToMobileIcon
                    style={{
                      color: tabValue === 0 ? "#F95959" : "grey",
                    }}
                  />
                }
                label="phone number"
                style={{ color: tabValue === 0 ? "#F95959" : "grey" }}
              />
              <Tab
                sx={{ width: "50%" }}
                icon={
                  <EmailIcon
                    style={{
                      color: tabValue === 1 ? "#F95959" : "grey",
                    }}
                  />
                }
                label="Email"
                style={{ color: tabValue === 1 ? "#F95959" : "grey" }}
              />
            </Tabs> */}
            <TabPanel value={tabValue} index={0}>
              <Box display="flex" alignItems="center" mt={2}>
                <img
                  src="https://www.66lottery9.com/static/login/cellphone.png"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
                <FormLabel
                  sx={{
                    marginLeft: "16px",
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontFamily: "helvetica",
                  }}
                >
                  Login in via phone number
                </FormLabel>
              </Box>
              <TextField
                label="Please enter a phone number"
                fullWidth
                variant="outlined"
                margin="normal"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Please enter a phone number"
                required
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
            </TabPanel>
            {/* <TabPanel value={tabValue} index={1}>
              <Box display="flex" alignItems="center" mt={2}>
                <EmailIcon sx={{ color: "#F95959" }} />
                <FormLabel sx={{ marginLeft: "10px", color: "black" }}>
                  Email
                </FormLabel>
              </Box>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffffff !important",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff !important",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "black",
                  },
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                }}
                InputProps={{
                  style: { borderRadius: "10px", color: "black" },
                }}
                InputLabelProps={{
                  style: { color: "black" },
                }}
              />
            </TabPanel> */}
            <Box display="flex" alignItems="center" mt={2}>
              <img
                src="https://www.66lottery9.com/static/login/password.png"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              />
              <FormLabel
                sx={{
                  color: "#666",
                  marginLeft: "16px",
                  fontSize: "15px",
                  fontWeight: 400,
                  fontFamily: "helvetica",
                }}
              >
                Password
              </FormLabel>
            </Box>
            <TextField
              label="Please enter Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "2px 0 20px",
              }}
            >
              <RadioGroup row style={{ color: "#666" }}>
                <FormControlLabel
                  value="remember"
                  control={<Radio style={{ color: "#666" }} />}
                  label={
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 400,
                        fontFamily: "helvetica",
                        color: "#666",
                      }}
                    >
                      Remember the Password
                    </Typography>
                  }
                  labelPlacement="end"
                />
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              style={{
                marginTop: "50px",
                marginBottom: "8px",
                background: "#F95959",
                borderRadius: "300px",
                fontSize: "19px",
                fontWeight: 700,
                fontFamily: "helvetica",
                maxWidth: "330px",
                margin: "50px auto 8px",
                padding: "8px 30px",
              }}
            >
              Log in
            </Button>
            <Button
              onClick={handleRegister}
              variant="outlined"
              color="primary"
              fullWidth
              style={{
                borderRadius: "300px",
                borderColor: "#F95959",
                maxWidth: "330px",
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
                Register now
              </span>
            </Button>
          </form>
        </Grid>

        <Grid container sx={{ position: "relative" }}>
          <Grid
            xs={6}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ padding: "16px", marginTop: "-40px", cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            <Typography
              variant="subtitle1"
              style={{
                color: "#666",
                marginBottom: "150px",
                fontSize: "13px",
                fontWeight: 400,
                fontFamily: "helvetica",
              }}
            >
              Forgot password?
            </Typography>
          </Grid>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              position: "absolute",
              left: "50%",
              height: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              marginTop: "-95px",
              backgroundColor: "#666",
            }}
          />

          <Grid
            xs={6}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ padding: "16px", marginTop: "-40px", cursor: "pointer" }}
            onClick={() => navigate("/service")}
          >
            <Typography
              variant="subtitle1"
              style={{
                color: "#666",
                marginBottom: "150px",
                fontSize: "13px",
                fontWeight: 400,
                fontFamily: "helvetica",
              }}
            >
              Customer Service
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={showPuzzle}
        onClose={() => setShowPuzzle(false)}
        aria-labelledby="puzzle-modal"
        aria-describedby="puzzle-to-complete-login"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            // p: 4,
            borderRadius: 2,
          }}
        >
          <PuzzleSlider onPuzzleSolved={handlePuzzleSolved} />
        </Box>
      </Modal>
    </Mobile>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

export default Login;
