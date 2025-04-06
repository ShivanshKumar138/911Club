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
            sx={{ bgcolor: "#8E000C", py: 1 }} // Background color for the header
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
                Activity Rules
              </Typography>
            </Grid>
          </Grid>
      <Box sx={{ mx: 2, mt: 2 }}>
        <Box
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "16px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#8E000C",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            01
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "black", my: 1, mx: 2, fontSize: "12px" }}
          >
            The event is effective from now on. The discount can only be used
            once per address, per email address, per phone number and for the
            same payment method (debit/credit card/bank account) and IP address;
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#999", mx: 2, pb:2, fontSize: "12px" }}
          >
            If a member applies repeatedly, the company reserves the right to
            cancel or withdraw member bonuses.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "16px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#8E000C",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            02
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "black", my: 1, mx: 2, fontSize: "12px" }}
          >
            All offers are specially designed for players.
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#999", mx: 2,pb:2, fontSize: "12px" }}
          >
            If any group or individual is found to be dishonestly withdrawing
            bonuses or threatening or abusing company offers, the company
            reserves the right to freeze or cancel the account and account
            balance of that group or individual.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "left",
            maxWidth: "100%",
            marginBottom: "16px",
          }}
        >
          <Box
            sx={{
              bgcolor: "#8E000C",
              py: 0.5,
              maxWidth: 100,
              margin: "0 auto",
              px: 2,
              textAlign: "center",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            03
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "black", my: 1, mx: 2, fontSize: "12px" }}
          >
            The platform reserves the right of final outcome of this event;
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#999", mx: 2, pb:2, fontSize: "12px" }}
          >
            and the right to modify or terminate the campaign without prior notice; these terms apply to all offers.
          </Typography>
        </Box>
      </Box>
    </Mobile>
  )
}

export default ActivityRules