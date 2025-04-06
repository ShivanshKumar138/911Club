import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Mobile from '../Components/Mobile';
import { Typography, Grid, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Button } from '@mui/material';
import { Refresh, AccountBalanceWallet, VolumeUp } from '@mui/icons-material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import NoteIcon from '@mui/icons-material/Note';
import { Tabs, Tab, Divider, Pagination, Card, CardHeader, CardContent } from '@mui/material';
import { Drawer } from '@mui/material';
import { doc, updateDoc, collection, addDoc, onSnapshot, serverTimestamp, getDoc, getDocs } from 'firebase/firestore';
// import { auth, db } from '../firebase/config'; // replace with your Firebase config file
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { CSSTransition } from 'react-transition-group';
import '../App.css';
import './style.css';

import io from 'socket.io-client';
import useSound from 'use-sound';
import {
  Paper,
  ButtonBase,
} from '@mui/material';
const countdownSound = new Audio('/assets/sound.mp3');
countdownSound.loop = true;

const images = [
  { id: 1, src: 'games/assets/time-5d4e96a3.png', altSrc: 'games/assets/time_a-afd768a9.png', subtitle: '1Min' },
  { id: 2, src: 'games/assets/time-5d4e96a3.png', altSrc: 'games/assets/time_a-afd768a9.png', subtitle: '3Min' },
  { id: 3, src: 'games/assets/time-5d4e96a3.png', altSrc: 'games/assets/time_a-afd768a9.png', subtitle: '5Min' },
  { id: 4, src: 'games/assets/time-5d4e96a3.png', altSrc: 'games/assets/time_a-afd768a9.png', subtitle: '10Min' },
];

const columns = [
  { id: 'period', label: 'Period' },
  { id: 'period', label: 'Sum' },
  { id: 'color', label: 'Result' },
];







const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};


const CustomTable = ({ data }) => {
  const pageSize = 10;
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Grid container>
    {columns.map((column) => (
      <Grid item xs={true} key={column.id}  sx={{ backgroundColor: 'RGB(255,153,1)', color: 'white', padding: '3px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", fontSize: '0.8rem' }}>
        {column.label}
      </Grid>
    ))}
    <Divider />
    {paginatedData.map((row) => (
      <React.Fragment key={row.id}>
        <Grid itemxs={true} sx={{ padding: '8px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'left', fontSize: "10px", fontWeight: "bold" }}>
          {row.period}
        </Grid>
          <Grid item xs={true} sx={{
            padding: '8px',
            borderBottom: '1px solid #ccc',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'center',
            background: Array.isArray(row.color) && row.color.length === 2 ? `linear-gradient(to bottom, ${row.color[0]} 50%, ${row.color[1]} 50%)` : row.color[0],
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            {row.number}
          </Grid>
          <Grid itemxs={true} sx={{ padding: '8px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'capitalize', fontWeight: "bold", fontSize: "10px" }}>
            {row.big_small}
          </Grid>
          <Grid item xs={3} sx={{ padding: '8px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Array.isArray(row.color) ? row.color.map((color, index) => (
              <div
                key={index}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  marginRight: index < row.color.length - 1 ? '5px' : '0', // Add margin to all but the last color
                }}
              />
            )) : (
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: row.color,
                }}
              />
            )}
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Pagination count={Math.ceil(data.length / pageSize)} page={page} onChange={handleChangePage} />
      </Grid>
    </Grid>
  );
};


const RowVisualization = ({ data }) => {
  const [numRows, setNumRows] = useState(10);

  const handleLoadMore = () => {
    console.log('Load More button clicked');
    setNumRows(numRows + 10);
  };
  const displayData = data.slice(0, numRows);
  return (
    <div>
      {displayData.map((row, rowIndex) => (
        <div key={row.id} style={{ display: 'flex', flexDirection: 'row', margin: '20px 0', position: 'relative' }}>
          <div style={{ width: '50px', fontSize: "10px" }}>{row.period}</div>
          {Array.from({ length: 10 }).map((_, circleIndex) => {
            const isColored = circleIndex === Number(row.number.trim());
            return (
              <div
                key={circleIndex}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  margin: '0 5px',
                  background: isColored
                    ? (Array.isArray(row.color) && row.color.length === 2
                      ? `linear-gradient(to right, ${row.color[0]} 50%, ${row.color[1]} 50%)`
                      : row.color)
                    : 'transparent',
                  color: isColored ? 'white' : 'black'
                }}
              >
                {circleIndex}
              </div>
            );
          })}
          {rowIndex < data.length - 1 && (
            <svg style={{ position: 'absolute', top: 0, left: '50px', right: 0, bottom: 0 }}>
              <path
                d={`M${(Number(row.number.trim()) * 30 + 15)} 20 Q ${(Number(row.number.trim()) + Number(data[rowIndex + 1].number.trim())) * 15 + 15} 40 ${(Number(data[rowIndex + 1].number.trim()) * 30 + 15)} 60`}
                stroke="black"
                fill="transparent"
              />
            </svg>
          )}
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleLoadMore}>
        Load More
      </Button>
    </div>
  );
};



const LotteryApp = () => {

  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState('1Min');
  const [timer, setTimer] = useState(60); // 60 seconds = 1 minute
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [winner, setWinner] = useState(null);

  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const socket = io('https://111club.online/'); // Connect to WebSocket server

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('timers', (data) => {
      setTimer(data);
      if (data && data[selectedTimer]) {
        setTimer(data[selectedTimer].remainingTime);
        setPeriodId(data[selectedTimer].periodId); // Set the periodId
        setRemainingTime(data[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error('Unexpected data structure', data);
      }
    });

    return () => socket.disconnect(); // Cleanup WebSocket connection
  }, [selectedTimer]);
  const handleClick = (id) => {
    let timerKey;
    switch (id) {
      case 1:
        timerKey = '1min';
        break;
      case 2:
        timerKey = '3min';
        break;
      case 3:
        timerKey = '5min';
        break;
      case 4:
        timerKey = '10min';
        break;
      default:
        timerKey = '1min';
    }

    setSelectedTimer(timerKey);
    setActiveId(id);
  };


  const textArray = [
    "ATTENTION TC ! Live chats are available on our apps/website",
    "Second message",
    "Third message"
  ];
  
  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);
  
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
  


  //   table 
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPeriodId, setBetPeriodId] = useState(null);


  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [gameResult, setGameResult] = useState('');
  
  
  // ...



  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(amount);
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };

  const uid = auth.currentUser.uid;

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      setUserData(doc.data());
    });

    return () => unsubscribe();
  }, [uid]);
  const handlePlaceBet = async () => {
    const totalBet = betAmount * multiplier;

    // Check if user's wallet balance is less than the total bet amount
    if (userData.wallet < totalBet) {
      alert("You don't have enough balance to place this bet.");
      return;
    }

    const betData = {
      selectedItem: selectedItem,
      betAmount: betAmount,
      multiplier: multiplier,
      totalBet: totalBet,
      selectedTimer: selectedTimer,
      periodId: periodId,
      userUid: uid,
      timestamp: serverTimestamp(),
    };
    setBetPlaced(true);
    setBetPeriodId(periodId);
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      wallet: (userData.wallet - totalBet) // decrement the wallet value
    });

    // Add the bet data to the betHistory subcollection
    const timerRef = doc(db, 'timers', selectedTimer);
    const periodRef = collection(timerRef, 'periods');
    const periodDocRef = doc(periodRef, periodId);
    const betsRef = collection(periodDocRef, 'bets');
    await addDoc(betsRef, betData)

    // Add the bet data to the betHistory subcollection of the user's document
    const betHistoryRef = collection(userRef, 'betHistory');
    await addDoc(betHistoryRef, betData);

    const transactionsRef = collection(userRef, 'transactions');
    await addDoc(transactionsRef, {
      amount: totalBet,
      type: 'bet',
      timestamp: serverTimestamp() // Import this from Firebase
    });

    // Calculate and distribute commission
    if (userData.referral) {
      let currentUser = userData;
      let level = 1;
      while (currentUser.referral && level <= 5) {
        const referrerRef = doc(db, 'users', currentUser.referral);
        const referrerSnap = await getDoc(referrerRef);
        const referrer = referrerSnap.data();

        // Calculate commission
        const commission = totalBet * 0.02; // 2% commission

        // Update referrer's wallet and commission for the current level
        await updateDoc(referrerRef, {
          wallet: Number(referrer.wallet || 0) + commission,
          [`commissionLevel${level}`]: Number(referrer[`commissionLevel${level}`] || 0) + commission
        });

        // Update totalBetAmount and totalCommissionReceived for the referrer
        const referralIndex = referrer.referrals.findIndex(referral => referral.userId === currentUser.UID);
        if (referralIndex !== -1) {
          const dailyDepositIndex = referrer.referrals[referralIndex].dailyDeposit.length - 1;
          referrer.referrals[referralIndex].dailyDeposit[dailyDepositIndex].totalBetAmount = Number(referrer.referrals[referralIndex].dailyDeposit[dailyDepositIndex].totalBetAmount || 0) + betAmount;
          referrer.referrals[referralIndex].dailyDeposit[dailyDepositIndex].totalCommissionReceived = Number(referrer.referrals[referralIndex].dailyDeposit[dailyDepositIndex].totalCommissionReceived || 0) + commission;
        } else {
          referrer.referrals.push({
            userId: currentUser.UID,
            dailyDeposit: [{
              totalBetAmount: betAmount,
              totalCommissionReceived: commission,
            }],
          });
        }
        await updateDoc(referrerRef, {
          referrals: referrer.referrals
        });

        // Create a transaction document for the commission
        const referrerTransactionsRef = collection(referrerRef, 'transactions');
        await addDoc(referrerTransactionsRef, {
          amount: commission,
          type: 'commission',
          commissionType: `level${level}`,
          timestamp: serverTimestamp() // Import this from Firebase
        });

        // Move to next level
        currentUser = referrer;
        level++;
      }
    }

    handleCloseDrawer();
  };

  const handleCancelBet = () => {
    setSelectedItem('');
    setBetAmount(1);
    setMultiplier(1);
    setTotalBet(0);
    handleCloseDrawer();
  };

  useEffect(() => {
    handleClick(images[0].id);
  }, []);
  // Inside your Head component...


  useEffect(() => {
    const socket = io('https://111club.online/'); // Connect to WebSocket server

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('selectTimer', selectedTimer); // Send selected timer to server
    });
    socket.on('results', (data) => {
      setRows(data.map(item => ({
        id: item.periodId,
        period: ` ${item.periodId}`,
        number: ` ${item.numberOutcome}`,
        big_small: item.sizeOutcome,
        color: item.colorOutcome,
      })));

      // Find the result for the bet period
      const result = data.find(item => String(item.periodId) === String(betPeriodId));

      if (betPlaced && result) {
        // Check if the user's prediction matches the results
        if (selectedItem === result.numberOutcome || selectedItem === result.sizeOutcome || result.colorOutcome.map(color => color.toLowerCase()).includes(selectedItem.toLowerCase())) {
        
          console.log('You won!');
          // Calculate the winnings
          let winnings = 0;
          switch (selectedItem.toLowerCase()) {
            case String(result.numberOutcome):
              winnings = betAmount * 9;
              break;
            case 'red':
            case 'green':
            case String(result.sizeOutcome):
              winnings = betAmount * 2;
              break;
            case 'violet':
              winnings = betAmount;
              break;
            default:
              console.log('Invalid bet');
          }
          setDialogContent(`You won! Your bet of ${betAmount} has resulted in winnings of ${winnings}. Your new wallet balance is ${userData.wallet + winnings}.`);
          setGameResult('won');
          setOpen(true);
          // Update the user's wallet balance in the Firestore database
          const userRef = doc(db, 'users', uid);
          updateDoc(userRef, {
            wallet: userData.wallet + winnings
          });

          // Add a transaction for the winnings
          const transactionRef = collection(db, 'users', uid, 'transactions');
          addDoc(transactionRef, {
            amount: winnings,
            type: 'wingo',
            timestamp: serverTimestamp()
          });
        } else {
          console.log('You lost!');
          setDialogContent(`You lost! Your bet of ${betAmount} has been deducted from your wallet. Your new wallet balance is ${userData.wallet - betAmount}.`);
          setGameResult('lost');
          setOpen(true);
        }

        setBetPlaced(false); // Reset the betPlaced flag
        setBetPeriodId(null); // Reset the betPeriodId
      }
    });

    return () => socket.disconnect(); // Cleanup WebSocket connection

    return () => socket.disconnect(); // Cleanup WebSocket connection
  }, [selectedTimer, betPlaced, periodId, selectedItem]);

  useEffect(() => {
    if (remainingTime === 3) {
      setOpenDialog(true);
      countdownSound.play();
    } else if (remainingTime === 0) {
      setOpenDialog(false);
      countdownSound.pause();
      countdownSound.currentTime = 0;
    }
  }, [remainingTime]);

  const [selectedColor, setSelectedColor] = useState('RGB(242,142,23)');
  const handleEventSelection = (event) => {
    // ... your existing code ...

    switch (event) {
      case 'violet':
        setSelectedColor('RGB(182,89,254)');
        break;
      case 'green':
        setSelectedColor('RGB(64,173,114)');
        break;
      case 'red':
        setSelectedColor('RGB(253,86,92)');
        break;
      case 'yellow':
        setSelectedColor('RGB(242,142,23)');
        break;
      case 'blue':
        setSelectedColor('RGB(253,86,92)');
        break;
      default:
        setSelectedColor('RGB(242,142,23)');
    }
  };
  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);


  async function getUserBets(uid) {
    const userRef = doc(db, 'users', uid);
    const betHistoryRef = collection(userRef, 'betHistory');
    const betHistorySnapshot = await getDocs(betHistoryRef);
    const bets = betHistorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return bets;
  }

  const [bets, setBets] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
      const userBets = await getUserBets(auth.currentUser.uid);
      setBets(userBets);
    };

    fetchBets();
  }, []);



 


  const [values, setValues] = useState(0);

  const handleChanges = (event, newValue) => {
    setValues(newValue);
  };




  return (
    <div>
      <Mobile>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: '#FB9201',
            padding: '8px 16px',
            color: 'white'
          }}
        >
          <Grid item xs={6} textAlign="left">
            <IconButton color="inherit">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <IconButton color="inherit">
              <SupportAgentIcon />
            </IconButton>
            <IconButton color="inherit">
              <MusicNoteIcon />
            </IconButton>
          </Grid>
        </Grid>


        <Grid container direction="column" sx={{ height: '300px', backgroundColor: '#FE9801', borderRadius: '0 0 70px 70px', textAlign: 'center', }}>
          <Grid sx={{ backgroundColor: '#FFFFFF', margin: '0 20px 20px 20px', borderRadius: '30px', padding: '10px', marginTop: "10px" }}>
            <Grid sm={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{userData ? `\u20B9${userData.wallet}` : 'Loading...'}</Typography>
              <IconButton >
                <Refresh />
              </IconButton>
            </Grid>

            <Grid sm={12} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
              <AccountBalanceWallet sx={{ marginRight: '10px', color: "#FF9901" }} />
              <Typography variant="subtitle2">Wallet Balance</Typography>
            </Grid>
            <Grid sm={12} mt={3} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>

              <Button variant="outlined" fullWidth sx={{ marginLeft: '10px', color: "#FF9901", borderColor: "#FF9901", borderRadius: "50px" }}>
                Withdraw
              </Button>
              <Button variant="contained" fullWidth sx={{ marginLeft: '10px', backgroundColor: "#FF9901", borderRadius: "50px" }}>
                Deposit
              </Button>
            </Grid>
          </Grid>

          <Grid item sx={{ backgroundColor: '#FFFBE8', margin: '0 20px 20px 20px', borderRadius: '3px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton>
              <VolumeUp sx={{ color: "#FF9901" }} />
            </IconButton>
            <CSSTransition in={inProp} timeout={500} classNames="message" unmountOnExit>
  <Typography variant="caption" sx={{ color: "#FF9901", }}>
    {textArray[index]}
  </Typography>
</CSSTransition>

            <Button variant="contained" size='small' sx={{ backgroundColor: "#FF9901", borderRadius: "50px", fontSize: "9px", paddingLeft: "12px", paddingRight: "12px" }} startIcon={<WhatshotIcon />}>Details</Button>
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '95%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '-50px',
          backgroundColor: 'RGB(255,255,255)',
          borderRadius: '30px'
        }}>
          {images.map((image) => (
            <Grid
              item
              xs={3}
              key={image.id}
              onClick={() => handleClick(image.id)}
              style={{
                cursor: 'pointer',
                border: activeId === image.id ? '1px solid #FF9901' : 'none',
                backgroundColor: activeId === image.id ? 'rgba(255, 232, 172, 0.5)' : 'transparent',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Align items horizontally
                justifyContent: 'center', // Align items vertically
              }}
            >
              <img src={activeId === image.id ? image.altSrc : image.src} alt={image.subtitle} style={{ width: '80%' }} />
              <Typography variant="caption">{image.subtitle}</Typography>
            </Grid>
          ))}
        </Grid>


        <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={values} onChange={handleChanges} aria-label="basic tabs example">
          <Tab label="A" />
          <Tab label="B" />
          <Tab label="C" />
          <Tab label="D" />
          <Tab label="E" />
          <Tab label="SUM" />
        </Tabs>
      </Box>
      <TabPanels value={value} index={0}>
        <Typography variant="body1">Big: 2</Typography>
        <Typography variant="body1">Small: ?</Typography>
        <Typography variant="body1">Odd: 2</Typography>
        <Typography variant="body1">Even: ?</Typography>
      </TabPanels>
      <TabPanels value={value} index={1}>
        <Typography variant="body1">Big: 2</Typography>
        <Typography variant="body1">Small: 2</Typography>
        <Typography variant="body1">Odd: 2</Typography>
        <Typography variant="body1">Even: 2</Typography>
      </TabPanels>
      <TabPanels value={value} index={2}>
        <Typography variant="body1">0: 4.5</Typography>
        <Typography variant="body1">1: 4.5</Typography>
        <Typography variant="body1">2: 4.5</Typography>
        <Typography variant="body1">3: 4.5</Typography>
      </TabPanels>
      <TabPanels value={value} index={3}>
        <Typography variant="body1">4: 4.5</Typography>
        <Typography variant="body1">5: 4.5</Typography>
        <Typography variant="body1">6: 4.5</Typography>
        <Typography variant="body1">7: 4.5</Typography>
      </TabPanels>
      <TabPanels value={value} index={4}>
        <Typography variant="body1">8: 4.5</Typography>
        <Typography variant="body1">9: 4.5</Typography>
      </TabPanels>
      <TabPanels value={value} index={5}>
        <Typography variant="h5">SUM</Typography>
      </TabPanels>
    </Box>
  

        



        <Drawer anchor="bottom" open={drawerOpen} onClose={handleCloseDrawer}  >
          <Grid container alignItems="center">
            <Grid item xs={12} align="center" style={{
              position: 'relative',
              marginBottom: "20px",
              height: "100px",
              color: "white",
              backgroundColor: 'transparent'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: selectedColor,
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)'
              }}></div>
              <div style={{ position: 'relative' }}>
                <Typography variant="h6">{`Win Go ${selectedTimer}`}</Typography>
                <Typography variant="body1">{`${selectedItem} is selected`}</Typography>
              </div>
            </Grid>

            <Grid item xs={12}>

              <Grid container justifyContent="space-between">
                <Typography variant="h6">Balance</Typography>
                <Button variant="contained" style={{ borderRadius: 50, backgroundColor: activeBetAmount === 1 ? selectedColor : undefined }} onClick={() => { handleBetAmount(1); setActiveBetAmount(1); }}>{"\u20B9" + "1"}</Button>
                <Button variant="contained" style={{ borderRadius: 50, backgroundColor: activeBetAmount === 10 ? selectedColor : undefined }} onClick={() => { handleBetAmount(10); setActiveBetAmount(10); }}>{"\u20B9" + "10"}</Button>
                <Button variant="contained" style={{ borderRadius: 50, backgroundColor: activeBetAmount === 100 ? selectedColor : undefined }} onClick={() => { handleBetAmount(100); setActiveBetAmount(100); }}>{"\u20B9" + "100"}</Button>
                <Button variant="contained" style={{ borderRadius: 50, backgroundColor: activeBetAmount === 1000 ? selectedColor : undefined }} onClick={() => { handleBetAmount(1000); setActiveBetAmount(1000); }}>{"\u20B9" + "1000"}</Button>
              </Grid>

            </Grid>
            <Grid item xs={12} mt={2}>

              <Grid container  >

                <Grid item container direction="row" justifyContent="space-between" align="center" alignItems="center">
                  <Typography variant="h6">Quantity</Typography>
                  <div className="button1" onClick={() => setMultiplier(multiplier > 1 ? multiplier - 1 : 1)}>-</div>

                  <Typography variant="body1" style={{ border: "1px solid black", width: "50px" }}>{multiplier}</Typography>
                  <div className="button1" onClick={() => setMultiplier(multiplier + 1)}>+</div>

                </Grid>
              </Grid>


            </Grid>
            <Grid item xs={12} mt={2}>
              <Grid container justifyContent="flex-end">
                <div className={`button ${activeButton === 1 ? 'active' : ''}`} onClick={() => { handleMultiplier(1); setActiveButton(1); }} style={activeButton === 1 ? { backgroundColor: selectedColor } : {}}>X1</div>
                <div className={`button ${activeButton === 5 ? 'active' : ''}`} onClick={() => { handleMultiplier(5); setActiveButton(5); }} style={activeButton === 5 ? { backgroundColor: selectedColor } : {}}>X5</div>
                <div className={`button ${activeButton === 10 ? 'active' : ''}`} onClick={() => { handleMultiplier(10); setActiveButton(10); }} style={activeButton === 10 ? { backgroundColor: selectedColor } : {}}>X10</div>
                <div className={`button ${activeButton === 20 ? 'active' : ''}`} onClick={() => { handleMultiplier(20); setActiveButton(20); }} style={activeButton === 20 ? { backgroundColor: selectedColor } : {}}>X20</div>
                <div className={`button ${activeButton === 50 ? 'active' : ''}`} onClick={() => { handleMultiplier(50); setActiveButton(50); }} style={activeButton === 50 ? { backgroundColor: selectedColor } : {}}>X50</div>
                <div className={`button ${activeButton === 100 ? 'active' : ''}`} onClick={() => { handleMultiplier(100); setActiveButton(100); }} style={activeButton === 100 ? { backgroundColor: selectedColor } : {}}>X100</div>
              </Grid>
            </Grid>


            <Grid item xs={12} mt={2}>
              <Grid container justifyContent="space-around" spacing={0}>
                <Grid item xs={3}>
                  <Button onClick={handleCancelBet} fullWidth style={{ backgroundColor: "black" }} variant="contained">Cancel</Button>

                </Grid>
                <Grid item xs={9}>
                  <Button onClick={handlePlaceBet} fullWidth style={{ background: selectedColor }} variant="contained">{`Total Bet: ${betAmount * multiplier}`}</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Drawer>

        <Dialog
          open={openDialog}

          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              width: '400px', // Set this to the desired size of your square
              height: '400px', // Set this to the same value as width
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // This sets the opacity of the dialog box background
              overflow: 'hidden', // This removes the scrollbars
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Countdown"}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              style={{

                textAlign: 'center',
                fontSize: '150px', // Adjust this value to increase or decrease the font size
                fontWeight: 'bold',
                color: "RGB(243,144,24)" // This makes the text bold
              }}
            >
              {remainingTime}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Grid mt={2} sx={{ marginBottom: "100px" }} >
          <Tabs value={value} onChange={handleChange} indicatorColor="transparent" style={{
            marginLeft: '20px'
          }}>
            <Tab label="Game History" style={value === 0 ? { backgroundColor: 'RGB(255,153,1)', color: 'white', borderRadius: "20px" } : {}} />
            <Tab label="Chart" style={value === 1 ? { backgroundColor: 'RGB(255,153,1)', color: 'white', borderRadius: "20px" } : {}} />
            <Tab label="My History" style={value === 2 ? { backgroundColor: 'RGB(255,153,1)', color: 'white', borderRadius: "20px" } : {}} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <CustomTable data={rows} />
          </TabPanel>
          <TabPanel value={value} index={1}>

            <RowVisualization data={rows} />
          </TabPanel>
          <TabPanel value={value} index={2}>


            <Grid container spacing={2} sx={{ padding: '16px' }}>
              {bets.slice().reverse().map((bet, index) => ( // Slice and reverse the array
                <Grid item xs={12} key={bet.id}>
                  <Card sx={{ borderRadius: '15px', padding: '10px', backgroundColor: 'RGB(255,255,255)' }}>
                    <CardHeader
                      title={`Bet #${bets.length - index}`}
                      titleTypographyProps={{ align: 'left', variant: 'body2' }}
                      style={{ backgroundColor: 'RGB(251,146,1)', color: 'white', height: '10px', lineHeight: '40px' }}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={3} style={{ backgroundColor: 'RGB(241,243,255)', marginTop: '10px', padding: "10px" }}>
                          <Typography variant="caption">Period ID:</Typography>
                        </Grid>
                        <Grid item xs={9} style={{ textAlign: 'right', backgroundColor: 'RGB(241,243,255)', marginTop: '10px', padding: "10px" }}>
                          <Typography variant="caption">{bet.periodId}</Typography>
                        </Grid>
                        <Grid item xs={3} style={{ backgroundColor: 'RGB(241,243,255)', marginTop: '10px', padding: "10px" }}>
                          <Typography variant="caption">Time:</Typography>
                        </Grid>
                        <Grid item xs={9} style={{ textAlign: 'right', backgroundColor: 'RGB(241,243,255)', marginTop: '10px', padding: "10px" }}>
                          <Typography variant="caption">{new Date(bet.timestamp.seconds * 1000).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={3} style={{ backgroundColor: 'RGB(241,243,255)', marginTop: '10px', padding: "10px" }}>
                          <Typography variant="caption">Total Bet:</Typography>
                        </Grid>
                        <Grid item xs={9} style={{ textAlign: 'right', backgroundColor: 'RGB(241,243,255)', marginTop: '10px', color: 'red', padding: "10px" }}>
                          <Typography variant="caption">₹{bet.totalBet}</Typography>
                        </Grid>
                        {/* Add more rows as needed */}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Grid>
        <>
    {/* ...rest of the code... */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle style={{ textAlign: 'center' }}>
        {gameResult === 'won' ? 'Congratulations' : 'Sorry'}
      </DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {dialogContent}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </>

      </Mobile>

    </div>

    
  )
}
function TabPanels(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: value === index ? 'block' : 'none' }}
      {...other}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}
export default LotteryApp;