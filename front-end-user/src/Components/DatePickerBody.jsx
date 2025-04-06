import React from "react";
import VerticalPicker from "./VerticalPicker";
import { Box } from "@mui/material";

const DatePickerBody = ({ year, month, day, daysInMonth, setYear, setMonth, setDay }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
    }}
  >
    <VerticalPicker
      initialValue={year}
      onChange={setYear}
      options={[0, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]}
    />
    <VerticalPicker
      initialValue={month}
      onChange={setMonth}
      options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
    />
    <VerticalPicker
      initialValue={day}
      onChange={setDay}
      options={[0, ...daysInMonth]}
    />
  </Box>
);

export default DatePickerBody;