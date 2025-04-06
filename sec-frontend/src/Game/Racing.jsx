// import React, { useState, useEffect, useRef } from 'react';
// import IconButton from "@mui/material/IconButton";
// import Mobile from "../Components/Mobile";
// import { Typography, Grid, Box, TextField, Checkbox} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
// import { Button } from "@mui/material";
// import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
// import WhatshotIcon from "@mui/icons-material/Whatshot";
// import NoteIcon from "@mui/icons-material/Note";
// import { Tabs, Tab } from "@mui/material";
// import { Drawer } from "@mui/material";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import { CSSTransition } from "react-transition-group";
// import { useNavigate } from "react-router-dom";
// import VolumeUpIcon from "@mui/icons-material/VolumeUp";
// import { FormControlLabel, Radio } from "@mui/material";
// // import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import { DialogActions} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import {

//   DialogTitle,

// } from '@mui/material';

// import {
//     Table,
//     TableCell,
//     TableRow,
//     TableBody,
//     TableContainer,
//   } from "@mui/material";
//   import Accordion from "@mui/material/Accordion";
//   import AccordionSummary from "@mui/material/AccordionSummary";
//   import AccordionDetails from "@mui/material/AccordionDetails";
//   import RowVisualization from "./Row";
//   import CustomTable from "./Visualize";
//   import { Snackbar } from "@mui/material";
//   import MuiAlert from "@mui/material/Alert";
//   import { ButtonGroup, styled } from "@mui/material";
//   import { domain } from "../Components/config";
//   import { wssdomain } from "../Components/config";
//   import MusicOffIcon from "@material-ui/icons/MusicOff";
//   import Play from "./Play";
//   import useMediaQuery from "@mui/material/useMediaQuery";
//   import { useTheme } from "@mui/material/styles";
//   // import icon from "../../public/games/assets/Clock.png"
//   import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
//   import AddIcon from "@mui/icons-material/AddBox";
//   import { CheckCircleIcon } from "lucide-react";
//   import { useCallback } from "react";
//   import Alert from '@mui/material/Alert';
//   import axios from 'axios';

// const countdownSound = new Audio("/assets/sound.mp3");
// countdownSound.loop = true;

// const RacingGame = () => {
//   // Race mode options
//   const raceModes = {
//     '30s': { minutes: 0, seconds: 30, label: 'Racing 30S' },
//     '1min': { minutes: 1, seconds: 0, label: 'Racing 1Min' },
//     '3min': { minutes: 3, seconds: 0, label: 'Racing 3Min' },
//     '5min': { minutes: 5, seconds: 0, label: 'Racing 5Min' }
//   };

//   const [selectedMode, setSelectedMode] = useState('30s');
//   const [timeRemaining, setTimeRemaining] = useState(raceModes[selectedMode]);
//   const [isRacing, setIsRacing] = useState(false);
//   const [isSoundOn, setIsSoundOn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [accountType, setAccountType] = useState("Normal");
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState(""); // Store message here
//   const [inProp, setInProp] = React.useState(false);
//   const [index, setIndex] = React.useState(0);
//     const [modalOpen, setModalOpen] = useState(false);

//   const [carPositions, setCarPositions] = useState({
//     1: 85, 2: 85, 3: 85, 4: 85, 5: 85,
//     6: 85, 7: 85, 8: 85, 9: 85, 10: 85
//   });
//   const [winner, setWinner] = useState(null);
//   const [period, setPeriod] = useState('2503071394');
//   const [periodId,setPeriodId]=useState(0)
//   const finishLine = 10; // Percentage of track width where finish line is (now on the left)

//   // Define car image paths
//   const carImages = {
//     1: 'https://tc9987.com/zhibo/pk/img/car1.png',
//     2: 'https://tc9987.com/zhibo/pk/img/car2.png',
//     3: 'https://tc9987.com/zhibo/pk/img/car3.png',
//     4: 'https://tc9987.com/zhibo/pk/img/car4.png',
//     5: 'https://tc9987.com/zhibo/pk/img/car5.png',
//     6: 'https://tc9987.com/zhibo/pk/img/car6.png',
//     7: 'https://tc9987.com/zhibo/pk/img/car7.png',
//     8: 'https://tc9987.com/zhibo/pk/img/car8.png',
//     9: 'https://tc9987.com/zhibo/pk/img/car9.png',
//     10: 'https://tc9987.com/zhibo/pk/img/car10.png'
//   };

//   // Car colors for UI elements
//   const carColors = {
//     1: 'bg-yellow-400',
//     2: 'bg-gray-300',
//     3: 'bg-gray-400',
//     4: 'bg-orange-400',
//     5: 'bg-green-400',
//     6: 'bg-blue-500',
//     7: 'bg-gray-500',
//     8: 'bg-red-400',
//     9: 'bg-red-600',
//     10: 'bg-purple-500'
//   };

//   // Handle race mode selection
//   const selectRaceMode = (mode) => {
//     if (!isRacing) {
//       setSelectedMode(mode);
//       setTimeRemaining(raceModes[mode]);
//       resetRace();
//     }
//   };

//   // Reset the race - updated to use 85% for initial positions
//   const resetRace = () => {
//     setCarPositions({
//       1: 85, 2: 85, 3: 85, 4: 85, 5: 85,
//       6: 85, 7: 85, 8: 85, 9: 85, 10: 85,
//     });
//     setWinner(null);
//   };

//   // Start the countdown timer
//   useEffect(() => {
//     if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
//       setIsRacing(true);
//       return;
//     }

//     const timer = setTimeout(() => {
//       if (timeRemaining.seconds === 0) {
//         setTimeRemaining({ minutes: timeRemaining.minutes - 1, seconds: 59 });
//       } else {
//         setTimeRemaining({ ...timeRemaining, seconds: timeRemaining.seconds - 1 });
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeRemaining]);

//   // Handle the racing animation
//   useEffect(() => {
//     if (!isRacing) return;

//     let animationId;
//     let raceCompleted = false;

//     const updateRace = () => {
//       setCarPositions(prevPositions => {
//         const newPositions = { ...prevPositions };
//         let someoneWon = false;

//         // Move each car by a random amount (now decreasing the value to move from right to left)
//         Object.keys(newPositions).forEach(carNumber => {
//           // Random speed between 0.2 and 0.8
//           const speed = 0.2 + Math.random() * 0.6;
//           newPositions[carNumber] -= speed; // Subtract to move left

//           // Check if any car has crossed the finish line (now checking for position <= finishLine)
//           if (newPositions[carNumber] <= finishLine && !raceCompleted) {
//             someoneWon = true;
//             setWinner(parseInt(carNumber));
//             raceCompleted = true;
//           }
//         });

//         // If someone won, stop the animation
//         if (someoneWon) {
//           setTimeout(() => {
//             // Reset for a new race
//             setTimeRemaining(raceModes[selectedMode]);
//             setIsRacing(false);
//             setPeriod(prev => (parseInt(prev) + 1).toString());
//             resetRace();
//           }, 3000);
//         }

//         return newPositions;
//       });

//       if (!raceCompleted) {
//         animationId = requestAnimationFrame(updateRace);
//       }
//     };

//     animationId = requestAnimationFrame(updateRace);
//     return () => cancelAnimationFrame(animationId);
//   }, [isRacing, selectedMode]);

//   const [activeTab, setActiveTab] = useState(0);

//   // Function to handle tab click
//   const handleTabClick = (tabIndex) => {
//     setActiveTab(tabIndex);
//   };

//   //code from head

//   const fetchUserData = async () => {

//     try {
//       const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
//       const response = await axios.get(`${domain}/user`, {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("User is----->",response.data.user)
//       setAccountType(response.data.user.accountType);
//       setUser(response.data.user);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//       fetchUserData();
//     }, [user]);

// const handleRefresh = () => {
//         // Handle refresh logic
//         fetchUserData();
//         setSnackbarMessage("Wallet refreshed"); // Set message
//         setSnackbarOpen(true);  // Open snackbar

//         setTimeout(() => {
//           setSnackbarOpen(false);
//         }, 1000)
//       };

//     const toggleSound = () => {
//       setIsSoundOn(!isSoundOn);
//     };

//     const handleSnackbarCloser = (event, reason) => {
//         if (reason === "clickaway") {
//             return;
//         }
//         setSnackbarOpen(false);
//     };
//   // Changed initial car positions to 85% so they're visible on the right side

//   const navigate=useNavigate();
//   const navigateToPage = () => {
//     navigate("/home"); // Replace '/path-to-page' with the actual path
//   };

//   const navigateToPage1 = () => {
//     navigate("/recharge"); // Replace '/path-to-page' with the actual path
//   };

//   const navigateToPage2 = () => {
//     navigate("/withdraw"); // Replace '/path-to-page' with the actual path
//   };

//     const textArray = [
//       "We are excited to welcome you to 747 Lottery , where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 747 Lottery . Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
//       "24/7 Live support on 747 Lottery  club ",
//       "747 Lottery  club welcomes you here !!",
//     ];

//     React.useEffect(() => {
//       const timer = setInterval(() => {
//         setInProp(false);

//         setTimeout(() => {
//           setIndex((oldIndex) => {
//             return (oldIndex + 1) % textArray.length;
//           });
//           setInProp(true);
//         }, 500); // This should be equal to the exit duration below
//       }, 3000); // Duration between changing texts

//       return () => clearInterval(timer);
//     }, []);

//   const pinBallImages=[
//     {1:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball01.png"},
//     {2:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball02.png"},
//     {3:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball03.png"},
//     {4:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball04.png"},
//     {5:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball05.png"},
//     {6:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball06.png"},
//     {7:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball07.png"},
//     {8:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball08.png"},
//     {9:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball09.png"},
//     {10:"https://in.piccdn123.com/static/_template_/orange/img/speed_pinball10.png"},
//   ]

//     const handleOpenModal = useCallback(() => {
//       setModalOpen(true);
//     }, []);

//     const handleCloseModal = useCallback(() => {
//         setModalOpen(false);
//       }, []);

//   return (
//     <Mobile>
//     <div className="max-w-xl mx-auto bg-gray-100  overflow-hidden">
//       {/* Header */}
//       <Grid
//             container
//             alignItems="center"
//             justifyContent="space-between"
//             sx={{
//               position: "sticky",
//               top: 0,
//               zIndex: 5000,
//               background: "#F95959",
//               padding: "2px 4px",
//               color: "white",
//             }}
//           >
//             <Grid item xs={3} textAlign="left">
//               <IconButton style={{ color: "white" }} onClick={navigateToPage}>
//                 <ArrowBackIosNewIcon />
//               </IconButton>
//             </Grid>
//             <Grid item xs={6} textAlign="center">
//               <img
//                 src="/assets/genzwinlogo.png"
//                 alt="logo"
//                 style={{ width: "140px", height: "48px" }}
//               />
//             </Grid>
//             <Grid item xs={3} textAlign="right">
//               <IconButton style={{ color: "white" }}>
//                 <SupportAgentIcon onClick={()=>navigate("/service")}/>
//               </IconButton>

//               <IconButton
//                 style={{ color: "white" }}
//                 onClick={() => setIsSoundOn(!isSoundOn)}
//               >
//                 {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
//               </IconButton>
//             </Grid>
//           </Grid>

//          <Grid
//   container
//   direction="column"
//   sx={{
//     height: { xs: "auto", sm: "285px" }, // Adjust height responsively
//     maxWidth: { xs: "100%", sm: "400px", md: "500px" }, // Control maximum width at different breakpoints
//     width: "100%", // Use full available width
//     margin: "0 auto", // Center the grid horizontally
//     background: "#F95959",
//     borderRadius: { xs: "0 0 40px 40px", sm: "0 0 70px 70px" }, // Smaller radius on mobile
//     textAlign: "center",
//   }}
// >
//   <Grid
//     sx={{
//       backgroundImage: `url("../../games/assets/walletbg.png")`,
//       backgroundSize: "cover",
//       backgroundColor: "#ffffff",
//       backgroundPosition: "center",
//       margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
//       borderRadius: { xs: "20px", sm: "30px" }, // Smaller radius on mobile
//       padding: { xs: "8px", sm: "10px" }, // Smaller padding on mobile
//       marginTop: { xs: "8px", sm: "10px" }, // Smaller margin on mobile
//     }}
//   >
//     <Grid
//       sm={12}
//       item
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "black",
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
//         {user ? user.walletAmount.toFixed(2) : " Loading"}
//       </Typography>
//       <IconButton sx={{ color: "black", padding: { xs: "6px", sm: "8px" } }}>
//         <Refresh onClick={handleRefresh} />
//       </IconButton>
//       {snackbarOpen && (
//     <Box
//         sx={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: 1500,
//             backgroundColor: "rgba(0,0,0,0.6)", // Optional overlay background
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//             height: "100%"
//         }}
//     >
//         <Alert
//             severity={snackbarMessage.includes("Failed") ? "error" : "success"}
//             onClose={handleSnackbarCloser}
//             style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
//             sx={{
//                 width: "fit-content",
//                 maxWidth: "90%",
//                 padding: "10px 20px",
//                 fontSize: "1rem",
//                 opacity:"0.6"
//             }}
//         >
//             {snackbarMessage}
//         </Alert>
//     </Box>
// )}

//     </Grid>

//     <Grid
//       sm={12}
//       item
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         color: "black",
//       }}
//     >
//       <AccountBalanceWallet
//         sx={{ marginRight: "10px", color: "#F95959", fontSize: { xs: "1rem", sm: "1.25rem" } }}
//       />
//       <Typography variant="subtitle2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//         Wallet Balance
//       </Typography>
//     </Grid>
//     <Grid
//       sm={12}
//       mt={{ xs: 2, sm: 3 }}
//       item
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}
//     >
//       <Button
//         variant="filled"
//         onClick={navigateToPage2}
//         sx={{
//           width: { xs: "110px", sm: "130px" }, // Smaller on mobile
//           marginLeft: { xs: "5px", sm: "10px" },
//           color: "white",
//           backgroundColor: "rgb(250,90,91)",
//           "&:hover": {
//             backgroundColor: "#D23838",
//           },
//           borderColor: "#D23838",
//           borderRadius: "50px",
//           fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
//           padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
//         }}
//       >
//         Withdraw
//       </Button>
//       <Button
//         variant="contained"
//         onClick={navigateToPage1}
//         sx={{
//           width: { xs: "110px", sm: "130px" }, // Smaller on mobile
//           marginLeft: { xs: "5px", sm: "10px" },
//           backgroundColor: "rgb(24,183,97)",
//           "&:hover": {
//             backgroundColor: "#17B15E",
//           },
//           borderRadius: "50px",
//           fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
//           padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
//         }}
//       >
//         Deposit
//       </Button>
//     </Grid>
//   </Grid>

//   <Grid
//     item
//     sx={{
//       backgroundColor: "#ffffff",
//       borderRadius: { xs: "15px", sm: "20px" }, // Smaller radius on mobile
//       width: { xs: "calc(100% - 20px)", sm: "90%" }, // Calculate width based on available space
//       padding: { xs: "0 3px", sm: "0 5px" }, // Less padding on mobile
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       overflow: "hidden",
//       margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
//     }}
//   >
//     <IconButton sx={{ padding: { xs: "6px", sm: "8px" } }}>
//       <VolumeUpIcon sx={{ color: "#F95959", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
//     </IconButton>

//     <Box sx={{ flex: 1, overflow: "hidden", padding: { xs: "0 6px", sm: "0 10px" } }}>
//       <CSSTransition
//         in={inProp}
//         timeout={500}
//         classNames="message"
//         unmountOnExit
//       >
//         <Typography
//           sx={{
//             color: "#8c90a6",
//             fontSize: { xs: "11px", sm: "12.8px" }, // Smaller text on mobile
//             display: "-webkit-box",
//             WebkitBoxOrient: "vertical",
//             textAlign: "left",
//             overflow: "hidden",
//             WebkitLineClamp: 2,
//             lineClamp: 2,
//             textOverflow: "ellipsis",
//           }}
//         >
//           {textArray[index]}
//         </Typography>
//       </CSSTransition>
//     </Box>

//     <Button
//       variant="contained"
//       sx={{
//         background: "rgb(253,106,25)",
//         "&:hover": {
//           background: "rgb(253,106,25)",
//         },
//         borderRadius: "50px",
//         fontSize: { xs: "10px", sm: "11px" }, // Smaller text on mobile
//         textTransform: "initial",
//         padding: { xs: "3px 10px", sm: "4px 12px" }, // Smaller padding on mobile
//         color: "#ffffff",
//       }}
//     >
//       Details
//     </Button>
//   </Grid>
// </Grid>

//       {/* Game modes */}
//       <div className="p-4 flex gap-2">
//         <div
//           className={`bg-white rounded-lg p-3 flex-1 ${selectedMode === '30s' ? 'border-2 border-orange-500' : ''}`}
//           onClick={() => selectRaceMode('30s')}
//         >
//           <div className="rounded-full h-16 w-16 bg-orange-200 flex items-center justify-center mx-auto">
//             <div className={`rounded-full h-12 w-12 ${selectedMode === '30s' ? 'bg-orange-500' : 'bg-gray-400'} flex items-center justify-center`}>
//               <span className="text-white">30S</span>
//             </div>
//           </div>
//           <div className={`text-center mt-2 ${selectedMode === '30s' ? 'text-orange-500' : 'text-gray-500'}`}>Racing 30S</div>
//         </div>

//         <div
//           className={`bg-white rounded-lg p-3 flex-1 ${selectedMode === '1min' ? 'border-2 border-orange-500' : ''}`}
//           onClick={() => selectRaceMode('1min')}
//         >
//           <div className="rounded-full h-16 w-16 bg-gray-200 flex items-center justify-center mx-auto">
//             <div className={`rounded-full h-12 w-12 ${selectedMode === '1min' ? 'bg-orange-500' : 'bg-gray-400'} flex items-center justify-center`}>
//               <span className="text-white">1M</span>
//             </div>
//           </div>
//           <div className={`text-center mt-2 ${selectedMode === '1min' ? 'text-orange-500' : 'text-gray-500'}`}>Racing 1Min</div>
//         </div>

//         <div
//           className={`bg-white rounded-lg p-3 flex-1 ${selectedMode === '3min' ? 'border-2 border-orange-500' : ''}`}
//           onClick={() => selectRaceMode('3min')}
//         >
//           <div className="rounded-full h-16 w-16 bg-gray-200 flex items-center justify-center mx-auto">
//             <div className={`rounded-full h-12 w-12 ${selectedMode === '3min' ? 'bg-orange-500' : 'bg-gray-400'} flex items-center justify-center`}>
//               <span className="text-white">3M</span>
//             </div>
//           </div>
//           <div className={`text-center mt-2 ${selectedMode === '3min' ? 'text-orange-500' : 'text-gray-500'}`}>Racing 3Min</div>
//         </div>

//         <div
//           className={`bg-white rounded-lg p-3 flex-1 ${selectedMode === '5min' ? 'border-2 border-orange-500' : ''}`}
//           onClick={() => selectRaceMode('5min')}
//         >
//           <div className="rounded-full h-16 w-16 bg-gray-200 flex items-center justify-center mx-auto">
//             <div className={`rounded-full h-12 w-12 ${selectedMode === '5min' ? 'bg-orange-500' : 'bg-gray-400'} flex items-center justify-center`}>
//               <span className="text-white">5M</span>
//             </div>
//           </div>
//           <div className={`text-center mt-2 ${selectedMode === '5min' ? 'text-orange-500' : 'text-gray-500'}`}>Racing 5Min</div>
//         </div>
//       </div>

//       {/* Timer section */}
//       {/* <div className="bg-orange-500 text-white p-4 mx-4 rounded-lg">
//         <div className="flex justify-between items-center">
//           <div>
//             <div className="text-sm">Period</div>
//             <div className="text-xl font-bold">{period}</div>
//           </div>

//           <div className="text-right">
//             <div className="text-sm">Time remaining</div>
//             <div className="flex gap-1 items-center mt-1">
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {Math.floor(timeRemaining.minutes / 10)}
//               </div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {timeRemaining.minutes % 10}
//               </div>
//               <div className="text-white text-2xl font-bold">:</div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {Math.floor(timeRemaining.seconds / 10)}
//               </div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {timeRemaining.seconds % 10}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

// <Grid
//       container
//       spacing={0}
//       mt={3}
//       sx={{
//         height:"105px",
//         maxWidth: "90%",
//         margin: "auto",
//         background: "#F95959",
//         borderRadius: "15px",
//         padding: "3px",
//         display: "flex",
//         alignItems: "center",
//         position: "relative",

//       }}
//     >
//       {/* Top Cut-Out Circle */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: "-10px",
//           left: "50%",
//           width: "20px",
//           height: "20px",
//           backgroundColor: "rgb(242,242,241)",
//           borderRadius: "50%",
//           transform: "translateX(-50%)",
//         }}
//       />

//       {/* Bottom Cut-Out Circle */}
//       <Box
//         sx={{
//           position: "absolute",
//           bottom: "-10px",
//           left: "50%",
//           width: "20px",
//           height: "20px",
//           backgroundColor: "rgb(242,242,241)",
//           borderRadius: "50%",
//           transform: "translateX(-50%)",
//         }}
//       />

//       {/* Left Side - How to Play & Winning Numbers */}
//       <Grid
//         item
//         xs={6}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "flex-start",
//           paddingLeft: "2%",
//         }}
//       >
//         {/* "How to Play" Button */}
//         <>
//       <Button
//         variant="outlined"
//         size="small"
//         sx={{
//           width: "150px",
//           color: "white",
//           borderColor: "white",
//           padding: "2px 8px",
//           textTransform: "initial",
//           borderRadius: "20px",
//           fontSize: "10px",
//           display: "flex",
//           alignItems: "center",
//         }}
//         startIcon={<NoteIcon />}
//         onClick={handleOpenModal}
//         disableRipple={false}
//         disableTouchRipple={false}
//       >
//         How to play
//       </Button>

//       {/* Only render the modal when it's actually open */}
//       {modalOpen && (
//         <GameRulesModal open={modalOpen} handleClose={handleCloseModal} />
//       )}
//     </>
//         {/* Win Timer Text */}
//         <Typography variant="caption" sx={{ color: "white", mt: 0 }}>
//           {`Racing Go ${0}`}
//         </Typography>
//       </Grid>

//       {/* Dashed Divider */}
//       <Box
//         sx={{
//           position: "absolute",
//           height: "80%",
//           width: "0px",
//           // background: "white",
//           left: "50%",
//           transform: "translateX(-50%)",
//           borderLeft: "3px dotted rgba(243, 227, 227, 0.86)",
//           marginLeft: "1px",
//         }}
//       />

//       {/* Right Side - Timer */}
//       <Grid
//   item
//   xs={6}
//   sx={{
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     paddingLeft:"15%",
//     paddingRight: "4%",
//     width: "100%", // Ensure full width
//   }}
// >
//   {/* "Time Remaining" Label */}
//   <Typography variant="caption" sx={{ color: "white",fontWeight:"300px" }}>
//     Time remaining
//   </Typography>

//   {/* Countdown Timer */}
//   {/* <Box sx={{ display: "flex", mt: 0, justifyContent: "flex-end", width: "100%",paddingLeft:4 }}>
//     {[minutes[0], minutes[1], ":", seconds[0], seconds[1]].map((char, index) => (
//       <Box
//         key={index}
//         sx={{
//           width: "22px",
//           height: "30px",
//           backgroundColor: char === ":" ? "#f2f2f1" : "#f2f2f1",
//           color: "#000",
//           fontWeight: "bold",
//           textAlign: "center",
//           lineHeight: "30px",
//           margin: "0 2px",
//           fontSize: "18px",
//         }}
//       >
//         {char}
//       </Box>
//     ))}
//   </Box> */}

// <div className="text-right">
//             <div className="text-sm">Time remaining</div>
//             <div className="flex gap-1 items-center mt-1">
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {Math.floor(timeRemaining.minutes / 10)}
//               </div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {timeRemaining.minutes % 10}
//               </div>
//               <div className="text-white text-2xl font-bold">:</div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {Math.floor(timeRemaining.seconds / 10)}
//               </div>
//               <div className="bg-white text-orange-500 w-8 h-10 flex items-center justify-center rounded font-bold text-2xl">
//                 {timeRemaining.seconds % 10}
//               </div>
//             </div>
// </div>

//   {/* Period ID */}
//   <Typography variant="caption" sx={{ color: "white", fontSize: "14px", mt: 1 }}>
//     {periodId ? periodId : ""}
//   </Typography>
// </Grid>

//     </Grid>

//       {/* Racing track - FIXED HEIGHT AND POSITIONING */}
//       <div className="mt-2 bg-gray-900 relative">
//         <div className="flex justify-between text-white p-2">
//           <div>{raceModes[selectedMode].label}</div>
//           <div className="flex gap-1">
//             <span className="rounded-full w-6 h-6 bg-gray-300 flex items-center justify-center text-gray-900">2</span>
//             <span className="rounded-full w-6 h-6 bg-blue-500 flex items-center justify-center text-white">6</span>
//             <span className="rounded-full w-6 h-6 bg-red-600 flex items-center justify-center text-white">9</span>
//             <span className="ml-4">Per. {parseInt(period) - 1}</span>
//           </div>
//         </div>

//         {/* Race track background - CORRECTED ORDER */}
//         <div className="relative h-60 overflow-hidden">
//           {/* Road background - MOVED TO BOTTOM WITH LOWER Z-INDEX */}
//           <div
//             className="absolute bottom-0 left-0 right-0"
//             style={{
//               backgroundImage: 'url(https://tc9987.com/zhibo/pk/img/road.jpg)',
//               backgroundSize: 'cover',
//               height: '75%',
//               zIndex: 1
//             }}
//           ></div>

//           {/* Sky background with landmarks - MOVED TO TOP WITH HIGHER Z-INDEX */}
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: 'url(https://tc9987.com/zhibo/pk/img/scenery.jpg)',
//               backgroundSize: 'cover',
//               height: '24%',
//               zIndex: 2
//             }}
//           ></div>

//           {/* Track lanes - added for better visualization */}
//           <div className="absolute bottom-0 left-0 right-0 z-3" style={{ height: '45%' }}>
//             {[...Array(10)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-full h-5.5 border-b border-dashed border-gray-600"
//                 style={{ bottom: `${i * 3 + 3}%` }}
//               ></div>
//             ))}
//           </div>

//           {/* Traffic light - INCREASED Z-INDEX */}
//           <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 bg-black p-2 rounded-lg flex gap-1 z-20">
//             <div className={`w-8 h-8 rounded-full ${isRacing || (timeRemaining.minutes === 0 && timeRemaining.seconds <= 3) ? 'bg-green-500' : 'bg-gray-700'}`}></div>
//             <div className={`w-8 h-8 rounded-full ${!isRacing && timeRemaining.minutes === 0 && timeRemaining.seconds <= 6 && timeRemaining.seconds > 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
//             <div className={`w-8 h-8 rounded-full ${!isRacing && ((timeRemaining.minutes > 0) || (timeRemaining.seconds > 6)) ? 'bg-red-600' : 'bg-gray-700'}`}></div>
//           </div>

//           {/* Finish line - now on the left side - INCREASED Z-INDEX */}
//           <div className="absolute left-6 bottom-4 h-40 w-10 flex flex-col z-10">
//             {[...Array(10)].map((_, i) => (
//               <div key={i} className={i % 2 === 0 ? 'h-4 bg-black' : 'h-4 bg-white'}></div>
//             ))}
//           </div>

//           {/* Cars - UPDATED POSITIONING TO FIT RACE TRACKS */}
//           {Object.entries(carPositions).map(([carNumber, position]) => {
//             // Calculate vertical position based on car number
//             // This distributes cars evenly within the road section (bottom 35%)
//             const carIndex = parseInt(carNumber) +3;
//             const laneHeight = 50/ 10; // Dividing road height by number of cars
//             const bottomPosition = 1 + carIndex * laneHeight;

//             return (
//               <div
//                 key={carNumber}
//                 className="absolute z-20"
//                 style={{
//                   left: `${position}%`,
//                   bottom: `${bottomPosition}%`,
//                   width: '70px',
//                   height: '70px',
//                 }}
//               >
//                 {/* Use the specific car image based on car number */}
//                 <div
//                   style={{
//                     marginTop:20,
//                     marginBottom:20,
//                     backgroundImage: `url(${carImages[carNumber]})`,
//                     backgroundSize: 'contain',
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'center',
//                     width: '100%',
//                     height: '100%',
//                     position: 'relative'
//                   }}
//                 >

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Betting options */}
//       <div className="mt-1 p-2">
//        <div className="flex justify-between mb-4 w-full">
//             <button className={`py-2 px-4 rounded-full flex-1 mx-1 ${activeTab === 0 ? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-500"
//             }`}
//             onClick={() => handleTabClick(0)}
//             >
//                 1st
//             </button>

//             <button className={`py-2 px-4 rounded-full flex-1 mx-1 ${activeTab === 1 ? "bg-orange-500 text-white"
//                     : "bg-white text-orange-500 border border-orange-500"
//                 }`}
//                 onClick={() => handleTabClick(1)}
//             >
//                 2nd
//             </button>

//             <button className={`py-2 px-4 rounded-full flex-1 mx-1 ${activeTab === 2? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-500"
//                 }`}
//                 onClick={() => handleTabClick(2)}
//             >
//                 3rd
//             </button>
//         </div>
//         <hr/>
//         <br/>
//         <div className="grid grid-cols-5 gap-4">
//           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num,i) => (
//             <div key={num} className="text-center">

//                 <img src={pinBallImages[i][num]}/>

//               <div className="mt-1">9</div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-4 gap-2 mt-4">
//           <div className="bg-yellow-500 text-white p-2 rounded text-center">
//             <div>Big</div>
//             <div>2</div>
//           </div>
//           <div className="bg-blue-500 text-white p-2 rounded text-center">
//             <div>Small</div>
//             <div>2</div>
//           </div>
//           <div className="bg-pink-500 text-white p-2 rounded text-center">
//             <div>Odd</div>
//             <div>2</div>
//           </div>
//           <div className="bg-green-500 text-white p-2 rounded text-center">
//             <div>Even</div>
//             <div>2</div>
//           </div>
//         </div>
//       </div>

//       {/* Winner announcement */}
//       {winner && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
//           <div className="bg-white p-6 rounded-lg text-center">
//             <div className="text-2xl font-bold mb-4">Race Finished!</div>
//             <div className="text-3xl text-orange-500 font-bold">Car #{winner} Wins!</div>
//             <div className="my-4 flex justify-center">
//               <img
//                 src={carImages[winner]}
//                 alt={`Car #${winner}`}
//                 className="h-16 object-contain"
//               />
//             </div>
//             <div className={`rounded-full w-20 h-20 ${carColors[winner]} flex items-center justify-center text-white text-3xl mx-auto mb-4`}>
//               {winner}
//             </div>
//             <div className="text-lg">New race starting soon...</div>
//           </div>
//         </div>
//       )}
//     </div>
//     </Mobile>
//   );
// };

// export default RacingGame;

import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../Components/Mobile";
import { Typography, Grid, Box, TextField, Checkbox } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button } from "@mui/material";
import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import NoteIcon from "@mui/icons-material/Note";
import { Tabs, Tab } from "@mui/material";
import { Drawer } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { FormControlLabel, Radio } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { DialogTitle } from "@mui/material";

import "../App.css";
import axios from "axios";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import RowVisualization from "./Row";
import CustomTable from "./Visualize";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ButtonGroup, styled } from "@mui/material";
import { domain } from "../Components/config";
import { wssdomain } from "../Components/config";
import MusicOffIcon from "@material-ui/icons/MusicOff";
import Play from "./Play";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import icon from "../../public/games/assets/Clock.png"
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import { CheckCircleIcon } from "lucide-react";
import { useCallback } from "react";
import Alert from "@mui/material/Alert";
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 4,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "30Sec", // Updated subtitle for 30 seconds
  },
  {
    id: 1,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "5Min",
  },
];

const tabData = [
  { label: "Game History" },
  { label: "Chart" },
  { label: "My History" },
];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={0} m={0}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "5px",
  padding: "3px 0px",
  gap: "5.5px",
}));
const StyledButton = styled(Button)(({ theme, active, isRandom }) => ({
  backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
  color: isRandom ? "#D23838" : active ? "#ffffff" : "#000000",
  fontSize: "0.8rem",
  padding: "3px 8px",
  border: isRandom ? "1px solid #D23838" : "none",
  "&:hover": {
    backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
    border: isRandom ? "1px solid #D23838" : "none",
  },
}));

const multipliers = [
  { label: "Random", value: "random", isRandom: true },
  { label: "X1", value: 1 },
  { label: "X5", value: 5 },
  { label: "X10", value: 10 },
  { label: "X20", value: 20 },
  { label: "X50", value: 50 },
  { label: "X100", value: 100 },
];

const GameRulesModal = ({ open, handleClose }) => {
  // Prevent unnecessary re-renders
  const onClose = useCallback(
    (event, reason) => {
      if (reason !== "backdropClick") {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <Mobile>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm" // Changed from "md" to "sm" for smaller width
        fullWidth={false} // Set to false to prevent taking full width
        keepMounted={false}
        disableEscapeKeyDown={false}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          "& .MuiPaper-root": {
            width: "350px", // Explicitly set width
            maxHeight: "80vh", // Prevent modal from being too tall
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "rgb(255,170,86)",
            color: "white",
            fontWeight: "bold",
            py: 1, // Reduced padding
            fontSize: "1rem", // Smaller font size
          }}
        >
          Game Rules
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 2 }}>
          {" "}
          {/* Reduced padding */}
          <Typography
            variant="body2"
            paragraph
            sx={{ mb: 1, fontSize: "0.875rem" }}
          >
            1 Minute 1 issue, 55 Seconds To Order, 5 Seconds Waiting for the
            draw. It Opens all day. The Total number of Trade is 1440 issues.
          </Typography>
          <Typography
            variant="body2"
            paragraph
            sx={{ mb: 1, fontSize: "0.875rem" }}
          >
            If you spend 100 to trade, after deducting 2.5 Service fee, Your
            Contract Amount is 97.5:
          </Typography>
          <Box component="ol" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Green:</strong> If the result shows 1,3,7,9 You
              will get (97.5×2)195; If the Result shows 5 You Will Get
              (97.5×1.5) 146.25
            </Typography>

            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Red:</strong> If The result shows 2,4,6,8 You Will
              Get (97.5×2)195; If the result shows 0, You Will Get (97.5×1.5)
              146.25
            </Typography>

            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Violet:</strong> If the Result shows 0 Or 5, You
              Will Get (97.5×4.5)438.75
            </Typography>

            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Number:</strong> If The Result is the Same As the
              Number You Selected, You Will Get (97.5×9)877.5
            </Typography>

            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Small:</strong> If The Result shows 0,1,2,3,4 You
              Will Get (97.5×2)195
            </Typography>

            <Typography component="li" sx={{ mb: 0.5, fontSize: "0.875rem" }}>
              <strong>Select Big:</strong> If The Result shows 5,6,7,8,9, You
              Will Get (97.5×2)195
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1, pt: 0 }}>
          {" "}
          {/* Reduced padding */}
          <Button
            onClick={handleClose}
            variant="contained"
            size="small" // Smaller button
            sx={{
              backgroundColor: "rgb(255,170,86)",
              "&:hover": {
                backgroundColor: "rgb(230, 150, 70)",
              },
              fontSize: "0.8rem", // Smaller font
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Mobile>
  );
};

const Head = ({ timerKey }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Store message here
  const [resultColor, setResultColor] = useState();
  const [agree, setAgree] = useState(false);
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("1Min");
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [user, setUser] = useState(null);
  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPeriodId, setBetPeriodId] = useState(null);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState();
  console.log("Game result is:", gameResult);
  const [value, setValue] = useState(0);
  const [bets, setBets] = useState([]);
  const [selectedColor, setSelectedColor] = useState("rgb(242, 167, 92)");
  const [winloss, setWinLoss] = useState(0);
  const [popupperiod, setPopupPeriod] = useState(0);
  const [popupresult, setPopupResult] = useState(0);
  const [popupperiodid, setPopupPeriodId] = useState(0);
  const [popupTimer, setPopupTimer] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [popupQueue, setPopupQueue] = useState([]); // new queue to manage sequential popups
  const [currentBetIndex, setCurrentBetIndex] = useState(0); // tracks current popup being shown
  const [accountType, setAccountType] = useState("Normal");
  // State for tracking animation and selection
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const backgroundImage =
    gameResult === "Succeed"
      ? "../../assets/images/missningBg-6f17b242.png"
      : "../../assets/images/missningLBg-73e02111.png";

  let currentBet;
  const text = gameResult === "Succeed" ? "Congratulations" : "Sorry";
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  // Handles the random selection animation
  const handleRandomSelection = () => {
    setIsRandomizing(true);
    let currentIndex = 0;
    const totalItems = 10;
    const intervalSpeed = 100; // Slower animation
    const animationDuration = 2000; // Longer duration for smoother feel
    const iterations = Math.floor(animationDuration / intervalSpeed);
    let count = 0;

    const animationInterval = setInterval(() => {
      setAnimatedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalItems;
      count++;

      if (count >= iterations) {
        clearInterval(animationInterval);
        const finalIndex = Math.floor(Math.random() * totalItems);
        setAnimatedIndex(finalIndex);
        const eventType =
          finalIndex === 0
            ? "mix1"
            : finalIndex === 5
            ? "mix2"
            : finalIndex % 2 === 1
            ? "green"
            : "red";
        handleEventSelection(eventType);
        handleOpenDrawer(finalIndex.toString());
        setTimeout(() => {
          setIsRandomizing(false);
          setAnimatedIndex(null);
        }, 1000); // Longer delay before resetting
      }
    }, intervalSpeed);
  };

  useEffect(() => {
    if (timerKey) {
      console.log("Timer key received:", timerKey); // Console log the timerKey

      // Map timerKey to corresponding timer details
      const timerMap = {
        "30sec": { id: 4, subtitle: "30sec" }, // New timer entry
        "1min": { id: 1, subtitle: "1min" },
        "3min": { id: 2, subtitle: "3min" },
        "5min": { id: 3, subtitle: "5min" },
      };

      if (timerMap[timerKey]) {
        setActiveId(timerMap[timerKey].id);
        setSelectedTimer(timerMap[timerKey].subtitle);
        navigate(`/racing-game/${timerKey}`);
      }
    }
  }, [timerKey, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSmall(true);
        setIsBig(false);
      } else {
        setIsSmall(false);
        setIsBig(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("User is----->",response.data.user)
      setAccountType(response.data.user.accountType);
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
    setSnackbarMessage("Wallet refreshed"); // Set message
    setSnackbarOpen(true); // Open snackbar

    setTimeout(() => {
      setSnackbarOpen(false);
    }, 1000);
  };

  const handleSnackbarCloser = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/racingresult`, {
          params: { timer: selectedTimer },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data);
        // Filter the data based on the selectedTimer
        const filteredData = response.data.Result.filter(
          (item) => item.timer === selectedTimer
        );
        // console.log("This is filter",filteredData);
        setRows(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 1000);
    return () => clearInterval(intervalId);
  }, [selectedTimer]);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setPeriodId(data.timers[selectedTimer].periodId); // Set the periodId
        // console.log("rem-->", data.timers[selectedTimer].remainingTime);
        setRemainingTime(data.timers[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [selectedTimer]);

  const handleTimerChange = (id, subtitle) => {
    setActiveId(id);
    const newTimerKey = subtitle.toLowerCase().replace("min", "min");
    setSelectedTimer(subtitle);
    navigate(`/racing-game/${newTimerKey}`);
  };

  console.log(typeof remainingTime);
  const handleClick = (id) => {
    if (!timerKey) {
      let newTimerKey;
      switch (id) {
        case 1:
          newTimerKey = "1min";
          break;
        case 2:
          newTimerKey = "3min";
          break;
        case 3:
          newTimerKey = "5min";
          break;
        case 4:
          newTimerKey = "30sec"; // Handle 30-second timer
          break;
        default:
          newTimerKey = "30sec";
      }
      navigate(`/racing-game/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle);
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to 747 Lottery , where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 747 Lottery . Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on 747 Lottery  club ",
    "747 Lottery  club welcomes you here !!",
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 500); // This should be equal to the exit duration below
    }, 3000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  const navigateToPage = () => {
    navigate("/home"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage1 = () => {
    navigate("/recharge"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage2 = () => {
    navigate("/withdraw"); // Replace '/path-to-page' with the actual path
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(parseFloat(amount).toFixed(2));
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };

  const [isRacing, setIsRacing] = useState(false);
  const [carPositions, setCarPositions] = useState({
    1: 85,
    2: 85,
    3: 85,
    4: 85,
    5: 85,
    6: 85,
    7: 85,
    8: 85,
    9: 85,
    10: 85,
  });
  const [winner, setWinner] = useState(null);
  const finishLine = 10; // Percentage of track width where finish line is (now on the left)
  const previousTimeRef = useRef(null);

  // Define car image paths
  const carImages = {
    1: "https://tc9987.com/zhibo/pk/img/car1.png",
    2: "https://tc9987.com/zhibo/pk/img/car2.png",
    3: "https://tc9987.com/zhibo/pk/img/car3.png",
    4: "https://tc9987.com/zhibo/pk/img/car4.png",
    5: "https://tc9987.com/zhibo/pk/img/car5.png",
    6: "https://tc9987.com/zhibo/pk/img/car6.png",
    7: "https://tc9987.com/zhibo/pk/img/car7.png",
    8: "https://tc9987.com/zhibo/pk/img/car8.png",
    9: "https://tc9987.com/zhibo/pk/img/car9.png",
    10: "https://tc9987.com/zhibo/pk/img/car10.png",
  };

  // Car colors for UI elements
  const carColors = {
    1: "bg-yellow-400",
    2: "bg-gray-300",
    3: "bg-gray-400",
    4: "bg-orange-400",
    5: "bg-green-400",
    6: "bg-blue-500",
    7: "bg-gray-500",
    8: "bg-red-400",
    9: "bg-red-600",
    10: "bg-purple-500",
  };

  // Reset the race
  const resetRace = () => {
    setCarPositions({
      1: 85,
      2: 85,
      3: 85,
      4: 85,
      5: 85,
      6: 85,
      7: 85,
      8: 85,
      9: 85,
      10: 85,
    });
    setWinner(null);
    setIsRacing(false);
  };

  useEffect(() => {
    // Store previous time to detect the transition to 0
    previousTimeRef.current = remainingTime;
  }, [remainingTime]);

  console.log(previousTimeRef);
  // Start racing when timer hits zero

  // Start racing when timer hits zero
  useEffect(() => {
    // Parse the time strings to seconds
    if (remainingTime === "00:01" && !isRacing && !winner) {
      console.log("Timer hit zero - starting race!");
      setIsRacing(true); // Then start the race
    }
  }, [remainingTime, isRacing, winner]);

  // Handle the racing animation
  useEffect(() => {
    if (!isRacing) return;

    let animationId;
    let raceCompleted = false;

    const updateRace = () => {
      setCarPositions((prevPositions) => {
        const newPositions = { ...prevPositions };
        let someoneWon = false;

        // Move each car by a random amount (now decreasing the value to move from right to left)
        Object.keys(newPositions).forEach((carNumber) => {
          // Random speed between 0.2 and 0.8
          const speed = 0.2 + Math.random() * 0.6;
          newPositions[carNumber] -= speed; // Subtract to move left

          // Check if any car has crossed the finish line (now checking for position <= finishLine)
          if (newPositions[carNumber] <= finishLine && !raceCompleted) {
            someoneWon = true;
            setWinner(parseInt(carNumber));
            raceCompleted = true;
          }
        });

        return newPositions;
      });

      if (!raceCompleted) {
        animationId = requestAnimationFrame(updateRace);
      }
    };

    animationId = requestAnimationFrame(updateRace);
    return () => cancelAnimationFrame(animationId);
  }, [isRacing]);

  useEffect(() => {
    if (winner) {
      console.log("Winner detected - resetting game");
      // Maybe add a small delay here to show the winner for a moment
      setTimeout(() => {
        resetRace();
        setWinner(null);
        setIsRacing(false); // Ensure racing is set to false when reset
      }, 2000); // 3 second delay to show the winner
    }
  }, [winner]);

  console.log("Is racing:", isRacing);
  // Convert remainingTime (seconds) to minutes and seconds for display
  // const displayMinutes = Math.floor(remainingTime / 60);
  // const displaySeconds = remainingTime % 60;

  const handlePlaceBet = async () => {
    const totalBet = betAmount * multiplier;
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const randomString = randomNumber.toString();
    // Check if user's wallet balance is less than the total bet amount
    if (betAmount === 0) {
      alert("You can't place a bet with 0 amount.");
      return;
    }
    if (user.walletAmount < totalBet) {
      alert("You don't have enough balance to place this bet.");
      return;
    }
    if (
      ["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"].includes(
        remainingTime
      )
    ) {
      alert("You can't place a bet in the last 5 seconds.");
      return;
    }
    const betData = {
      selectedItem: selectedItem,
      betAmount: betAmount,
      multiplier: multiplier,
      totalBet: totalBet,
      selectedTimer: selectedTimer,
      periodId: periodId,
      result: " ",
      status: " ",
      winLoss: "",
      userType: accountType,
      orderId: randomString,
    };
    setLastAlertedPeriodId(periodId);
    // Send a POST request to the backend API endpoint
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(`${domain}/racingbet/`, betData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }

    setBetPlaced(true);
    setBetPeriodId(periodId);
    handleCloseDrawer();
    setOpenSnackbar(true);
  };

  const handleCancelBet = () => {
    setSelectedItem("");
    setBetAmount(0);
    setMultiplier(1);
    setTotalBet(0);
    handleCloseDrawer();
  };
  console.log("Game Result is:", gameResult);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  useEffect(() => {
    handleClick(images[0].id);
  }, []);

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  useEffect(() => {
    if (remainingTime >= "00:01" && remainingTime <= "00:05") {
      setOpenDialog(true);
      setDrawerOpen(false);
      if (isSoundOn && remainingTime !== lastPlayedTime) {
        countdownSound.play();
        setLastPlayedTime(remainingTime);
        setTimeout(() => {
          countdownSound.pause();
          countdownSound.currentTime = 0;
        }, 1000 - countdownSound.duration * 1000);
      }
    } else {
      setOpenDialog(false);
      if (isSoundOn) {
        countdownSound.pause();
        countdownSound.currentTime = 0;
        setLastPlayedTime(null);
      }
    }
    // console.log("popupRemaningTime:", popupRemaningTime)
  }, [remainingTime, isSoundOn]);

  const handleEventSelection = (event) => {
    switch (event) {
      case "violet":
        setSelectedColor("#9B48DB");
        setResultColor("Violet");
        break;
      case "green":
        setSelectedColor("RGB(64,173,114)");
        setResultColor("Green");
        break;
      case "red":
        setSelectedColor("RGB(253,86,92)");
        setResultColor("Red");
        break;
      case "yellow":
        setSelectedColor("RGB(71,129,255)");
        setResultColor("Yellow");
        break;
      case "blue":
        setSelectedColor("RGB(71,129,255)");
        setResultColor("Blue");
        break;
      case "big":
        setSelectedColor("rgb(255,168,46)");
        setResultColor("Orange");
        break;
      case "mix1":
        setSelectedColor(
          "linear-gradient(to right, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"
        );
        setResultColor("Purple");
        break;
      case "mix2":
        setSelectedColor(
          "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
        );
        setResultColor("Purple");
        break;
      default:
        setSelectedColor("RGB(71,129,255)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");

  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value).toFixed(2);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };

  let number;
  let resSize;
  let chosedColor;
  const getColorAndSize = (popupresult) => {
    popupresult = Number(popupresult);
    number = popupresult;
    let color = "unknown";
    let size = "";

    if ([1, 3, 7, 9].includes(popupresult)) {
      color = "green";
      chosedColor = "green";
    } else if ([2, 4, 6, 8].includes(popupresult)) {
      color = "red";
      chosedColor = "red";
    } else if (popupresult === 0) {
      color = "red and violet";
      chosedColor = "red and violet";
    } else if (popupresult === 5) {
      color = "green and violet";
      chosedColor = "green and violet";
    }

    if (popupresult > 5) {
      size = "big";
      resSize = "big";
    } else {
      size = "small";
      resSize = "small";
    }

    return `${color} ${popupresult} ${size}`;
  };

  useEffect(() => {
    setTotalBet(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const firstFiveRows = rows.slice(0, 5);

  // Handle multiplier button clicks
  const handleMultiplierChange = (multiplier) => {
    if (multiplier.isRandom && !isRandomizing) {
      handleRandomSelection();
    } else {
      setSelectedMultiplier(multiplier.value);
    }
  };
  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user/betshistory`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredBets = response.data.filter(
          (bet) => bet.selectedTimer === selectedTimer
        );
        console.log(filteredBets);
        setBets(filteredBets);
        console.log("bets is :", bets);
        // console.log(filteredBets)

        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);

        if (
          currentPeriodId &&
          currentPeriodId !== "Loading..." &&
          currentPeriodId !== previousAlertedPeriodId
        ) {
          const completedBets = response.data.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              bet.status !== " " &&
              bet.result !== " " &&
              bet.winLoss !== ""
          );

          if (completedBets.length > 0) {
            console.log("Adding completed bets to popup queue...");
            setPopupQueue(completedBets);
            setCurrentBetIndex(0);
            setLastAlertedPeriodId(currentPeriodId);
            console.log("Popup queue updated:", completedBets);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (periodId && periodId !== "Loading...") {
      fetchBets();
      const intervalId = setInterval(fetchBets, 1000);

      return () => clearInterval(intervalId);
    }
  }, [periodId, lastAlertedPeriodId, domain]);

  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
      console.log("popupQueue:", popupQueue);
      console.log("currentBetIndex:", currentBetIndex);

      currentBet = popupQueue[currentBetIndex];

      if (!currentBet) {
        console.error("currentBet is undefined or null.");
        return;
      }

      console.log("Current Bet Object:", currentBet);

      const announceBetResult = async () => {
        console.log(`Announcing bet status: ${currentBet.status}`);
        // console.log(currentBet.status)
        // console.log(currentBet.winLoss)
        // console.log(currentBet.periodId)
        // console.log(currentBet.result)
        // console.log(currentBet.selectedTimer)
        console.log(currentBet);
        setGameResult(currentBet.status);
        setWinLoss(currentBet.winLoss);
        setPopupPeriodId(currentBet.periodId);
        setPopupResult(currentBet.result);
        setPopupTimer(currentBet.selectedTimer);
        setDialogContent(
          currentBet.status === "Succeed" ? "Bonus" : "You lost the bet"
        );

        setOpen(true);
        // console.log("currentBet:", currentBet)
      };

      announceBetResult();

      const timer = setTimeout(() => {
        // setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
        }, 500);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      console.log(
        "No popup to show, either popupQueue is empty or currentBetIndex exceeds queue length."
      );
    }
  }, [popupQueue, currentBetIndex]);

  const seconds1 = remainingTime ? remainingTime.split(":")[1] : "00";
  const handleCheckboxChange = (event) => {
    const newCheckedState = event.target.checked;
    setIsChecked(newCheckedState);

    // Trigger your function here based on checkbox state
    if (newCheckedState) {
      console.log("Auto-close enabled");
      const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
          setIsChecked(false);
        }, 2000);
      }, 4000);
      // Your function logic here
    } else {
      console.log("Auto-close disabled");
      // Your alternative function logic here
    }
  };
  // Determine the length of the seconds string
  const length = seconds1.length;

  // Split the seconds into two halves
  const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const secondHalf = seconds1.slice(Math.ceil(length / 2));
  const [modalOpen, setModalOpen] = useState(false);

  // Use useCallback to prevent recreation of these functions on each render
  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const [activeTabNumber, setActiveTabNumber] = useState(0);

  // Function to handle tab click
  const handleTabClick = (tabIndex) => {
    setActiveTabNumber(tabIndex);
  };

  const pinBallImages = [
    {
      1: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball01.png",
    },
    {
      2: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball02.png",
    },
    {
      3: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball03.png",
    },
    {
      4: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball04.png",
    },
    {
      5: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball05.png",
    },
    {
      6: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball06.png",
    },
    {
      7: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball07.png",
    },
    {
      8: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball08.png",
    },
    {
      9: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball09.png",
    },
    {
      10: "https://in.piccdn123.com/static/_template_/orange/img/speed_pinball10.png",
    },
  ];

  const renderImage = (num) => (
    <div
      key={num}
      style={{
        width: "18%",
        aspectRatio: "1",
        overflow: "hidden",
        borderRadius: "10px",

        transition: "all 0.3s ease-in-out",
        transform: animatedIndex === num ? "scale(1.25)" : "scale(1)",
      }}
    >
      <img
        src={`../../games/assets/games/${num}.png`}
        alt={num.toString()}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
        }}
        onClick={() => {
          if (!isRandomizing) {
            handleOpenDrawer(num.toString());
            handleEventSelection(
              num === 0
                ? "mix1"
                : num === 5
                ? "mix2"
                : num % 2 === 1
                ? "green"
                : "red"
            );
          }
        }}
      />
    </div>
  );

  return (
    <div>
      <Mobile>
        <div style={{ backgroundColor: "#F7F8FF" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 5000,
              background: "#F95959",
              padding: "8px 16px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton style={{ color: "white" }} onClick={navigateToPage}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/genzwinlogo.png"
                alt="logo"
                style={{ width: "140px", height: "50px" }}
              />
            </Grid>
            <Grid item xs={3} textAlign="right">
              <IconButton style={{ color: "white" }}>
                <SupportAgentIcon onClick={() => navigate("/service")} />
              </IconButton>

              <IconButton
                style={{ color: "white" }}
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
              </IconButton>
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            sx={{
              height: { xs: "auto", sm: "300px" }, // Adjust height responsively
              maxWidth: { xs: "100%", sm: "500px", md: "600px" }, // Control maximum width at different breakpoints
              width: "100%", // Use full available width
              margin: "0 auto", // Center the grid horizontally
              background: "#F95959",
              borderRadius: { xs: "0 0 40px 40px", sm: "0 0 70px 70px" }, // Smaller radius on mobile
              textAlign: "center",
            }}
          >
            <Grid
              sx={{
                backgroundImage: `url("../../games/assets/walletbg.png")`,
                backgroundSize: "cover",
                backgroundColor: "#ffffff",
                backgroundPosition: "center",
                margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
                borderRadius: { xs: "20px", sm: "30px" }, // Smaller radius on mobile
                padding: { xs: "8px", sm: "10px" }, // Smaller padding on mobile
                marginTop: { xs: "8px", sm: "10px" }, // Smaller margin on mobile
              }}
            >
              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {user ? user.walletAmount.toFixed(2) : " Loading"}
                </Typography>
                <IconButton
                  sx={{ color: "black", padding: { xs: "6px", sm: "8px" } }}
                >
                  <Refresh onClick={handleRefresh} />
                </IconButton>
                {snackbarOpen && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1500,
                      backgroundColor: "rgba(0,0,0,0.6)", // Optional overlay background
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Alert
                      severity={
                        snackbarMessage.includes("Failed") ? "error" : "success"
                      }
                      onClose={handleSnackbarCloser}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                      }}
                      sx={{
                        width: "fit-content",
                        maxWidth: "90%",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        opacity: "0.6",
                      }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Box>
                )}
              </Grid>

              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <AccountBalanceWallet
                  sx={{
                    marginRight: "10px",
                    color: "#F95959",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Wallet Balance
                </Typography>
              </Grid>
              <Grid
                sm={12}
                mt={{ xs: 2, sm: 3 }}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="filled"
                  onClick={navigateToPage2}
                  sx={{
                    width: { xs: "110px", sm: "130px" }, // Smaller on mobile
                    marginLeft: { xs: "5px", sm: "10px" },
                    color: "white",
                    backgroundColor: "rgb(250,90,91)",
                    "&:hover": {
                      backgroundColor: "#D23838",
                    },
                    borderColor: "#D23838",
                    borderRadius: "50px",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
                    padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
                  }}
                >
                  Withdraw
                </Button>
                <Button
                  variant="contained"
                  onClick={navigateToPage1}
                  sx={{
                    width: { xs: "110px", sm: "130px" }, // Smaller on mobile
                    marginLeft: { xs: "5px", sm: "10px" },
                    backgroundColor: "rgb(24,183,97)",
                    "&:hover": {
                      backgroundColor: "#17B15E",
                    },
                    borderRadius: "50px",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
                    padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
                  }}
                >
                  Deposit
                </Button>
              </Grid>
            </Grid>

            <Grid
              item
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: { xs: "15px", sm: "20px" }, // Smaller radius on mobile
                width: { xs: "calc(100% - 20px)", sm: "90%" }, // Calculate width based on available space
                padding: { xs: "0 3px", sm: "0 5px" }, // Less padding on mobile
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
                margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
              }}
            >
              <IconButton sx={{ padding: { xs: "6px", sm: "8px" } }}>
                <VolumeUpIcon
                  sx={{
                    color: "#F95959",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                />
              </IconButton>

              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  padding: { xs: "0 6px", sm: "0 10px" },
                }}
              >
                <CSSTransition
                  in={inProp}
                  timeout={500}
                  classNames="message"
                  unmountOnExit
                >
                  <Typography
                    sx={{
                      color: "#8c90a6",
                      fontSize: { xs: "11px", sm: "12.8px" }, // Smaller text on mobile
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      textAlign: "left",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                      lineClamp: 2,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {textArray[index]}
                  </Typography>
                </CSSTransition>
              </Box>

              <Button
                variant="contained"
                sx={{
                  background: "#F95959",
                  "&:hover": {
                    background: "#F95959",
                  },
                  borderRadius: "50px",
                  fontSize: { xs: "10px", sm: "11px" }, // Smaller text on mobile
                  textTransform: "initial",
                  padding: { xs: "3px 10px", sm: "4px 12px" }, // Smaller padding on mobile
                  color: "#ffffff",
                }}
              >
                Details
              </Button>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: { xs: "block", sm: "none" }, // Show on xs (mobile) screens, hide on sm (600px+) and above
            }}
          >
            <br />
            <br />
            <br />
            <br />
          </Box>
          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "93%",

              marginTop: "-65px",
              backgroundColor: "#ffffff",
              borderRadius: "13px",
              color: "white",
            }}
          >
            {images.map((image) => (
              <Grid
                item
                xs={3}
                key={image.id}
                onClick={() => handleTimerChange(image.id, image.subtitle)}
                style={{
                  cursor: "pointer",
                  background:
                    activeId === image.id
                      ? "linear-gradient(180deg, #FFB6B6 0%, #FFF 90.5%)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={
                    activeId === image.id
                      ? "https://www.66lottery9.com/static/games/time_a.png"
                      : image.src
                  }
                  alt={image.subtitle}
                  style={{ width: "60%" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    color: activeId === image.id ? "black" : "grey",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Racing
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {image.subtitle}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <br />
          <Grid
            container
            spacing={0}
            mt={3}
            sx={{
              height: "105px",
              maxWidth: "90%",
              margin: "auto",
              background: "#F95959",
              borderRadius: "15px",
              padding: "3px",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Top Cut-Out Circle */}
            <Box
              sx={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: "rgb(242,242,241)",
                borderRadius: "50%",
                transform: "translateX(-50%)",
              }}
            />

            {/* Bottom Cut-Out Circle */}
            <Box
              sx={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: "rgb(242,242,241)",
                borderRadius: "50%",
                transform: "translateX(-50%)",
              }}
            />

            {/* Left Side - How to Play & Winning Numbers */}
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingLeft: "2%",
              }}
            >
              {/* "How to Play" Button */}
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "150px",
                    color: "white",
                    borderColor: "white",
                    padding: "2px 8px",
                    textTransform: "initial",
                    borderRadius: "20px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  startIcon={<NoteIcon />}
                  onClick={handleOpenModal}
                  disableRipple={false}
                  disableTouchRipple={false}
                >
                  How to play
                </Button>

                {/* Only render the modal when it's actually open */}
                {modalOpen && (
                  <GameRulesModal
                    open={modalOpen}
                    handleClose={handleCloseModal}
                  />
                )}
              </>
              {/* Win Timer Text */}
              <Typography variant="caption" sx={{ color: "white", mt: 0 }}>
                {`Racing Game ${selectedTimer}`}
              </Typography>
            </Grid>

            {/* Dashed Divider */}
            <Box
              sx={{
                position: "absolute",
                height: "80%",
                width: "0px",
                // background: "white",
                left: "50%",
                transform: "translateX(-50%)",
                borderLeft: "3px dotted rgba(243, 227, 227, 0.86)",
                marginLeft: "1px",
              }}
            />

            {/* Right Side - Timer */}
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                paddingLeft: "15%",
                paddingRight: "4%",
                width: "100%", // Ensure full width
              }}
            >
              {/* "Time Remaining" Label */}
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: "300px" }}
              >
                Time remaining
              </Typography>

              {/* Countdown Timer */}
              <Box
                sx={{
                  display: "flex",
                  mt: 0,
                  justifyContent: "flex-end",
                  width: "100%",
                  paddingLeft: 4,
                }}
              >
                {[minutes[0], minutes[1], ":", seconds[0], seconds[1]].map(
                  (char, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "22px",
                        height: "30px",
                        backgroundColor: char === ":" ? "#f2f2f1" : "#f2f2f1",
                        color: "#000",
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: "30px",
                        margin: "0 2px",
                        fontSize: "18px",
                      }}
                    >
                      {char}
                    </Box>
                  )
                )}
              </Box>

              {/* Period ID */}
              <Typography
                variant="caption"
                sx={{ color: "white", fontSize: "14px", mt: 1 }}
              >
                {periodId ? periodId : ""}/
              </Typography>
            </Grid>
          </Grid>

          {/* Racing Game */}
          <div className="mt-4 bg-gray-900 relative">
            <div className="flex justify-between text-white p-2">
              <div>TC Car Racing</div>
              <div className="flex gap-1">
                <span className="rounded-full w-6 h-6 bg-gray-300 flex items-center justify-center text-gray-900">
                  2
                </span>
                <span className="rounded-full w-6 h-6 bg-blue-500 flex items-center justify-center text-white">
                  6
                </span>
                <span className="rounded-full w-6 h-6 bg-red-600 flex items-center justify-center text-white">
                  9
                </span>
                <span className="ml-4">Per. {periodId}</span>
              </div>
            </div>

            {/* Race track background */}
            <div className="relative h-60 overflow-hidden">
              {/* Road background */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  backgroundImage:
                    "url(https://tc9987.com/zhibo/pk/img/road.jpg)",
                  backgroundSize: "cover",
                  height: "65%",
                  zIndex: 1,
                }}
              ></div>

              {/* Sky background with landmarks */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(https://tc9987.com/zhibo/pk/img/scenery.jpg)",
                  backgroundSize: "cover",
                  height: "35%",
                  zIndex: 2,
                }}
              ></div>

              {/* Track lanes */}
              <div
                className="absolute bottom-0 left-0 right-0 z-3"
                style={{ height: "35%" }}
              >
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-2.5 border-b border-dashed border-gray-600"
                    style={{ bottom: `${i * 3 + 3}%` }}
                  ></div>
                ))}
              </div>

              {/* Traffic light */}
              <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 bg-black p-2 rounded-lg flex gap-1 z-20">
                <div
                  className={`w-8 h-8 rounded-full ${
                    isRacing ||
                    (remainingTime <= "00:03" && remainingTime > "00:00")
                      ? "bg-green-500"
                      : "bg-gray-700"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full ${
                    !isRacing &&
                    remainingTime <= "00:06" &&
                    remainingTime > "00:03"
                      ? "bg-yellow-500"
                      : "bg-gray-700"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full ${
                    !isRacing && remainingTime > "00:06"
                      ? "bg-red-600"
                      : "bg-gray-700"
                  }`}
                ></div>
              </div>

              {/* Finish line */}
              <div className="absolute left-6 bottom-4 h-32 w-10 flex flex-col z-10">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={i % 2 === 0 ? "h-3 bg-black" : "h-3 bg-white"}
                  ></div>
                ))}
              </div>

              {/* Cars */}
              {Object.entries(carPositions).map(([carNumber, position]) => {
                // Calculate vertical position based on car number
                const carIndex = parseInt(carNumber) - 2;
                const laneHeight = 60 / 10; // Dividing road height by number of cars
                const bottomPosition = 1 + carIndex * laneHeight;

                return (
                  <div
                    key={carNumber}
                    className="absolute z-20"
                    style={{
                      left: `${position}%`,
                      bottom: `${bottomPosition}%`,
                      width: "60px",
                      height: "60px",
                    }}
                  >
                    {/* Use the specific car image based on car number */}
                    <div
                      style={{
                        backgroundImage: `url(${carImages[carNumber]})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Below betting option */}
          <Grid
            container
            mt={2}
            spacing={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              position: "relative",
              pointerEvents: openDialog ? "none" : "auto",
            }}
          >
            {/* Timer Overlay */}
            <div
              className="overlay"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "20px",
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 100,
                display: openDialog ? "inline-block" : "none",
                cursor: "not-allowed",
              }}
            ></div>
            <div
              style={{
                width: "300px",
                height: "200px",
                display: openDialog ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                color: "#F95959",
                fontWeight: "bold",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 900,
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {firstHalf}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {secondHalf}
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="mt-1 p-2">
              <div className="flex justify-between mb-4 w-full">
                <button
                  className={`py-2 px-11 rounded-full flex-grow mx-1 ${
                    activeTabNumber === 0
                      ? "bg-orange-500 text-white"
                      : "bg-white text-orange-500 border border-orange-500"
                  }`}
                  onClick={() => handleTabClick(0)}
                >
                  1st
                </button>

                <button
                  className={`py-2 px-11 rounded-full flex-grow mx-1 ${
                    activeTabNumber === 1
                      ? "bg-orange-500 text-white"
                      : "bg-white text-orange-500 border border-orange-500"
                  }`}
                  onClick={() => handleTabClick(1)}
                >
                  2nd
                </button>

                <button
                  className={`py-2 px-11 rounded-full flex-grow mx-1 ${
                    activeTabNumber === 2
                      ? "bg-orange-500 text-white"
                      : "bg-white text-orange-500 border border-orange-500"
                  }`}
                  onClick={() => handleTabClick(2)}
                >
                  3rd
                </button>
              </div>
              <hr />
              <br />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, i) => (
                <div key={num} className="text-center">
                  <img src={pinBallImages[i][num]} />

                  <div className="mt-1">9</div>
                </div>
              ))}
            </div>

            {/* Fourth Row */}
            <Grid
              container
              item
              xs={12}
              justifyContent="center"
              sx={{ marginBottom: "10px", marginLeft: 0 }}
            >
              <Grid
                container
                item
                justifyContent="center"
                sx={{
                  flexWrap: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {/* Big Small button */}
                <Grid item sx={{ flex: 1 }}>
                  <Button
                    onClick={() => {
                      handleOpenDrawer("big");
                      handleEventSelection("big");
                    }}
                    variant="contained"
                    fullWidth
                    sx={{
                      maxWidth: "170px",
                      minWidth: "85px",
                      borderRadius: "20px 0 0 20px",
                      margin: "0",
                      backgroundColor: "rgb(255,170,86)",
                      "&:hover": {
                        backgroundColor: "rgb(255,168,46)",
                      },
                    }}
                  >
                    Big
                  </Button>
                </Grid>
                <Grid item sx={{ flex: 1 }}>
                  <Button
                    onClick={() => {
                      handleOpenDrawer("small");
                      handleEventSelection("small");
                    }}
                    variant="contained"
                    fullWidth
                    sx={{
                      maxWidth: "170px",
                      minWidth: "85px",
                      borderRadius: "0 20px 20px 0",
                      margin: "0",
                      backgroundColor: "rgb(110,169,245)",
                    }}
                  >
                    Small
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={500}
            onClose={handleCloseSnackbar}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
            >
              Bet Succeed !
            </MuiAlert>
          </Snackbar>

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100%",
                height: "auto",
                margin: "0 auto",
                maxWidth: isSmallScreen ? "600px" : "396px",
                backgroundColor: "white",
                color: "black",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              },
            }}
          >
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "black",
                backgroundColor: "#ffffff",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  position: "relative",
                  marginBottom: "-5px",
                  height: "90px",
                  color: "white",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                    background: selectedColor,
                    clipPath:
                      "polygon(50.7% 100.3%, 100.1% 61%, 100.1% 0%, 0% 0%, 0.1% 71.3%)",
                  }}
                >
                  <Typography variant="h6">{`Racing ${selectedTimer}`}</Typography>
                  <Typography variant="body1">{`${selectedItem} is selected`}</Typography>
                </div>
              </Grid>
              <Grid container padding={1}>
                {/* Balance Section */}
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#666",
                      fontSize: "1rem",
                      marginTop: "5px",
                    }}
                  >
                    Balance
                  </Typography>
                </Grid>

                {/* Bet Amount Buttons */}
                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Box sx={{ display: "flex", gap: "5px" }}>
                    {[1, 10, 100, 1000].map((amount) => (
                      <Button
                        key={amount}
                        sx={{
                          minWidth: "40px",
                          height: "25px",
                          padding: "2px 4px",
                          fontSize: "0.75rem",
                          backgroundColor:
                            activeBetAmount === amount
                              ? selectedColor
                              : "#f2f2f1",
                          color: activeBetAmount === amount ? "white" : "#666",
                          "&:hover": {
                            backgroundColor:
                              activeBetAmount === amount
                                ? selectedColor
                                : "#f2f2f1",
                          },
                        }}
                        onClick={() => {
                          handleBetAmount(amount);
                          setActiveBetAmount(amount);
                        }}
                      >
                        {amount}
                      </Button>
                    ))}
                  </Box>
                </Grid>

                {/* Quantity Section */}
                <Grid item xs={6} mt={2}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#666", fontSize: "1rem" }}
                  >
                    Quantity
                  </Typography>
                </Grid>

                {/* Quantity Controls */}
                <Grid
                  item
                  xs={6}
                  mt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setMultiplier(multiplier > 1 ? multiplier - 1 : 1)
                    }
                  >
                    <RemoveIcon
                      fontSize="small"
                      sx={{ color: selectedColor, fontSize: 30 }}
                    />
                  </IconButton>

                  <TextField
                    value={multiplier}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setMultiplier(
                          value === "" ? "" : Math.max(1, Number(value))
                        );
                      }
                    }}
                    sx={{
                      width: "50px",
                      textAlign: "center",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        backgroundColor: "white",
                        color: "#666",
                        textAlign: "center",
                        fontSize: "1rem",
                        "& input": {
                          textAlign: "center",
                          padding: "4px 8px",
                        },
                      },
                    }}
                    variant="outlined"
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                  />

                  <IconButton onClick={() => setMultiplier(multiplier + 1)}>
                    <AddIcon
                      fontSize="small"
                      sx={{ color: selectedColor, fontSize: 30 }}
                    />
                  </IconButton>
                </Grid>

                {/* Multiplier Buttons */}
                <Grid item xs={12} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ color: "#666" }}
                  >
                    {[1, 5, 10, 20, 50, 100].map((mult) => (
                      <div
                        key={mult}
                        className={`button ${
                          activeButton === mult ? "active" : ""
                        }`}
                        onClick={() => {
                          handleMultiplier(mult);
                          setActiveButton(mult);
                        }}
                        style={
                          activeButton === mult
                            ? { backgroundColor: selectedColor, color: "white" }
                            : { backgroundColor: "#f2f2f1", color: "#666" }
                        }
                      >
                        X{mult}
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Radio
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon sx={{ color: "#4caf50" }} />} // Green check when selected
                  />
                }
                label="I Agree"
                sx={{ color: "#666", fontSize: "1rem", marginLeft: 1 }}
              />

              <Grid item xs={12} mt={2}>
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{ backgroundColor: "#f2f2f1", color: "grey" }}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      style={{ background: selectedColor }}
                      variant="contained"
                    >{`Total Amount: ${betAmount * multiplier}`}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Drawer>

          <Grid
            mt={2}
            container
            justifyContent="center"
            sx={{ marginBottom: "15%" }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "95%",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {tabData.map((tab, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      onClick={() => setActiveTab(index)}
                      sx={{
                        height: "40px", // Adjust this value to change the tab height
                        backgroundColor:
                          activeTab === index ? "#F95959" : "#ffffff",
                        color: activeTab === index ? "#ffffff" : "grey",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor:
                            activeTab === index ? "#F95959" : "#f5f5f5",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <TabPanel>
                    <CustomTable data={rows} />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <RowVisualization data={rows} />
                  </TabPanel>
                )}
                {activeTab === 2 && (
                  <TabPanel>
                    <Grid container sx={{ justifyContent: "center" }}>
                      {bets
                        .slice()
                        .sort((a, b) =>
                          b.timestamp && a.timestamp
                            ? b.timestamp.seconds - a.timestamp.seconds
                            : 0
                        )
                        .map((bet, index) => (
                          <Accordion
                            key={index}
                            sx={{
                              backgroundColor: "#ffffff",
                              width: "100%",
                            }}
                          >
                            <AccordionSummary>
                              <Grid
                                container
                                sx={{
                                  alignItems: "center",
                                  p: 1,
                                  margin: "0px",
                                }}
                              >
                                <Grid item xs={2}>
                                  <Box
                                    border={1}
                                    borderRadius={2}
                                    style={{
                                      background:
                                        bet.selectedItem.toLowerCase() ===
                                          "green" ||
                                        [1, 3, 7, 9].includes(
                                          Number(bet.selectedItem)
                                        )
                                          ? "RGB(64,173,114)"
                                          : bet.selectedItem.toLowerCase() ===
                                              "red" ||
                                            [2, 4, 6, 8].includes(
                                              Number(bet.selectedItem)
                                            )
                                          ? "RGB(253,86,92)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "violet"
                                          ? "RGB(182,89,254)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "big"
                                          ? "#ffa82e" // Background color for "big"
                                          : bet.selectedItem.toLowerCase() ===
                                            "small"
                                          ? "#1876d2" // Background color for "small"
                                          : Number(bet.selectedItem) === 0
                                          ? "#F95959"
                                          : Number(bet.selectedItem) === 5
                                          ? "#F95959"
                                          : "#F95959",
                                      color: "white",
                                      height: "40px",
                                      width: "40px",
                                      display: "flex",
                                      border: "none",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "10px" }}>
                                      {bet.selectedItem.toUpperCase()}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={7} textAlign="left">
                                  <Typography variant="body2">
                                    {bet.periodId}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {bet.timestamp
                                      ? new Date(bet.timestamp).toLocaleString(
                                          "en-GB"
                                        )
                                      : "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: "right" }}>
                                  <Box
                                    sx={{
                                      border: 1,
                                      borderColor:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : bet.status === "Suceed"
                                          ? "success.main"
                                          : "text.primary",
                                      borderRadius: 1,
                                      pt: 0.1,
                                      pb: 0.1,
                                      pl: 1,
                                      pr: 1,
                                      display: "inline-block",
                                      mb: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color:
                                          bet.status === "Failed"
                                            ? "orange" // Color for Pending status
                                            : bet.winLoss >= 0
                                            ? "green"
                                            : "red",
                                      }}
                                    >
                                      {bet.status === "Failed" ||
                                      bet.status === "Succeed"
                                        ? bet.status
                                        : "Pending"}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : "success.main",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {bet.status === "Failed"
                                      ? `-₹${Math.abs(bet.winLoss)}`
                                      : bet.status === "Succeed"
                                      ? `+₹${Math.abs(bet.winLoss)}`
                                      : ``}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails sx={{ m: 0, p: 0 }}>
                              <Table size="small" style={{ padding: 2 }}>
                                <TableBody>
                                  {[
                                    {
                                      label: "Order number",
                                      value: `${bet.orderId}`,
                                    },
                                    { label: "Period", value: bet.periodId },
                                    {
                                      label: "Purchase amount",
                                      value: `₹${parseFloat(
                                        bet.betAmount
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Quantity",
                                      value: bet.multiplier,
                                    },
                                    {
                                      label: "Amount after tax",
                                      value: `₹${parseFloat(
                                        bet.totalBet
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Tax",
                                      value: `₹${parseFloat(bet.tax).toFixed(
                                        2
                                      )}`,
                                    },
                                    { label: "Result", value: bet.result },
                                    {
                                      label: "Select",
                                      value: bet.selectedItem,
                                    },
                                    { label: "Status", value: bet.status },
                                    {
                                      label: "Win/lose",
                                      value:
                                        bet.winLoss > 0
                                          ? `+₹${parseFloat(
                                              bet.winLoss
                                            ).toFixed(2)}`
                                          : `₹${parseFloat(bet.winLoss).toFixed(
                                              2
                                            )}`,
                                    },
                                    {
                                      label: "Order time",
                                      value: new Date(
                                        bet.timestamp
                                      ).toLocaleString("en-GB"),
                                    },
                                  ].map((row, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        py: 2,
                                        px: 1,
                                        border: "0.4rem solid #ffffff",
                                        backgroundColor: "#f6f6f6",
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.label}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.label === "Amount after tax" ? (
                                          <Typography sx={{ color: "red" }}>
                                            {row.value}
                                          </Typography>
                                        ) : row.label === "Result" ? (
                                          <Typography
                                            sx={{
                                              color: "black",
                                              fontSize:
                                                Number(row.value) >= 0 &&
                                                Number(row.value) <= 4
                                                  ? "16px"
                                                  : "16px",
                                            }}
                                          >
                                            {row.value}{" "}
                                            {Number(row.value) >= 0 &&
                                            Number(row.value) <= 4 ? (
                                              <span
                                                style={{ color: "#6ea8f4" }}
                                              >
                                                Small
                                              </span>
                                            ) : (
                                              <span
                                                style={{ color: "#feaa57" }}
                                              >
                                                Big
                                              </span>
                                            )}{" "}
                                            {Number(row.value) === 0 ? (
                                              <span style={{ color: "green" }}>
                                                Green
                                              </span>
                                            ) : [1, 3, 7, 9].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "green" }}>
                                                Green
                                              </span>
                                            ) : [2, 4, 6, 8].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "red" }}>
                                                Red
                                              </span>
                                            ) : Number(row.value) === 5 ? (
                                              <span style={{ color: "red" }}>
                                                Red
                                              </span>
                                            ) : (
                                              <span style={{ color: "black" }}>
                                                Unknown
                                              </span>
                                            )}
                                          </Typography>
                                        ) : row.label === "Win/lose" ? (
                                          <Typography
                                            sx={{
                                              color:
                                                Number(
                                                  row.value.replace(
                                                    /[^0-9.-]+/g,
                                                    ""
                                                  )
                                                ) >= 0
                                                  ? "green"
                                                  : "red",
                                            }}
                                          >
                                            {row.value}
                                          </Typography>
                                        ) : (
                                          row.value
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Grid>
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>

          {winner && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-2xl font-bold mb-4">Race Finished!</div>
                <div className="text-3xl text-orange-500 font-bold">
                  Car #{winner} Wins!
                </div>
                <div className="my-4 flex justify-center">
                  <img
                    src={carImages[winner]}
                    alt={`Car #${winner}`}
                    className="h-16 object-contain"
                  />
                </div>
                <div
                  className={`rounded-full w-20 h-20 ${carColors[winner]} flex items-center justify-center text-white text-3xl mx-auto mb-4`}
                >
                  {winner}
                </div>
                <div className="text-lg">New race starting soon...</div>
              </div>
            </div>
          )}
        </div>
        <br />
        <br />
        <br />
      </Mobile>
    </div>
  );
};

export default Head;
//order id updated
