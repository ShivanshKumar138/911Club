import React from "react";
import VerticalPicker from "./VerticalPicker";
import { Box } from "@mui/material";

const LevelBody = ({ selectedLevel, setSelectedLevel, options }) => (
    <Box
      sx={{
        padding: "20px",
      }}
    >
      <VerticalPicker
        initialValue={selectedLevel}
        onChange={setSelectedLevel}
        options={options}
      />
    </Box>
  );
export default LevelBody;