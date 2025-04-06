import React, { useState } from "react";
import { Button } from "@mui/material";

const RowVisualization = ({ data }) => {
  const [numRows, setNumRows] = useState(10);

  const handleLoadMore = () => {
    console.log("Load More button clicked");
    setNumRows(numRows + 10);
  };

  const displayData = data.slice(0, numRows);
  return (
    <div style={{ fontFamily: "Arial, sans-serif" ,padding:"10px 10px"}}>
      <div
        style={{
          display: "flex",
          backgroundColor: "#F95959",
          padding: "10px",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3px",
          }}
        >
          <div style={{ color: "#000" }}>Winning number</div>
          <div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  backgroundColor: "white", // Change background to white
                  color: "red", // Change text color to red
                  textAlign: "center",
                  lineHeight: "18px",
                  marginRight: "2px",
                  fontSize: "12px",
                  border: "1px solid red", // Add a red border
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3px",
            color: "#000",
          }}
        >
          <div>Missing</div>
          <div>1 0 21 5 3 16 9 4 10 8</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3px",
            color: "#000",
          }}
        >
          <div>Avg missing</div>
          <div>11 4 13 15 6 6 10 9 11 13</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3px",
            color: "#000",
          }}
        >
          <div>Frequency</div>
          <div>8 19 6 7 12 13 8 11 7 9</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#000",
            borderBottom: "1px solid #ccc",
          }}
        >
          <div>Max consecutive</div>
          <div>2 2 1 2 1 2 1 2 1 3</div>
        </div>
        {displayData.map((row, rowIndex) => (
          <div
            key={row.id}
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "30px 0",
              position: "relative",
              paddingBottom: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <div style={{ width: "75px", fontSize: "11px", color: "black" }}>
              {row.periodId.toString().slice(0, -2)}
            </div>
            {Array.from({ length: 10 }).map((_, circleIndex) => {
              const isColored =
                circleIndex === Number(row.numberOutcome.trim());

              return (
                <div
                  key={circleIndex}
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    border: "1px solid grey",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    margin: "0 5px",
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
                  left: "50px",
                  right: 0,
                  bottom: 0,
                }}
              >
                <path
                  d={`M${Number(row.numberOutcome.trim()) * 30 + 15} 20 Q ${
                    (Number(row.numberOutcome.trim()) +
                      Number(data[rowIndex + 1].numberOutcome.trim())) *
                      15 +
                    15
                  } 40 ${
                    Number(data[rowIndex + 1].numberOutcome.trim()) * 30 + 15
                  } 60`}
                  stroke="red"
                  fill="transparent"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#61a9ff",
        }}
        onClick={handleLoadMore}
      >
        Load More
      </Button>
    </div>
  );
};

export default RowVisualization;
