import React from "react";
import { Typography, Container, Box } from "@mui/material";
import Mobile from "./Mobile";
const OpenPageMain = () => {
  return (
    <Mobile>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <img
          src="assets/fuckme.png"
          alt="Main"
          style={{
            width: "100%",
            marginTop: 130,
          }}
        />

        <img
          src="assets/genzwinlogo.png"
          alt="Logo"
          style={{
            width: 200,
            marginTop: 50,
          }}
        />
      </Container>
    </Mobile>
  );
};

export default OpenPageMain;