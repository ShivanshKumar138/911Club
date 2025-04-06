import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const RowVisualization = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const displayData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const CIRCLE_SIZE = 15;
  const BASE_LEFT = 75;
  const VERTICAL_SPACING = 60;

  const NUMBER_POSITIONS = {
    0: BASE_LEFT + 25 + CIRCLE_SIZE / 2,
    1: BASE_LEFT + 50 + CIRCLE_SIZE / 2,
    2: BASE_LEFT + 75 + CIRCLE_SIZE / 2,
    3: BASE_LEFT + 100 + CIRCLE_SIZE / 2,
    4: BASE_LEFT + 125 + CIRCLE_SIZE / 2,
    5: BASE_LEFT + 150 + CIRCLE_SIZE / 2,
    6: BASE_LEFT + 175 + CIRCLE_SIZE / 2,
    7: BASE_LEFT + 200 + CIRCLE_SIZE / 2,
    8: BASE_LEFT + 225 + CIRCLE_SIZE / 2,
    9: BASE_LEFT + 250 + CIRCLE_SIZE / 2,
  };

  const getCirclePosition = (index) => ({
    left: NUMBER_POSITIONS[index] - CIRCLE_SIZE / 2,
  });

  const getCircleCenter = (number) => NUMBER_POSITIONS[number];

  const getPath = (currentNum, nextNum) => {
    const x1 = getCircleCenter(currentNum);
    const x2 = getCircleCenter(nextNum);
    const y1 = CIRCLE_SIZE / 2;
    const y2 = VERTICAL_SPACING - CIRCLE_SIZE / 2;
    return `M${x1} ${y1} L${x2} ${y2}`;
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "0px 0rem" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "#F95959",
          padding: "10px",
          borderRadius: "5px 5px 0px 0px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <div style={{ width: "30%" }}>Period</div>
        <div style={{ width: "70%" }}>Number</div>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "12px",
          borderRadius: "4px",
        }}
      >
        <div style={{ marginBottom: "5px", color: "#000", textAlign: "left" }}>
          Statistic (last 100 Periods)
        </div>
        <div>
          {displayData.map((row, rowIndex) => (
            <div
              key={row.id}
              style={{
                display: "flex",
                margin: "30px 0",
                position: "relative",
                paddingBottom: "20px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  width: BASE_LEFT + "px",
                  fontSize: "11px",
                  color: "black",
                  position: "absolute",
                  left: "0",
                }}
              >
                {row.periodId.toString().slice(0, -2)}
              </div>
              {Array.from({ length: 10 }).map((_, circleIndex) => {
                const isColored =
                  circleIndex === Number(row.numberOutcome.trim());
                const position = getCirclePosition(circleIndex);
                return (
                  <div
                    key={circleIndex}
                    style={{
                      width: CIRCLE_SIZE + "px",
                      height: CIRCLE_SIZE + "px",
                      borderRadius: "50%",
                      border: "1px solid grey",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      left: position.left + "px",
                      background: isColored
                        ? Array.isArray(row.colorOutcome) &&
                          row.colorOutcome.length === 2
                          ? `linear-gradient(to right, ${row.colorOutcome[0]} 50%, ${row.colorOutcome[1]} 50%)`
                          : row.colorOutcome
                        : "transparent",
                      color: isColored ? "white" : "black",
                    }}
                  >
                    {circleIndex}
                  </div>
                );
              })}
              {rowIndex < data.length - 1 && (
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: VERTICAL_SPACING + "px",
                    pointerEvents: "none",
                  }}
                >
                  <path
                    d={getPath(
                      Number(row.numberOutcome.trim()),
                      Number(data[rowIndex + 1].numberOutcome.trim())
                    )}
                    stroke="red"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <IconButton
          size="small"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ArrowBack />
        </IconButton>
        <span style={{ margin: "0 10px", fontSize: "14px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <IconButton
          size="small"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
};

export default RowVisualization;
