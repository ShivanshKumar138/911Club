import React from "react"
import Mobile from "./Mobile"
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom"
import Depositissue from "./Depositissue";

const ActivityRules = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }
  return (
    <Mobile>
        <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#4782ff", py: 1 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "white", ml: -2 }} // White color for the icon
                onClick={handleBackClick}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "white", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
               Deposit Issue
              </Typography>
            </Grid>
          </Grid>
      <Box >
  
        <Depositissue />
      </Box>
    </Mobile>
  )
}

export default ActivityRules