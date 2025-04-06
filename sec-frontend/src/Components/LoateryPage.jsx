import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  styled,
  LinearProgress,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CasinoIcon from "@mui/icons-material/Casino";

import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";
import four from "../assets/four.png";
import five from "../assets/five.png";
import six from "../assets/six.png";
import Mobile from "./Mobile";

// Styled components
const ScrollableBox = styled(Box)({
  display: "flex",
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
});

// LotteryButton component with hover effect
const LotteryButton = styled(Box)(({ theme, active }) => ({
  backgroundColor: active ? "#4782ff" : "white",
  color: active ? "white" : "green",
  cursor: "pointer",
  padding: "4px 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  width: "140px",
  margin: theme.spacing(1),
  textWrap: "nowrap",
  borderRadius: "10px",
  minWidth: "15%",
}));

// OddsProgressBar styled component
const OddsProgressBar = styled(LinearProgress)(({ value }) => ({
  height: 22,
  borderRadius: 12,
  "& .MuiLinearProgress-bar": {
    borderRadius: 12,
    backgroundColor: value > 50 ? "#4782ff" : "#FF0000", // Change color based on odds value
  },
}));

const gamesData = [
  { id: 1, name: "Mines", image: one, category: "Popular", odds: "40.65%" },
  {
    id: 2,
    name: "Money Casino",
    image: two,
    category: "Popular",
    odds: "94.42%",
  },
  {
    id: 3,
    name: "Fortune Gems 2",
    image: three,
    category: "Popular",
    odds: "92.21%",
  },
  {
    id: 4,
    name: "Wildfire Wins",
    image: four,
    category: "Popular",
    odds: "93.75%",
  },
  {
    id: 5,
    name: "Fortune Coins",
    image: five,
    category: "Popular",
    odds: "95.72%",
  },
  {
    id: 6,
    name: "Galaxy Burst",
    image: six,
    category: "Popular",
    odds: "93.56%",
  },
  { id: 7, name: "Hot Spin", image: one, category: "Popular", odds: "95.76%" },
  {
    id: 8,
    name: "Flaming Buffalo",
    image: two,
    category: "Popular",
    odds: "89.51%",
  },
  { id: 9, name: "Super Ace", image: two, category: "Popular", odds: "95.82%" },
  { id: 10, name: "777", image: three, category: "Popular", odds: "92.51%" },
  {
    id: 11,
    name: "Fortune Neko",
    image: four,
    category: "Popular",
    odds: "93.46%",
  },
  {
    id: 12,
    name: "Lucky Spin",
    image: five,
    category: "Lottery",
    odds: "91.23%",
  },
  {
    id: 13,
    name: "Mega Millions",
    image: six,
    category: "Lottery",
    odds: "89.75%",
  },
  {
    id: 14,
    name: "Mini Roulette",
    image: one,
    category: "Mini games",
    odds: "96.54%",
  },
  {
    id: 15,
    name: "Quick Draw",
    image: three,
    category: "Mini games",
    odds: "94.87%",
  },
  {
    id: 16,
    name: "Skill Master",
    image: three,
    category: "Sk",
    odds: "98.21%",
  },
];

const categories = [
  "Lottery",
  "Popular",
  "Mini games",
  "Sk",
  "Al",
  "Lotter",
  "Popuar",
  "Mini gams",
  "S",
];

const GamesGrid = () => {
  const [activeCategory, setActiveCategory] = useState("Popular");

  const filteredGames =
    activeCategory === "All"
      ? gamesData
      : gamesData.filter((game) => game.category === activeCategory);

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#f5f5f5",
          height: "100vh", // Set height to full viewport height
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent content overflow
        }}
      >
        <Box
          sx={{
            bgcolor: "#4782ff",
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 30 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            All
          </Typography>
        </Box>

        <ScrollableBox my={1} sx={{ flexShrink: 0 }}>
          {categories.map((category) => (
            <LotteryButton
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              <CasinoIcon />
              <Typography variant="caption">{category}</Typography>
            </LotteryButton>
          ))}
        </ScrollableBox>

        <Grid
          container
          spacing={1}
          sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}
        >
          {filteredGames.map((game) => (
            <Grid item xs={4} sx={{ border: "none" }} key={game.id}>
              <Card
                sx={{
                  position: "relative",
                  bgcolor: "transparent", // Set background to transparent
                  border: "none", // Remove border
                  borderRadius: "10px", // Optional: for rounded corners on the card itself
                  boxShadow: "none", // Remove any shadow
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={game?.image}
                  alt={game.name}
                  sx={{
                    border: "5px solid pink",
                    borderRadius: "10px",
                    objectFit: "cover",
                    width: "90%",
                    height: "100%",
                  }}
                />

                <CardContent sx={{ p: 1, bgcolor: "transparent" }}>
                  {" "}
                  {/* Set background to transparent */}
                  <Box
                    sx={{ position: "relative", mt: 1, textAlign: "center" }}
                  >
                    <OddsProgressBar
                      variant="determinate"
                      value={parseFloat(game.odds)}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "transparent",
                        px: 0.5,
                        textWrap: "nowrap",
                        color: "white",
                      }}
                    >
                      ODDS: {game.odds}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Mobile>
  );
};

export default GamesGrid;
