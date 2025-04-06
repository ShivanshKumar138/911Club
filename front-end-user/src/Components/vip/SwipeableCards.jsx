import React, { useState, useEffect } from "react";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import badge1 from "../../assets/badge1.png";
import badge2 from "../../assets/badge2.png";
import badge3 from "../../assets/badge3.png";
import badge4 from "../../assets/badge4.png";
import badge5 from "../../assets/badge5.png";
import badge6 from "../../assets/badge1.png";
import badge7 from "../../assets/badge2.png";
import badge8 from "../../assets/badge3.png";
import lock from "../../assets/lock.png";
import wallet from "../../assets/wallet.png";
import dicon from "../../assets/dicon.png";
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import crownimg from "../../assets/crown.png";
import crownimg2 from "../../assets/crown2.png";
import { domain } from "../config";
import "./SwipeableCards.css"; // Import your CSS file for styling
import { Diamond } from "@mui/icons-material";
import { color } from "@mui/system";

const SwipeableCards = () => {
  const [index, setIndex] = useState(0);
  const [levels, setLevels] = useState([]);
  const [cards, setCards] = useState([]);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [hasData, setHasData] = useState(true);
  const [benefit, setBenefit] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const isLevelUnlocked = () => {
    if (!userData || !userData.bets || levels.length === 0) return false;
    return userData.bets.total >= levels[index].minAmount;
  };
  useEffect(() => {
    const fetchLevelsData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/vip-levels`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response--->", response.data.data);
        setLevels(response.data.data); // Extracting the 'data' array from response

        // Creating cards based on levels data
        const initialCards = response.data.data.map((level) => ({
          levelReward: level.oneTimeBonus,
          moneyReward: level.monthlyBonus,
          safe: 0, // Assuming default value for 'safe', adjust as per your data structure
          exp: level.minAmount,
          rebatePercentage: level.rebatePercentage,
        }));
        setCards(initialCards);
        console.log("--->", benefit);
        setBenefit(initialCards);
      } catch (error) {
        console.error("Error fetching levels data:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust the endpoint as needed
        setUserData(response.data);
        console.log("data is--------------->", response.data.bets.total);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLevelsData();
    fetchUserData();
  }, []);

  const handleChangeIndex = (index) => {
    setIndex(index);
  };

  const calculateInnerProgressWidth = (exp) => {
    if (!userData) return "0%";
    const expRequired = parseInt(exp);
    const currentExp = userData.bets.total;
    // Calculate percentage progress
    const progress = Math.min((currentExp / expRequired) * 100, 100);
    return `${progress}%`;
  };

  const getColorForAwarded = (awarded) => {
    switch (awarded) {
      case "VIP3":
        return {
          image: "/assets/vipcardOverlay/goldoverlay.png",
          gradient:
            "linear-gradient(117.29deg, rgb(248, 189, 131) 21.85%, rgb(226, 152, 78) 67.02%)",
        };
      case "VIP2":
        return {
          image: "/assets/vipcardOverlay/silveroverlay.png",
          gradient:
            "linear-gradient(117.29deg, rgb(166, 183, 208) 21.85%, rgb(136, 158, 190) 67.02%)",
        };
      case "VIP1":
        return {
          image: "/assets/vipcardOverlay/bronzeoverlay.png",
          gradient:
            "linear-gradient(117.29deg, rgb(255, 164, 147) 21.85%, rgb(255, 120, 120) 67.02%)",
        };
      case "Diamond":
      case "VIP5":
        return {
          image: "/assets/vipcardOverlay/diamondoverlay.png",
          gradient:
            "linear-gradient(117.29deg, rgb(120, 219, 235) 21.85%, rgb(72, 199, 240) 67.02%)",
        };
      case "VIP4":
        return {
          image: "/assets/vipcardOverlay/platinumoverlay.png",
          gradient:
            "linear-gradient(117.29deg, rgb(223, 145, 251) 21.85%, rgb(239, 130, 213) 67.02%)",
        };
      case "VIP6":
        return {
          image: "https://diuwin.bet/assets/png/bg6-8b5d1b4f.png", // You'll need to create this image
          gradient:
            "linear-gradient(117.29deg, rgb(102, 204, 153) 21.85%, rgb(51, 153, 102) 67.02%)",
        };
      case "VIP7":
        return {
          image: "https://diuwin.bet/assets/png/bg10-76abb4b7.png", // You'll need to create this image
          gradient:
            "linear-gradient(117.29deg, rgb(255, 215, 0) 21.85%, rgb(218, 165, 32) 67.02%)",
        };
      case "VIP8":
        return {
          image: "https://diuwin.bet/assets/png/bg8-8bdc102c.png", // You'll need to create this image
          gradient:
            "linear-gradient(117.29deg, rgb(70, 130, 180) 21.85%, rgb(0, 90, 170) 67.02%)",
        };
      default:
        return {
          image: null,
          gradient: "linear-gradient(to right, #a6b7d0, #889fbe)",
        };
    }
  };

  const getTransparentColorForAwarded = (awarded) => {
    switch (awarded) {
      case "VIP3":
        return "rgba(248, 189, 131, 0.2)";
      case "VIP2":
        return "rgba(166, 183, 208, 0.2)";
      case "VIP1":
        return "rgba(255, 164, 147, 0.2)";
      case "VIP4":
        return "rgba(208, 132, 225, 0.2)";
      case "VIP5":
        return "rgba(84, 186, 241, 0.2)";
      case "VIP6":
        return "rgba(102, 204, 153, 0.2)";
      case "VIP7":
        return "rgba(255, 215, 0, 0.2)";
      case "VIP8":
        return "rgba(70, 130, 180, 0.2)";
      default:
        return "rgba(128, 128, 128, 0.2)";
    }
  };

  const getFillColorForAwarded = (awarded) => {
    switch (awarded) {
      case "VIP3":
        return "rgb(255, 171, 88)";
      case "VIP2":
        return "rgb(192, 217, 255)";
      case "VIP1":
        return "rgb(255, 90, 90)";
      case "VIP5":
        return "rgb(95, 215, 255)";
      case "VIP4":
        return "rgb(255, 149, 230)";
      case "VIP6":
        return "rgb(51, 153, 102)";
      case "VIP7":
        return "rgb(255, 215, 0)";
      case "VIP8":
        return "rgb(70, 130, 180)";
      default:
        return "rgb(65, 65, 65)";
    }
  };

  const styles = {
    associatedContainer: {
      marginTop: "20px",
      marginBottom: "20px",
    },
    associated: {
      backgroundColor: "#FFFFFF",
      padding: "8px",
      borderRadius: "10px",
    },
  };

  useEffect(() => {
    const fetchVIPHistory = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/vip-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          console.log("VIP HISTORY-------->", response.data.vipHistories);
          setHistoryData(response.data.vipHistories);
        } else {
          console.log("Failed to fetch VIP history");
        }
      } catch (err) {
        console.error("Error fetching VIP history:", err);
      }
    };

    fetchVIPHistory();
  }, []); // Empty dependency array to run only once when component mounts

  const benefits = [
    {
      image: "/assets/welfare1-eee87ee1.png",
      title: "Level up rewards",
      description: "Each account can only receive 1 time",
      buttonText: "Received",
      levelReward: benefit[index]?.levelReward, // Dynamic data
    },
    {
      image: "/assets/welfare2-cf757d28.png",
      title: "Monthly reward",
      description: "Each account can only receive 1 time per month",
      buttonText: "Received",
      levelReward: benefit[index]?.moneyReward, // Dynamic data
    },
    {
      image: "/assets/welfare5-8b250748.png",
      title: "Rebate rate",
      description: "Increase income of rebate",
      buttonText: "Check the details",
      levelReward: benefit[index]?.rebatePercentage, // Dynamic data
    },
  ];

  function getTitleColorClass(title) {
    if (title === "Experience Bonus") {
      return "title-blue";
    } else if (title === "Successfully received") {
      return "title-green";
    } else if (title === "Level maintenance") {
      return "title-red";
    } else {
      return "title-white";
    }
  }

  if (levels.length === 0 || !userData) return null;
  // console.log("benefitssss-->",benefit)
  return (
    <div className="swipeable-cards-container">
      <SwipeableViews
        index={index}
        onChangeIndex={handleChangeIndex}
        enableMouseEvents
        style={{}}
      >
        {levels.map((level, i) => {
          const { image, gradient } = getColorForAwarded(level.awarded);
          return (
            <div
              key={i}
              className="card"
              style={{
                background: gradient,
                position: "relative",
                padding: "10px",
                overflow: "hidden",
                height: "190px",
                width:"80%",
                marginLeft:"7%"
              }}
            >
              {image && (
                <img
                  src={image}
                  alt={`${level.awarded} overlay`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5, // Adjust opacity as needed
                    zIndex: 1,
                  }}
                />
              )}
              <div
                className="content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div className="top" style={{ width: "100%" }}>
                  <div className="left">
                    <div className="l-top">
                      <div className="l-one">
                        <img
                          src={
                            level.awarded === "Bronze"
                              ? crownimg
                              : level.awarded === "Silver"
                              ? crownimg2
                              : level.awarded === "Gold"
                              ? crownimg2
                              : level.awarded === "Diamond"
                              ? crownimg2
                              : crownimg2
                          }
                          alt={level.awarded}
                        />
                      </div>
                      <div className="l-two" style={{ fontWeight: "bold" }}>
                        {level.awarded}
                      </div>
                      <div className="l-three">
                        {userData.totalBets >= level.minAmount ? (
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "white",
                              fontSize: "0.8em",
                            }}
                          >
                            Level unlocked
                          </span>
                        ) : (
                          <div
                            className="lthreetwo"
                            style={{ marginTop: "5px" }}
                          >
                            <img
                              src={lock}
                              alt="Locked"
                              style={{ width: "30px", height: "30px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="l-mid"
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.8rem",
                      }}
                    >
                      Upgrading {level.awarded} requires
                    </div>
                    <div
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.8rem",
                      }}
                    >
                      {level.minAmount} EXP
                    </div>
                    <div
                      className="l-bottom"
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: "0.85rem",
                      }}
                    >
                      Bet ₹1 = 1 EXP
                    </div>
                  </div>
                  <div className="right">
                    <div className="image-badge">
                    <img
  src={
    level.awarded === "VIP1"
      ? badge3
      : level.awarded === "VIP2"
      ? badge1
      : level.awarded === "VIP3"
      ? badge2
      : level.awarded === "VIP4"
      ? badge4
      : level.awarded === "VIP5"
      ? badge5
      : level.awarded === "VIP6"
      ? badge6 // You'll need to import these new badge images
      : level.awarded === "VIP7"
      ? badge7
      : level.awarded === "VIP8"
      ? badge8
      : badge3
  }
  alt=""
/>
                    </div>
                    <div className="right-bottom">{level.awarded}</div>
                  </div>
                </div>
                <div className="mid" style={{ width: "100%" }}>
                  <div
                    className="outer-progress"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: getTransparentColorForAwarded(
                        level.awarded
                      ),
                      borderRadius: "inherit",
                      position: "absolute",
                      zIndex: 1,
                    }}
                  ></div>
                  <div
                    className="inner-progress"
                    style={{
                      width: calculateInnerProgressWidth(level.minAmount),
                      height: "100%",
                      backgroundColor: getFillColorForAwarded(level.awarded), // Adjust color as needed
                      borderRadius: "inherit",
                      position: "relative",
                      zIndex: 2,
                    }}
                  ></div>
                </div>
                <div className="bottom" style={{ width: "100%" }}>


  <div
  className="bottom-left"
  style={{
    background:
      level.awarded === "VIP1"
        ? `linear-gradient(to right, #f05c5c, #fe7676)`
        : level.awarded === "VIP2"
        ? `linear-gradient(to right, #6f85a5, #889ebe)`
        : level.awarded === "VIP3"
        ? `linear-gradient(to right, #ca7521, #ed8f32)`
        : level.awarded === "VIP4"
        ? `linear-gradient(to right, #8944fa, #b359ff)`
        : level.awarded === "VIP5"
        ? `linear-gradient(to right, #1177ea, #308efe)`
        : level.awarded === "VIP6"
        ? `linear-gradient(to right, #33cc66, #66cc99)`
        : level.awarded === "VIP7"
        ? `linear-gradient(to right, #ffcc00, #ffdb58)`
        : level.awarded === "VIP8"
        ? `linear-gradient(to right, #4682b4, #0047ab)`
        : `linear-gradient(117.29deg, #ff7878 21.85%, #ffa493 67.02%)`,
    marginTop: "-8px",
    paddingTop: "1px",
    paddingBottom: "1px",
    borderRadius: "10px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "10px",
    paddingRight: "10px",
    alignItems: "center",
    fontSize: "14px",
  }}
>
  {userData && userData.bets && userData.bets.total !== undefined
    ? Number.isInteger(userData.bets.total)
      ? userData.bets.total
      : userData.bets.total.toFixed(2)
    : '0'}
  /{level.minAmount}
</div>


                  <div
                    className="bottom-right"
                    style={{
                      color: "white",
                      textAlign: "left",
                      fontSize: "1em",
                    }}
                  >
                    {level.minAmount} can be leveled up
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </SwipeableViews>

      {/* Associated content based on selected card */}
      <div style={styles.associatedContainer}>
        {cards.map(
          (card, i) =>
            i === index && (
              <div key={i} style={styles.associated}>
                <div
                  className="heading"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "20px",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <div className="d-img">
                    <Diamond sx={{ color: "#55A5FF", fontSize: 30 }} />
                  </div>
                  <div
                    style={{
                      color: "#1e2637",
                      fontSize: "1.1em",
                      fontWeight: 600,
                      lineHeight: "30px",
                    }}
                  >
                    VIP Benefit Level
                  </div>
                </div>

                <div className="list">
                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      marginBottom: "-2%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/gift2.png"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "black",
                          fontSize: "16px",
                          margin: "0",
                        }}
                      >
                        Level up reward
                      </div>
                      <div
                        style={{
                          color: "#768096",
                          fontSize: "13px",
                        }}
                      >
                        Each account can only recieve 1 time
                      </div>
                    </div>
                    <div style={{ width: "80px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "5px auto",
                          border: "1px solid #dd9138",
                          borderRadius: "5px",
                        }}
                      >
                        <div style={{ width: "20px", height: "20px" }}>
                          <img
                            src={wallet}
                            alt=""
                            style={{ width: " 80% ", height: "80%" }}
                          />
                        </div>
                        <div style={{ color: "black", fontSize: "0.8rem" }}>
                          {card.levelReward}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "5px auto",
                          border: "1px solid #55A4FF",
                          borderRadius: "5px",
                        }}
                      >
                        <div style={{ width: "20px", height: "20px" }}>
                          <img
                            src={dicon}
                            alt=""
                            style={{ width: " 80% ", height: "80%" }}
                          />
                        </div>
                        <div style={{ color: "black", fontSize: "0.8rem" }}>
                          0
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      marginBottom: "2%",
                      marginTop: "3%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/coin2.png"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "black",
                          fontSize: "16px",
                          margin: "0",
                        }}
                      >
                        Monthly reward
                      </div>
                      <div
                        style={{
                          color: "#768096",
                          fontSize: "13px",
                        }}
                      >
                        Each account can only recieve 1 time per month
                      </div>
                    </div>
                    <div style={{ width: "80px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "5px auto",
                          border: "1px solid #dd9138",
                          borderRadius: "5px",
                        }}
                      >
                        <div style={{ width: "20px", height: "20px" }}>
                          <img
                            src={wallet}
                            alt=""
                            style={{ width: " 80% ", height: "80%" }}
                          />
                        </div>
                        <div style={{ color: "black", fontSize: "0.8rem" }}>
                          {card.moneyReward}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "5px auto",
                          border: "1px solid #55A4FF",
                          borderRadius: "5px",
                        }}
                      >
                        <div style={{ width: "20px", height: "20px" }}>
                          <img
                            src={dicon}
                            alt=""
                            style={{ width: " 80% ", height: "80%" }}
                          />
                        </div>
                        <div style={{ color: "black", fontSize: "0.8rem" }}>
                          0
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="list-one"
                    style={{
                      display: "flex",
                      gap: "5px",
                      width: "100%",
                      marginBottom: "0%",
                      textAlign: "left",
                    }}
                  >
                    <div className="one-img">
                      <img
                        src="/assets/stack2.png"
                        alt="Gift"
                        style={{
                          width: "3.5rem",
                          height: "3.5rem",
                          marginRight: "0.2rem",
                        }}
                      />
                    </div>
                    <div style={{ width: "80%" }}>
                      <div
                        style={{
                          color: "black",
                          fontSize: "16px",
                          margin: "0",
                        }}
                      >
                        <div
                          style={{
                            color: "black",
                            fontSize: "16px",
                            margin: "0",
                          }}
                        >
                          Rebate Rate
                        </div>
                        <div
                          style={{
                            color: "#768096",
                            fontSize: "13px",
                          }}
                        >
                          increase income of the rebate
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "80px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "5px auto",
                          border: "1px solid #d9ac4e",
                          borderRadius: "5px",
                        }}
                      >
                        <div style={{ width: "20px", height: "20px" }}>
                          <img
                            src="/assets/stackicon.png"
                            alt="stack"
                            style={{ width: " 80% ", height: "80%" }}
                          />
                        </div>
                        <div style={{ color: "black", fontSize: "0.8rem" }}>
                          {card.rebatePercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      {/* My benefits */}

      {isLevelUnlocked() ? (
  <div className="my-benefits">
    <h2 className="my-benefits__title">
      <span className="my-benefits__crown">👑</span> My benefits
    </h2>
    <div className="benefits-grid">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className={`benefit-card ${
            index === 3 ? "benefit-card--wide" : ""
          }`}
        >
          <div className="benefit-card__image-container">
            <img
              src={benefit.image}
              alt={benefit.title}
              className="benefit-card__image"
            />
            {benefit.levelReward !== undefined && (
              <span className="benefit-card__reward-count">
                <span className="benefit-card__reward-count-dot"></span>
                {benefit.levelReward}
              </span>
            )}
          </div>
          <h3 className="benefit-card__title">{benefit.title}</h3>
          <p className="benefit-card__description">{benefit.description}</p>
          <button
            className={`benefit-card__button ${
              benefit.buttonText === "Check the details"
                ? "benefit-card__button--outlined"
                : "benefit-card__button--filled"
            }`}
          >
            {benefit.buttonText}
          </button>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="my-benefits locked">
   
    <p className="locked-message">
      Unlock {levels[index]?.awarded} to access these benefits by reaching {levels[index]?.minAmount} EXP
    </p>
  </div>
)}

      {/* <MyBenefits /> */}

      <div className="history-rules-container">
        <div className="history-section-group">
          <button style={{color:"#F95959"}}
            className={`history-tabs ${
              activeTab === "history" ? "active" : ""
            }`}
            onClick={() => handleTabClick("history")}
          >
            History
          </button>
          <button
          style={{color:"#F95959"}}
            className={`history-tabs ${activeTab === "rules" ? "active" : ""}`}
            onClick={() => handleTabClick("rules")}
          >
            Rules
          </button>
        </div>
        <section className="history-section">
          {activeTab === "history" && !hasData && (
            <div className="no-data-container">
              <img
                className="no-data-history-img"
                src="/assets/no-data-his.png"
                alt="No Data"
              />
              <span className="no-data-history-text">No data available</span>
            </div>
          )}
          {activeTab === "history" && hasData && (
            <div className="data-content">
              {historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <div key={index} className={`history-item ${item.type}`}>
                    <div className="history-item-right">
                      <p style={{color:"black"}} 
                        className={`history-item-title ${getTitleColorClass(
                          item.header
                        )}`}
                      >
                        {item.header}
                      </p>
                      <p style={{color:"black"}}  className="history-item-description">{item.message}</p>
                      <p style={{color:"black"}}  className="history-item-date">
                        {new Date(item.achievedAt).toLocaleString()}
                      </p>
                      <p style={{color:"black"}}  className="history-item-details">{item.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No VIP history available.</p>
              )}
              <button className="mybtn! view-all-btn" style={{backgroundColor:"#F95959"}}>View All</button>
            </div>
          )}
          {activeTab === "rules" && (
            <div className="rules-content">
              <h2 style={{color:"#F95959"}}>VIP privileges</h2>
              <p>VIP rule description</p>

              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Upgrade standard</div>
                <div className="rules-card-text">
                  The IP member's experience points (valid bet amount) that meet
                  the requirements of the corresponding rank will be promoted to
                  the corresponding VIP level, the member's VIP data statistics
                  period starts from 00:00:00 days VIP system launched.VIP level
                  calculation is refreshed every 10 minutes! The corresponding
                  experience level is calculated according to valid odds 1:1 !
                </div>
              </div>

              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Upgrade order</div>
                <div className="rules-card-text">
                  The VIP level that meets the corresponding requirements can be
                  promoted by one level every day, but the VIP level cannot be
                  promoted by leapfrogging.
                </div>
              </div>

              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Level maintenance</div>
                <div className="rules-card-text">
                  VIP members need to complete the maintenance requirements of
                  the corresponding level within 30 days after the "VIP level
                  change"; if the promotion is completed during this period, the
                  maintenance requirements will be calculated according to the
                  current level.
                </div>
              </div>

              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Downgrade standard</div>
                <div className="rules-card-text">
                  If a VIP member fails to complete the corresponding level
                  maintenance requirements within 30 days, the system will
                  automatically deduct the experience points corresponding to
                  the level. If the experience points are insufficient, the
                  level will be downgraded, and the corresponding discounts will
                  be adjusted to the downgraded level accordingly.
                </div>
              </div>

              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Upgrade Bonus</div>
                <div className="rules-card-text">
                  The upgrade benefits can be claimed on the VIP page after the
                  member reaches the VIP membership level, and each VIP member
                  can only get the upgrade reward of each level once.
                </div>
              </div>
              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Monthly reward</div>
                <div className="rules-card-text">
                  VIP members can earn the highest level of VIP rewards once a
                  month.Can only be received once a month. Prizes cannot be
                  accumulated. And any unclaimed rewards will be refreshed on
                  the next settlement day. When receiving the highest level of
                  monthly rewards this month Monthly Rewards earned in this
                  month will be deducted e.g. when VIP1 earns 500 and upgrades
                  to VIP2 to receive monthly rewards 500 will be deducted.
                </div>
              </div>
              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Real-time rebate</div>
                <div className="rules-card-text">
                  The higher the VIP level, the higher the return rate, all the
                  games are calculated in real time and can be self-rewarded!
                </div>
              </div>
              <div className="rules-card">
                <div className="rules-card-header" style={{backgroundColor:"#FA6764"}}>Safe</div>
                <div className="rules-card-text">
                  VIP members who have reached the corresponding level will get
                  additional benefits on safe deposit based on the member's VIP
                  level.
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SwipeableCards;
