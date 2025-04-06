
import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CSSTransition } from "react-transition-group";
import { makeStyles } from "@mui/styles";
import { Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import messageIcon from "../../public/headerIcon/newMessageIcon.png";

import {  
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  List,
  Chip,
  Tabs,
  ListItem,
  Container,
  LinearProgress,
  Avatar,
  styled,
} from "@mui/material";
import { Whatshot } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomerIcon from "../assets/svgexport-3.svg"; 
import Games from "./Games";
import SvgIcon from "@mui/material/SvgIcon";
import LoadingLogo from "./LoadingLogo";
import DepositModal from "../Pages/depositModal"; // Adjust the path as needed
import NotificationModal from "../Components/NotificationPopup";
import Winscroll from "./Winscroll";
import Stage from "./Stage";
import { MessageCircleIcon } from "lucide-react";
import { width } from "@mui/system";
const Tab = styled(Container)(({ theme }) => ({
  textAlign: "center",
  borderRadius: "10px",
  padding: theme.spacing(1),
  overflow: "hidden",
}));

const MySvgIcon = () => (
  <img
    src="https://goagameb.com/assets/svg/redhomeN-ae7073a2.svg"
    alt="icon"
    style={{ width: "12px", height: "12px", marginRight: "-5px" }}
  />
);

const Loteria = [
  {
    id: 1,
    imgSrc: "/assets/wingo.png",
    game: "Win Go",
    path: "/timer/1min",
  },
  {
    id: 2,
    imgSrc: "/assets/k3.png",
    game: "k3",
    path: "/k3/1min",
  },
  {
    id: 3,
    imgSrc: "../../games/assets/TRX.png",
    game: "5d",
    path: "/5d/1min",
  },
];

const profitList = [
  {
    name: "Mem***EFJ",
    rank: "NO1",
    rankImg: "/assets/no1-5c6f8e80.png",
    price: "₹4,105,048.82",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***DEC",
    rank: "NO2",
    rankImg: "/assets/no2-1683c744.png",
    price: "₹721,223.44",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***HVK",
    rank: "NO3",
    rankImg: "/assets/no3-95e1b4d0.png",
    price: "₹533,333.20",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***XTT",
    rank: "NO4",
    price: "₹454,093.24",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***EME", 
    rank: "NO5",
    price: "₹4,322,311.72",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
];

const useStyles = makeStyles({
  tabContainer: {
    transitionTimingFunction: "cubic-bezier(0.5, 0.5, 0.5, 0.99)",
    transitionDuration: "360ms",
    transform: "translate3d(0px, 0px, 0px)",
  },
  activeTab: {
    color: "rgb(22, 119, 255)",
  },
  inactiveTab: {
    display: "none",
  },
  tabItem: {
    display: "flex",
    alignItems: "center",
  },
  activeLine: {
    transition: "300ms",
    width: "0px",
    height: "3px",
    transform: "translate3d(41px, 0px, 0px)",
    backgroundColor: "rgb(22, 119, 255)",
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  transition: "transform 0.5s ease-in-out",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const win = [
  {
    txt: "Mem***GGD",
    image: "/assets/7-00479cfa.png",
    txt2: "28.09",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***DHF",
    image: "/assets/8-ea087ede.png",
    txt2: "39.03",
    image1: "/assets/20240830_115031.png",
  },
  {
    txt: "Mem***SKL",
    image: "/assets/9-6d772f2c.png",
    txt2: "13.36",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***PID",
    image: "/assets/13-5676d43f.png",
    txt2: "16.90",
    image1: "/assets/20240830_115031.png",
  },
  {
    txt: "Mem***JYR",
    image: "/assets/8-ea087ede.png",
    txt2: "69.03",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***MKL",
    image: "/assets/9-6d772f2c.png",
    txt2: "139.03",
    image1: "/assets/20240830_114902.png",
  },
];

const Home = ({ children }) => {
  const [winners, setWinners] = useState(win || []); // Default to empty array if `win` is undefined or not set

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWinners((prevWinners) => {
        if (prevWinners.length === 0) return prevWinners; // Prevent errors if no winners
        const lastWinner = prevWinners[prevWinners.length - 1];
        const newWinners = [lastWinner, ...prevWinners.slice(0, -1)];
        return newWinners;
      });
    }, 2000); // Adjust the timing as needed
    return () => clearInterval(interval);
  }, []);

  const lastWinner = winners.length > 0 ? winners[winners.length - 1] : null;
  const otherWinners = winners.length > 1 ? winners.slice(0, -1) : [];

  const images = [
    {
      id: 1,
      src: "assets/images/dragon1.jpg",
      alt: "First Image",
    },
    {
      id: 2,
      src: "assets/images/dragon2.jpg",
      alt: "Second Image",
    },
    {
      id: 3,
      src: "assets/images/dragon3.jpg",
      alt: "Third Image",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  });

  const imageUrls = [
    "assets/images/gamecategory_20231215033613klhe.png",
    "assets/images/gamecategory_202312150336204mtb.png",
    "assets/images/gamecategory_20231215033607yi17.png",
    "assets/images/gamecategory_20231215033600k8os.png",
    "assets/images/gamecategory_20231215033554mpgb.png",
    "assets/images/gamecategory_20231215033528g3gt.png",
    "assets/images/gamecategory_2023121503353389nc.png",
    "assets/images/gamecategory_202312150336366phx.png",
  ];

  const [subtitles] = useState([
    "Lottery",
    "Slots",
    "Sports",
    "Casino",
    "PVC",
    "Finishing",
    "Mini games",
    "Popular",
  ]);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const imageUrl = "assets/images/lottery-7b8f3f55.png";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/head"); // Navigate to the specified link
  };
  const handleClick1 = () => {
    navigate("/k3"); // Navigate to the specified link
  };
  const handleClick2 = () => {
    navigate("/trx"); // Navigate to the specified link
  };

  const [activeTab, setActiveTab] = useState(0); // Add this line

  const handleDownload = () => {
    // Programmatically click the hidden anchor tag
    const link = document.createElement("a");
    link.href = `/assets/747lottery.apk`; // Change this to the actual path of the APK file on your server
    link.download = "747lottery.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const imageurl = [
    
    {
      image: "/assets/banners/b1.jpg",
      txt: "Welcome to our 747Lottery Website our customer service never sends a link to the member.",
    },
    {
      image: "/assets/banners/b2.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/b3.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/b4.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/b5.jpg",
      txt: "Welcome to our 747Lottery Website our customer service never sends a link to the member.",
    },
    {
      image: "/assets/banners/b6.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/b7.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/b8.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
   
  ];

  const TabIcon = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      style={{
        width: "24px",
        height: "24px",
        marginRight: "8px",
      }}
    />
  );

  const Header = styled(Box)(({ theme }) => ({
    overflow: "hidden",
    position: "relative",
    paddingLeft: "10px",
    paddingRight: "10px",
    marginTop: "-15px",
  }));
  const ImageWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "auto",
  }));

  const textArray = [
    "Welcome to the 747 Lottery Games! Greetings, Gamers and Enthusiasts!",
    "The 747 Lottery Games are here to provide excitement and fun.",
    "For your convenience and account safety, please ensure",
    "you fill in the genuine mobile number registered with your bank.",
    "Thank you for your cooperation and enjoy the games!",
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

  const handleTabClick = async (path) => {
    navigate(path);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
    }, 2000);
    // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [imageurl.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
    }, 4000);
    // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [imageurl.length]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    // Cleanup function to clear the timeout if the component unmounts before 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const numberOfItems = Loteria.length;

  const [tabValue, setTabValue] = useState(2); // 'Mini games' tab is active by default

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [showModal, setShowModal] = useState(false);

  // Modified modal handling logic
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(true);

  // We don't need this useEffect anymore since we're showing the notification modal
  // only after deposit modal is closed
  /* 
  useEffect(() => {
    // Automatically show NotificationModal 2 seconds after component mounts
    const timer = setTimeout(() => {
      setNotificationModalOpen(true);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  */

  const handleNotificationClose = () => {
    setNotificationModalOpen(false);
  };

  const handleDepositModalClose = () => {
    setDepositModalOpen(false);
    // Show notification modal after deposit modal is closed
    setTimeout(() => {
      setNotificationModalOpen(true);
    }, 300); // Small delay for better user experience
  };


  const TransitionContainer = styled('div')(({ theme }) => ({
    '&.message-h-enter': {
      transform: 'translateX(100%)',
      opacity: 0,
    },
    '&.message-h-enter-active': {
      transform: 'translateX(0)',
      opacity: 1,
      transition: 'transform 500ms, opacity 500ms',
    },
    '&.message-h-exit': {
      transform: 'translateX(0)',
      opacity: 1,
    },
    '&.message-h-exit-active': {
      transform: 'translateX(-100%)',
      opacity: 0,
      transition: 'transform 500ms, opacity 500ms',
    }
  }));

  return (
    <div style={{ position: "relative" }}>
      <Mobile>
       
        <DepositModal
          open={isDepositModalOpen}
          onClose={handleDepositModalClose}
        />
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{
            backgroundColor: "#F7F8FF",
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "1px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#F7F8FF",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#F7F8FF",
            },
          }}
        >
          <Box flexGrow={1} sx={{ backgroundColor: "white" ,marginBottom:"10px"}}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "white",
                padding: "0px 1px",
                color: "white",
              }}
            >
              {/* Left Side - Logo */}
              <Grid item xs={6} textAlign="left">
                <img
                  src="/assets/banners/white.png"
                  alt="logo"
                  style={{ width: "100px", height: "35px",marginLeft:"10px" }}
                />
              </Grid>

              {/* Right Side - Icons */}
              <Grid item xs={6} textAlign="right">
                {/* Message Icon with Red Notification Dot */}
                <Badge
                  variant="dot"
                  color="error"
                  sx={{
                    "& .MuiBadge-dot": {
                      width: 8,
                      height: 8,
                      backgroundColor: "red",
                      opacity: 0.5,
                      top: 10,
                      right: 15,
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      borderRadius: 2,
                      marginRight: "8px",
                    }}
                    onClick={() => {navigate("/messages")}}
                  >
                   
                   <img src="https://www.66lottery9.com/static/home/notifyIcon.png" style={{
                    width:"23px",
                    height:"23px"
                   }}/>
                  </IconButton>
                </Badge>

                {/* Download Button */}
                <IconButton
                  sx={{
                    borderRadius: 2,
                  }}
                  onClick={handleDownload}
                >
                  <DownloadIcon sx={{ fontSize: 20, color: "pink" }} />
                </IconButton>
              </Grid>
            </Grid>
            <br/>
            {/* //content */}
            <Header>
              <ImageWrapper>
                <img
                  src={imageurl[currentImageIndex].image}
                  alt={`Banner ${currentImageIndex + 1}`}
                  style={{
                    marginTop: "0px",
                    borderRadius: 10,
                    width: "100%",
                    height: "155px",
                  }}
                />
              </ImageWrapper>
            </Header>
            
            <Grid
              item
              sx={{
                backgroundColor: "#FFFFFF",
                marginTop: "5px",
                borderRadius: "25px",
                padding: "2px 5px", // Adjust padding to make room for the button and text
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden", // Ensure content stays within the box,
                marginBottom:"3px"
              }}
            >
              
              <img src="https://in.piccdn123.com/static/_template_/orange/img/notice.png" style={{
                width:"20px",
                marginLeft:"10px"
              }}/>

<Box sx={{ flex: 1, overflow: "hidden", padding: "0 10px" }}>
  <CSSTransition
    in={inProp}
    timeout={500}
    classNames={{
      enter: "message-h-enter",
      enterActive: "message-h-enter-active",
      exit: "message-h-exit",
      exitActive: "message-h-exit-active",
    }}
    unmountOnExit
  >
    <TransitionContainer>
      <Typography
        sx={{
          color: "#303A4C",
          display: "block",
          textAlign: "left",
          overflow: "hidden",
          fontFamily: "Bahnschrift",
          fontWeight: 400,
          fontSize: "13px",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {textArray[index]}
      </Typography>
    </TransitionContainer>
  </CSSTransition>
</Box>

              <Button
                variant="outlined"
                sx={{
                  borderColor: "rgb(245,68,68)",
                  color: "white",
                  background: "rgb(245,68,68)",
                  "&:hover": {
                    borderColor: "rgb(245,68,68)",
                    background: "rgb(245,68,68)",
                  },
                  borderRadius: "50px",
                  textTransform: "initial",
                  padding: "1px 5px",
                  fontFamily: "Bahnschrift",
                  fontWeight: 400,
                  fontSize: "13px",
                }}
              >
                <img src="https://in.piccdn123.com/static/_template_/orange/img/hot_icon.png" style={{
                  width:"15px"
                }}/>
                Detail
              </Button>
            </Grid>

            {/* All game cards section */}
            <Games />
            
            {/* Winning Information */}
            <Box
              display="flex"
              alignItems="center"
              mt={2}
              ml={2}
              mb={-1}
              sx={{
                fontSize: "16px",
                fontWeight: 900,
                fontFamily: "Arial, sans-serif",
                color: "#333",
                mb: 3,
                borderLeft: "3px solid #F95959",
                pl: 1, // Add padding to the left
                lineHeight: "1.5", // Adjust line height to control border height
                width: "fit-content",
              }}
            ></Box>
            <Winscroll />
            <Stage />

            <br />
            <br />
            <br />
            <br />
            <br />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default Home;