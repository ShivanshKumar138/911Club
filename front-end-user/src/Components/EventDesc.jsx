import React from "react";
import {
  Typography,
  List,
  ListItem,
  Grid,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "./Mobile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

const EventDesc = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
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
                onClick={handleRedirect}
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
                Event Details
              </Typography>
            </Grid>
          </Grid>

          <Grid sx={{ mx: 1, mt: 1 }}>
            {/* Activity Time */}
            <Box sx={{ backgroundColor: "#fff", textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#4782ff",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", marginRight: "4px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#fff" }}
                >
                  Activity time
                </Typography>
              </Box>
              <Box sx={{ width: "90%", bgcolor: "#FFF", padding: "8px 16px" }}>
                <Typography variant="body2" sx={{ color: "#000", fontSize: "12px" }}>
                  From now on
                </Typography>
              </Box>
            </Box>

            {/* Validity Period */}
            <Box sx={{ backgroundColor: "#fff", mt: 1, textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#4782ff",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", marginRight: "8px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#fff" }}
                >
                  Validity period
                </Typography>
              </Box>
              <Box sx={{ width: "90%", bgcolor: "#FFF", padding: "8px 16px" }}>
                <Typography variant="body2" sx={{ color: "#000", fontSize: "12px" }}>
                  Official website notification shall prevail
                </Typography>
              </Box>
            </Box>

            {/* Red Text - Deposit Info */}

            <ListItem
              sx={{
                padding: 1,
                mt: 2,
                bgcolor: "#fff",
                borderRadius: "8px",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ color: "#f00", textAlign: "center", fontSize: "12px" }}
                  >
                    Members whose single deposit amount or accumulated deposit
                    amount reaches the set amount can participate in the
                    lottery.
                  </Typography>
                }
              />
            </ListItem>

            {/* Conditions of Participation */}
            <Box sx={{ backgroundColor: "#fff", mt: 1, textAlign: "left" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#4782ff",
                  width: "100%",
                  padding: "6px 0px",
                  clipPath: "polygon(0 0, 100% 0%, 96% 100%, 0% 100%)",
                }}
              >
                <PlayArrowIcon sx={{ color: "#fff", marginRight: "8px" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "medium", color: "#fff" }}
                >
                  Conditions of participation
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#FFF",
                  padding: "8px 0px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#000",px:2, fontSize: "12px" }}
                >
                  Members who meet the requirements of{" "}
                  <Box component="span" sx={{ color: "red" }}>
                    Vip0, Vip1, Vip2, Vip3, Vip4, Vip5, Vip6, Vip7, Vip8, Vip9,
                    Vip10
                  </Box>{" "}
                  can participate in the bigwheel event. You need to bind a bank
                  card. Hundreds of millions of cash and many other prizes are
                  up for grabs. Get ready for endless surprises and grand prizes
                  every day!
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#000", mt: 2,px:2, fontSize: "12px" }}
                >
                  Need to bind a{" "}
                  <Box component="span" sx={{ color: "red" }}>
                    Bank account
                  </Box>
                  .
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#000", fontSize: "12px", mt: 1,px:2, }}
                >
                  With hundreds of millions in cash and many other prizes up for
                  grabs, get ready for endless surprises and big prizes every
                  day!
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Mobile>{" "}
    </div>
  );
};

export default EventDesc;