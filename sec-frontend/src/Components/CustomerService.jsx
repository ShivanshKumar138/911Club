import {
    Box,
    Typography,
    Container,
    List,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    Paper,
    Button,
    Grid,
  } from "@mui/material";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import HomeIcon from "@mui/icons-material/Home";
  import { useNavigate } from "react-router-dom";
  import { ChevronRight } from "lucide-react";
  import helpline from "../assets/helpline.jpg";
  import Mobile from "./Mobile";
  
  const SupportInterface = () => {
    const navigate = useNavigate();
  
    const supportOptions = [
      { icon: <img src="assets/banners/c1.png" alt="Deposit Problem" width={30} height={30} />, text: "Deposit Problem", link: "/support" },
      { icon: <img src="assets/banners/c2.png" alt="Withdrawal Issues" width={30} height={30} />, text: "Withdrawal Issues", link: "/support" },
      { icon: <img src="assets/banners/c3.png" alt="Other issues" width={30} height={30} />, text: "Other issues", link: "/support" },
      { icon: <img src="assets/banners/c4.png" alt="24/7 Online Service" width={30} height={30} />, text: "24/7 Online Service", link: "https://direct.lc.chat/19015166/" },
    ];
  
    const handleItemClick = (link) => {
      if (link.startsWith("http")) {
        window.open(link, "_blank");
      } else {
        navigate(link);
      }
    };
  
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
        <Paper sx={{ mb: 2 }}>
          <List>
            {supportOptions.map((option, index) => (
              <ListItem
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  cursor: "pointer",
                }}
                secondaryAction={<ChevronRight style={{ color: "#888" }} />}
                onClick={() => handleItemClick(option.link)}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.text} />
              </ListItem>
            ))}
          </List>
        </Paper>
  
        <Paper sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1e88e5" }}>
            Tips:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ color: "#555" }}>
              1. Please select corresponding question and submit it for review. After successful submission, the customer service specialist will handle it for you within 10 minutes. Please wait patiently.
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              2. 1-30 minutes after submitting the review, you can use [Progress Query] to view the review results of the work order you submitted.
            </Typography>
          </Box>
        </Paper>
  
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, backgroundColor: "#F95959", "&:hover": { backgroundColor: "#F95959" }, py: 1.5, borderRadius: 2 }}
        >
          Progress Query
        </Button>
      </Box>
    );
  };
  
  const CustomerService = () => {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate("/account");
    };
  
    return (
      <Mobile>
        <Container
          disableGutters
          maxWidth="xs"
          sx={{
            bgcolor: "#f5f5f5",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              bgcolor: "#F95959",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              color: "white",
            }}
          >
            <ChevronLeftIcon
              sx={{ fontSize: 30, cursor: "pointer" }}
              onClick={handleBackClick}
            />
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Customer Service
            </Typography>
            <HomeIcon sx={{ fontSize: 30 }} />
          </Box>
  
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Box
              component="img"
              src={helpline}
              alt="About us illustration"
              sx={{ width: "100%", height: "auto" }}
            />
          </Box>
  
          <SupportInterface />
        </Container>
      </Mobile>
    );
  };
  
  export default CustomerService;