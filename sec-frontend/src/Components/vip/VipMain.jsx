import React, { useState, useEffect } from "react";
import axios from "axios";
import SwipeableCards from "./SwipeableCards";
import "./VipMain.css";
import avatar from "../../assets/avatar.png";
import vipzero from "../../assets/vip-zero.png";
import { domain } from "../config";
// import FullWidthTabs from './tab'; // Uncomment if needed

function VipMain() {
  const [userData, setUserData] = useState({
    bets: {
      total: 0,
    },
    username: "",
    vipProgress: "",
    vipLevel: "VIP0",
    nextVipLevel: "",
    progressPercentage: 0,
  });

  const levels = [
    { minAmount: 1000, awarded: "Silver" },
    { minAmount: 3000, awarded: "Gold" },
    { minAmount: 10000, awarded: "Platinum" },
  ];


  const getRemainingDays = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,},
        });

        const { user, bets } = response.data;
        console.log("----->", response.data);

        let nextVipLevel = levels.find((level) => bets.total < level.minAmount);
        let remainingAmount = nextVipLevel
          ? nextVipLevel.minAmount - bets.total
          : 0;
        let progressPercentage = nextVipLevel
          ? (bets.total / nextVipLevel.minAmount) * 100
          : 100;

        setUserData({
          username: user.username,
          totalBets: bets.total,
          vipProgress:
            remainingAmount > 0
              ? `${remainingAmount} left to unlock ${nextVipLevel.awarded} level`
              : "Max VIP level achieved",
          nextVipLevel: nextVipLevel ? nextVipLevel.awarded : "Max VIP",
          progressPercentage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const [lastAchievement, setLastAchievement] = useState(null);
  useEffect(() => {
    const fetchLastAchievement = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/last-achievement`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,},
        });

        setLastAchievement(response.data.lastAchievement);
      } catch (err) {
        console.error("Error fetching last achievement:", err);
      }
    };

    fetchLastAchievement();
  }, []);

  const getImageForAchievement = () => {
    if (!lastAchievement) return "../../assets/vip-zero.png";

    switch (lastAchievement) {
      case "Bronze":
        return "../../assets/Vip1.png";
      case "Silver":
        return "../../assets/Vip2.png";
      case "Gold":
        return "../../assets/Vip3.png";
      case "Platinum":
        return "../../assets/Vip4.png";
      case "Diamond":
        return "../../assets/Vip5.png";
      default:
        return "../../assets/vip-zero.png";
    }
  };

  return (
    <div>
   <div className="topbox" style={{
  background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
  width: "100%",  // This makes it take full width
  boxSizing: "border-box" // This ensures padding doesn't add to the width
}}>
  <div className="top-left">
    <div className="image-box">
      <img src={avatar} alt="" />
    </div>
  </div>
  
  <div className="top-right">
    <div className="top-right-top">
      <div className="top-image-box">
        <img
          src={getImageForAchievement()}
          alt="Achievement"
          width="30%"
          height="80%"
        />
      </div>
    </div>
    <div className="top-right-bottom" style={{ marginBottom: "35%" }}>
      {userData.username}
    </div>
  </div>
</div>
      <div className="bottom-box">
        <div className="exp-box">
          <div className="exp">
            <div className="exp-content">
              <span className="exp-number">
                {userData && userData.totalBets !== undefined
                  ? Number.isInteger(userData.totalBets)
                    ? userData.totalBets
                    : userData.totalBets.toFixed(2)
                  : "0"}
                EXP
              </span>
              <span className="exp-text">My experienceee</span>
            </div>
          </div>
          <div className="exp">
            <div className="exp-content">
              <span className="exp-number">
              <strong>{getRemainingDays()}</strong> Days
              </span>
              <span className="exp-text">Payout time</span>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${userData.progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="notice-mid" style={{ marginTop: "-5%" }}>
          <div className="n-box" style={{color:"black"}}>
            VIP level rewards are settled at 2:00 am on the 1st of every month
          </div>
        </div>
        <SwipeableCards />
      </div>
      {/* Uncomment if needed */}
      {/* <FullWidthTabs /> */}
      <br />
      <br />
      <br />
    </div>
  );
}

export default VipMain;
