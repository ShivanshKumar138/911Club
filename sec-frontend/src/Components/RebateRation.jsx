import React, {useRef, useState } from "react";
import { Box, Typography, Grid, IconButton, SvgIcon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Mobile from "./Mobile";

// Define tab items and rebate levels
const tabItems = [
  {
    name: "Lottery",
    icon: "../../assets/Lottery Selected.png",
    icon1: "../../assets/Lottery Deselect.png",
  },
  {
    name: "Casino",
    icon: "../../assets/Casino Selected.png",
    icon1: "../../assets/Casino Deselect.png",
  },
  // {
  //   name: "Sports",
  //   icon: "../../assets/sport-f0fdc902.png",
  //   icon1: "../../assets/sport-f0fdc902.png",
  // },
  {
    name: "Rummy",
    icon: "../../assets/Rummy Selected.png",
    icon1: "../../assets/Rummy Deselected.png",
  },
  {
    name: "Slots",
    icon: "../../assets/Slots selected.png",
    icon1: "../../assets/Slots deselected.png",
  },
];

const rebateLevels = {
  Lottery: [
    {
      level: "L0",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L1",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L2",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L3",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.8%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.24%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.072%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.022%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0066%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.002%",
        },
      ],
    },
    {
      level: "L4",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.9%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.27%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.081%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.024%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0072%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0022%",
        },
      ],
    },
    {
      level: "L5",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.0%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.30%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.090%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.026%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0078%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0024%",
        },
      ],
    },
    {
      level: "L6",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.1%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.33%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.099%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.028%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0084%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0026%",
        },
      ],
    },
    {
      level: "L7",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.2%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.36%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.108%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.030%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0090%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0028%",
        },
      ],
    },
    {
      level: "L8",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.3%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.39%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.117%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.032%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0096%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0030%",
        },
      ],
    },
    {
      level: "L9",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.4%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.42%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.126%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.034%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0102%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0032%",
        },
      ],
    },
    {
      level: "L10",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.45%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.135%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.036%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0108%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0034%",
        },
      ],
    },
  ],
  Casino: [
    {
      level: "L0",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L1",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L2",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.8%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.24%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.072%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.022%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0066%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.002%",
        },
      ],
    },
    {
      level: "L3",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.9%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.27%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.081%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.024%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0072%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0022%",
        },
      ],
    },
    {
      level: "L4",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.0%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.30%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.090%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.026%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0078%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0024%",
        },
      ],
    },
    {
      level: "L5",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.1%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.33%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.099%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.028%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0084%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0026%",
        },
      ],
    },
    {
      level: "L6",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.2%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.36%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.108%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.030%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0090%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0028%",
        },
      ],
    },
    {
      level: "L7",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.3%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.39%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.117%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.032%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0096%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0030%",
        },
      ],
    },
    {
      level: "L8",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.4%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.42%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.126%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.034%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0102%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0032%",
        },
      ],
    },
    {
      level: "L9",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.45%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.135%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.036%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0108%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0034%",
        },
      ],
    },
    {
      level: "L10",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.48%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.144%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.038%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0114%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0036%",
        },
      ],
    },
  ],
  Sports: [
    {
      level: "L0",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.15%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.045%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.013%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0039%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0012%",
        },
      ],
    },
    {
      level: "L1",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.15%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.045%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.013%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0039%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0012%",
        },
      ],
    },
    {
      level: "L2",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L3",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L4",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.8%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.24%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.072%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.022%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0066%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.002%",
        },
      ],
    },
    {
      level: "L5",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.9%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.27%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.081%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.024%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0072%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0022%",
        },
      ],
    },
    {
      level: "L6",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.0%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.30%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.090%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.026%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0078%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0024%",
        },
      ],
    },
    {
      level: "L7",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.1%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.33%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.099%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.028%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0084%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0026%",
        },
      ],
    },
    {
      level: "L8",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.2%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.36%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.108%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.030%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0090%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0028%",
        },
      ],
    },
    {
      level: "L9",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.3%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.39%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.117%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.032%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0096%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0030%",
        },
      ],
    },
    {
      level: "L10",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.4%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.42%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.126%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.034%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0102%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0032%",
        },
      ],
    },
  ],
  Rummy: [
    {
      level: "L0",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L1",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L2",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L3",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.8%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.24%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.072%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.022%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0066%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.002%",
        },
      ],
    },
    {
      level: "L4",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.9%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.27%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.081%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.024%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0072%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0022%",
        },
      ],
    },
    {
      level: "L5",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.0%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.30%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.090%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.026%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0078%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0024%",
        },
      ],
    },
    {
      level: "L6",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.1%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.33%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.099%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.028%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0084%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0026%",
        },
      ],
    },
    {
      level: "L7",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.2%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.36%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.108%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.030%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0090%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0028%",
        },
      ],
    },
    {
      level: "L8",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.3%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.39%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.117%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.032%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0096%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0030%",
        },
      ],
    },
    {
      level: "L9",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.4%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.42%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.126%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.034%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0102%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0032%",
        },
      ],
    },
    {
      level: "L10",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.45%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.135%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.036%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0108%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0034%",
        },
      ],
    },
  ],
  Slots: [
    {
      level: "L0",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.15%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.045%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.013%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0039%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0012%",
        },
      ],
    },
    {
      level: "L1",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.5%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.15%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.045%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.013%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0039%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0012%",
        },
      ],
    },
    {
      level: "L2",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.6%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.18%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.054%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.016%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0048%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0014%",
        },
      ],
    },
    {
      level: "L3",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.7%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.21%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.063%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.018%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0056%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0017%",
        },
      ],
    },
    {
      level: "L4",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.8%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.24%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.072%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.022%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0066%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.002%",
        },
      ],
    },
    {
      level: "L5",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "0.9%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.27%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.081%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.024%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0072%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0022%",
        },
      ],
    },
    {
      level: "L6",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.0%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.30%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.090%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.026%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0078%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0024%",
        },
      ],
    },
    {
      level: "L7",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.1%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.33%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.099%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.028%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0084%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0026%",
        },
      ],
    },
    {
      level: "L8",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.2%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.36%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.108%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.030%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0090%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0028%",
        },
      ],
    },
    {
      level: "L9",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.3%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.39%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.117%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.032%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0096%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0030%",
        },
      ],
    },
    {
      level: "L10",
      sums: [
        {
          description: "1 level lower level commission rebate",
          percentage: "1.4%",
        },
        {
          description: "2 level lower level commission rebate",
          percentage: "0.42%",
        },
        {
          description: "3 level lower level commission rebate",
          percentage: "0.126%",
        },
        {
          description: "4 level lower level commission rebate",
          percentage: "0.034%",
        },
        {
          description: "5 level lower level commission rebate",
          percentage: "0.0102%",
        },
        {
          description: "6 level lower level commission rebate",
          percentage: "0.0032%",
        },
      ],
    },
  ],
};

const TabItem = ({ name, item, isActive, onClick }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 1,
      marginLeft: 1,
      cursor: "pointer",
      backgroundColor: isActive ? "#299FF2" : "#2B3270",
      color: isActive ? "white" : "#A5A9BE",
      borderRadius: 1,
      transition: "background-color 0.3s ease",

      "&:hover": {
        backgroundColor: "#1e88e5",
      },
      overflowY: "auto", // Enable vertical scrolling
      "::-webkit-scrollbar": {
        width: "8px", // Scrollbar width
      },
    }}
    onClick={onClick}
  >
    <img
      src={isActive ? item.icon : item.icon1}
      alt="icon"
      style={{ width: "30%", height: "45%" }}
    />
    <Typography variant="body2">{name}</Typography>
  </Box>
);

const RebateLevelComponent = () => {
  const tabsContainerRef = useRef([]);
  const [activeTab, setActiveTab] = useState(tabItems[0].name);
  const navigate = useNavigate();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    const container = tabsContainerRef.current;
    if (container) {
      // Get the tab item element
      const tabElement = container.querySelector(`[data-tab="${tabName}"]`);
      if (tabElement) {
        // Scroll to the tab element with smooth transition
        container.scroll({
          left: tabElement.offsetLeft - container.offsetWidth / 2 + tabElement.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <Mobile>
      <Box
        height="calc(var(--vh, 1vh) * 100)"
        position="relative"
        sx={{ backgroundColor: "#f2f2f1" }}
      >
        {/* Header Section */}

        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            padding: "4px 8px",
            color: "black",
          }}
        >
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: "black", ml: -5 }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Rebate Ratio
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* Tabs Section */}

        <Box
  sx={{
    display: 'flex',
    overflowX: 'auto',
    p: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap', // Prevent wrapping of tab items
    scrollbarWidth: 'none', // Hide scrollbar in Firefox
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar in Chrome and Safari
    },
    alignItems: 'center', // Center items vertically
  }}
  ref={tabsContainerRef}
>
  {tabItems.map((item) => (
    <Box
      key={item.name}
      data-tab={item.name} // Add data-tab attribute for querying
      sx={{
        background: activeTab === item.name
          ? 'linear-gradient(135deg, #4782ff, #00d084)' // Linear gradient for active tab
          : '#ffffff', // Solid color for inactive tabs
        color: activeTab === item.name ? '#fff' : '#768096',
        borderRadius: '8px',
        width: '80px', // Adjust width as needed
        height: '40px', // Adjust height as needed
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px', // Adjust padding as needed
        margin: '4px',
        cursor: 'pointer',
        transition: 'background 0.3s, transform 0.3s', // Use 'background' for gradient transition
        '&:hover': {
          background: activeTab === item.name
            ? 'linear-gradient(100deg, #4782ff, #00d084)' // Gradient for hover on active tab
            : '#fff', // Darker shade for hover on inactive tabs
        },
        flexShrink: 0, // Prevent tab item from shrinking
      }}
      onClick={() => handleTabClick(item.name)}
    >
      <img
        src={activeTab === item.name ? item.icon : item.icon1} // Dynamic icon based on active state
        alt={item.name}
        style={{ width: '20px', height: '20px', marginBottom: '4px' }} // Adjust icon size
      />
      <div style={{ fontSize: '12px' }}>{item.name}</div> {/* Adjust text size */}
    </Box>
  ))}
        </Box>

        {/* Rebate Levels List */}
        <Box sx={{ p: 2 }}>
          {rebateLevels[activeTab].map((levelData, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "5%",
                backgroundColor: "#ffffff",
              }}
            >
              {/* Title Section */}
              <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
                <Typography variant="h7" sx={{ color: "black", mt: 0.5 }}>
                  Rebate levels
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mx: 1,
                    mb: -0.8,
                    color: "#4782ff",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    fontStyle: "Italic"
                  }}
                >
                  {levelData.level}
                </Typography>
              </Box>

              {/* Rebate Details */}
              {levelData.sums.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="50" fill="#B0E0C3" />
                    <circle cx="50" cy="50" r="25" fill="#4782ff" />
                  </svg>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#768096",
                      paddingLeft: 2,
                      textAlign: "left",
                      width: "90%",
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "black", textAlign: "left" }}
                  >
                    {item.percentage}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <br />
        <br />
        <br />
      </Box>
    </Mobile>
  );
};

export default RebateLevelComponent;