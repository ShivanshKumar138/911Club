import React from "react";
import {
    Box,
    Container,
    FormControlLabel,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Typography,
  } from "@mui/material";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import FlagIcon from "@mui/icons-material/Flag";
  import { useTranslation } from "react-i18next";
  import { useNavigate } from "react-router-dom";
  import Mobile from "./Mobile";
  import Vipgames from "./Vipgames";
  
  const Allgamemain = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
  
    const handleChange = (event) => {
      i18n.changeLanguage(event.target.value);
    };
  
    return (
      <Mobile>
        <Container
          disableGutters
          maxWidth="xs"
          sx={{
            bgcolor: "#F7F8FF",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
        <Vipgames />    
        </Container>
      </Mobile>
    );
  };
  
  export default Allgamemain;
  