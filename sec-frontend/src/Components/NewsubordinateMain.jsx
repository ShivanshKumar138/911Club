import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography, Grid, Box, Button, Paper } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "../Components/config";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Grid
  container
  alignItems="center"
  justifyContent="space-between"
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)", // Updated background color
    padding: "4px 8px",
    color: "white", // Updated text color
  }}
>
  <Grid item container alignItems="center" justifyContent="center">
    <Grid item xs={2}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ color: "white", ml: -5 }} // Updated icon color
      >
        <ArrowBackIosNewIcon />
      </IconButton>
    </Grid>
    <Grid item xs={10}>
      <Typography
        variant="h6"
        sx={{
          color: "white", // Updated text color
          flexGrow: 1,
          textAlign: "center",
          mr: 8,
        }}
      >
        New Subordinates
      </Typography>
    </Grid>
  </Grid>
</Grid>

  );
};

const DateOptions = ({ selectedOption, setSelectedOption }) => {
  return (
    <Box
      sx={{
        padding: "8px",
        backgroundColor: "#f2f2f1",
        display: "flex",
        borderRadius: "20px",
        justifyContent: "space-between",
      }}
    >
      {["Today", "Yesterday", "This month"].map((option) => (
        <Button
          key={option}
          onClick={() => setSelectedOption(option)}
          sx={{
            backgroundColor: selectedOption === option ? "#F95959" : "#ffffff",
            color: selectedOption === option ? "#ffffff" : "#000000",
            borderRadius: "10px",
            padding: "8px 16px",
            minWidth: "33%",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor:
                selectedOption === option ? "#F95959" : "#ffffff",
              color: selectedOption === option ? "#ffffff" : "#000000",
            },
            "&:not(:last-child)": {
              marginRight: "2px",
            },
          }}
        >
          {option}
        </Button>
      ))}
    </Box>
  );
};

const SubordinateList = ({ filter }) => {
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubordinates();
  }, [filter]);

  const fetchSubordinates = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/subordinate-details`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredSubordinates = filterSubordinates(
        response.data.subordinates,
        filter
      );
      setSubordinates(filteredSubordinates);
    } catch (error) {
      console.error("Error fetching subordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubordinates = (subs, filterOption) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return subs.filter((sub) => {
      const regDate = new Date(sub.registrationDate);
      switch (filterOption) {
        case "Today":
          return regDate >= today;
        case "Yesterday":
          return regDate >= yesterday && regDate < today;
        case "This month":
          return regDate >= firstDayOfMonth;
        default:
          return true;
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatMobile = (mobile) => {
    return mobile.slice(0, 3) + "****" + mobile.slice(-5);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f2f2f1",
        padding: 2,
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        subordinates.map((sub) => (
          <Box
            key={sub.uid}
            elevation={1}
            sx={{
              marginBottom: 2,
              padding: 2,
              borderBottom: "1px solid #e1e1e1",
            }}
          >
            <Grid container justifyContent="space-between" alignItems="left">
              <Grid item textAlign="left">
                <Typography color="text.secondary" fontSize={13}>
                  {formatMobile(sub.mobile)}
                </Typography>
                <Typography variant="body2">Direct subordinates</Typography>
              </Grid>
              <Grid item textAlign="right">
                <Typography color="text.secondary" fontSize={13}>
                  UID:{sub.uid}
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={13}
                  color="text.secondary"
                >
                  {formatDate(sub.registrationDate)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))
      )}
      {!loading && subordinates.length === 0 && (
        <Typography align="center" sx={{ marginTop: 2 }}>
          No more
        </Typography>
      )}
    </Box>
  );
};

const NewsubordinateMain = () => {
  const [selectedOption, setSelectedOption] = useState("This month");

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          backgroundColor="#F5F5F5"
        >
          <Navbar />
          <DateOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <SubordinateList filter={selectedOption} />
        </Box>
      </Mobile>
    </div>
  );
};

export default NewsubordinateMain;
