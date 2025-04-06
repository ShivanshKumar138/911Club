import React, { useState, useRef, useEffect } from "react";
import { LuckyWheel } from "@lucky-canvas/react";
import axios from "axios";
import { domain } from "../Components/config";

export default function LuckySpin() {
  const myLucky = useRef();
  const [prizeAmounts, setPrizeAmounts] = useState([0, 0, 0, 0, 0, 0, 0, '']);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alert, setAlert] = useState(null);

  const prizeImg = {
    src: "/assets/redpackage.png",
    width: "65%",
    top: "40%",
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await axios.get(`${domain}/getWinningAmount`, {
        withCredentials: true,
      });

      if (response.data?.winningAmount) {
        const amounts = Object.values(response.data.winningAmount);
        setPrizeAmounts(amounts);
      }
    } catch (error) {
      showAlert("error", "Failed to load wheel data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type, message, duration = 5000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), duration);
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsError(false);
    setAlert(null);

    try {
      const response = await axios.post(
        `${domain}/spin-wheel`,
        {},
        {
          withCredentials: true,
        }
      );

      const { message, winningSection, reward } = response.data;
      console.log("here we go with response", response.data);

      // Start wheel animation
      myLucky.current.play();

      // Determine winning index
      let winningIndex;
      if (winningSection === "section8") {
        winningIndex = 7;
      } else {
        const winningMatch = message.match(/\d+/);
        const winningAmount = winningMatch ? parseInt(winningMatch[0]) : null;
        winningIndex = winningAmount ? prizeAmounts.indexOf(winningAmount) : 0;
      }

      // Stop the wheel after 5 seconds
      setTimeout(() => {
        myLucky.current.stop(winningIndex);

        // Show result popup 2 seconds after wheel stops
        setTimeout(() => {
          if (winningSection === "section8") {
            showAlert("info", `Oh sorry, Better Luck next Time.`);
          } else {
            showAlert("success", message);
          }
        }, 2000); // 2 seconds delay after wheel stops
      }, 5000); // 5 seconds spin duration
    } catch (error) {
      setIsError(true);
      const errorMessage =
        error.response?.data?.message || "Failed to spin wheel";

      setTimeout(() => {
        if (myLucky.current) {
          myLucky.current.stop(0);

          // Show error message 2 seconds after wheel stops
          setTimeout(() => {
            showAlert("error", errorMessage);
          }, 2000);
        }
      }, 5000);
    } finally {
      // Reset spinning state after everything is done
      setTimeout(() => {
        setIsSpinning(false);
        setIsError(false);
      }, 7000); // 5 seconds spin + 2 seconds delay
    }
  };

  function getBackgroundColor(index) {
    const colors = [
      "#f6f600",
      "#ed6619",
      "#f6649c",
      "#e358f5",
      "#a445e7",
      "#33a8ed",
      "#4ce9d2",
      "#51f539",
    ];
    return colors[index % colors.length];
  }

  const wheelState = {
    blocks: [
      {
        padding: "20px",
        imgs: [{ src: "/assets/spinBg.png", width: "100%", rotate: true }],
      },
    ],
    prizes: prizeAmounts.map((amount, index) => ({
      fonts: [{ 
        text: index === 7 ? `${amount}` : `₹${amount}`, 
        top: "10%", 
        fontColor: "#ffffff" 
      }],
      background: getBackgroundColor(index),
      imgs: [prizeImg],
    })),
    buttons: [
      {
        radius: "45%",
        imgs: [{ src: "/assets/gobutton.png", width: "70%", top: "-100%" }],
      },
    ],
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
        }}
      >
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "10px" }}>Loading Spin Wheel...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={{ position: "relative" }}>
        <LuckyWheel
          ref={myLucky}
          width="320px"
          height="320px"
          blocks={wheelState.blocks}
          prizes={wheelState.prizes}
          buttons={wheelState.buttons}
          onStart={handleSpin}
        />

        {isError && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
            }}
          >
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {alert && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "4px",
            backgroundColor:
              alert.type === "error"
                ? "#fee2e2"
                : alert.type === "info"
                ? "#e0f2fe"
                : "#dcfce7",
            border: `1px solid ${
              alert.type === "error"
                ? "#ef4444"
                : alert.type === "info"
                ? "#0ea5e9"
                : "#22c55e"
            }`,
            color:
              alert.type === "error"
                ? "#b91c1c"
                : alert.type === "info"
                ? "#0369a1"
                : "#15803d",
            width: "100%",
            maxWidth: "320px",
            textAlign: "center",
          }}
        >
          {alert.message}
        </div>
      )}

      <style jsx>{`
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}