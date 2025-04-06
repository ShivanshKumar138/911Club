import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./Attendance.css";
import CoinBox from "./CoinBox.jsx";
import gift from "../../assets/gift.png";
import axios from "axios";
import { domain } from "../config";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

   const navigate = useNavigate();
  
         const handleBack = () => {
          console.log("clicked");
          navigate("/gamesrulesatte");
          };

          const handleBack2 = () => {
          console.log("clicked");
          navigate("/attenhist");
          };
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const claimBonus = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/attendance`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.msg);
  
      // Immediately update the UI
      setUser((prevUser) => ({
        ...prevUser,
        consecutiveDays: response.data.consecutiveDays,
        totalBonusAmount: response.data.totalBonusAccumulated,
      }));
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg);
        if (err.response.data.requiredDeposit) {
          alert(`Required deposit: ${err.response.data.requiredDeposit}`);
        }
      } else {
        alert("An error occurred while claiming the bonus");
      }
    } finally {
      setLoading(false);
    }
  };

  const bonusStructure = [
    { day: 1, requiredDeposit: 500, bonus: 11 },
    { day: 2, requiredDeposit: 1000, bonus: 21 },
    { day: 3, requiredDeposit: 5000, bonus: 101 },
    { day: 4, requiredDeposit: 10000, bonus: 201 },
    { day: 5, requiredDeposit: 20000, bonus: 401 },
    { day: 6, requiredDeposit: 100000, bonus: 2551 },
    { day: 7, requiredDeposit: 200000, bonus: 7051 },
  ];

  const getNextClaimableDay = () => {
    if (!user) return 1;
    return ((user.consecutiveDays || 0) % 7) + 1;
  };

  return (
    <div className="outerContainer">
      <div className="bannerBox">
        <div className="content">
          <div className="contentOne">
            <h1>Attendance Bonus</h1>
            <p>
              Get <b>rewards</b> based on consecutive login days!
            </p>
          </div>
          <div className="contentTwo">
            <span style={{ fontSize: "12px" }}>Attended Consecutively</span>
            <span>
              <b>{loading ? "Loading" : user?.consecutiveDays || 0}</b> Days
            </span>
          </div>
          <div className="contentThree">
            <p>Accumulated</p>
            <h1 style={{ color: "white" }}>  
              {loading
                ? "Loading"
                : user?.totalBonusAmount?.toFixed(2) || "0.00"}
            </h1>
          </div>
          <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          gap: '20px'
        }}>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              flex: 1,
              height: "25px",
              borderRadius: "20px",
              background: "#FF9F3F",
              cursor: "pointer",
              border: "none",
              color: "white",
              width: "50%",
              fontSize: "0.8em",
              textTransform: "initial",
              "&:hover": {
                background: "#FF9F3F"
              }
            }}
          >
            Game Rules
          </Button>
          <Button
            variant="contained"
            onClick={handleBack2}
            sx={{
              flex: 1,
              height: "25px",
              borderRadius: "20px",
              background: "#FF9F3F",
              cursor: "pointer",
              border: "none",
              fontSize: "0.8em",
              color: "white",
              textTransform: "initial",
              "&:hover": {
                background: "#FF9F3F"
              }
            }}
          >
            Attendancde History
          </Button>
        </div>
        </div>
      </div>
      <div className="cardbox">
        {bonusStructure.map((bonus, index) =>
          index < 6 ? (
            <CoinBox
              key={bonus.day}
              coinboxAmount={`₹${bonus.bonus.toFixed(2)}`}
              coinboxDay={`${bonus.day} Day`}
              onClick={claimBonus}
              disabled={loading || getNextClaimableDay() !== bonus.day}
            />
          ) : (
            <div
              id="coinbox-container"
              key={bonus.day}
              onClick={getNextClaimableDay() === 7 ? claimBonus : undefined}
              style={{
                cursor: getNextClaimableDay() === 7 ? "pointer" : "not-allowed",
              }}
            >
              <div id="coinbox-image">
                <img src={gift} alt="" />
              </div>
              <div id="coinbox-content">
                <div id="coinbox-amount" style={{ color: "black" }}>
                  ₹{bonus.bonus.toFixed(2)}
                </div>
                <div id="coinbox-day" style={{ color: "grey" }}>
                  {bonus.day} Day
                </div>
              </div>
            </div>
          )
        )}
        <Button
          variant="contained"
          className="attendanceButton"
          onClick={claimBonus}
          disabled={loading}
          sx={{
            width: "90%",
            height: "35px",
            borderRadius: `20px`,
            background: `rgb(245,70,69)`,
            cursor: "pointer",
            border: "none",
            fontSize: "0.8em",
            marginBottom: "120px",
            color: "#ffffff",
            textTransform: "initial",
          }}
        >
          {loading ? "Loading..." : "Claim Attendance Bonus"}
        </Button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Attendance;
