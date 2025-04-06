import React from "react";

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        padding: "0",
        backgroundColor: "white",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        color: "white",
        zIndex: 1000,
      }}
    >
      {" "}
      <div
        style={{
          background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, color: "white" }}>How to play</h2>
      </div>
      <div
        style={{
          padding: "20px",
          maxHeight: "400px",
          overflowY: "auto",
          textAlign: "left ",
          color: "black",
        }}
      ><div className="game-rules">
      <h3>Game Rules:</h3>
      <ul>
        <li>New game every minute (1440 games per day)</li>
        <li>55 seconds to place order</li>
        <li>5 seconds waiting time for results</li>
      </ul>
    
      <h3>Betting Rules:</h3>
      <p>For every ₹100 bet:</p>
      <ul>
        <li>Service fee: ₹2.50</li>
        <li>Contract amount: ₹97.50</li>
      </ul>
    
      <h3>Winning Combinations:</h3>
      <ol>
        <li>
          <strong>Green Selection:</strong>
          <ul>
            <li>Numbers 1,3,7,9: Win ₹195 (2x)</li>
            <li>Number 5: Win ₹146.25 (1.5x)</li>
          </ul>
        </li>
    
        <li>
          <strong>Red Selection:</strong>
          <ul>
            <li>Numbers 2,4,6,8: Win ₹195 (2x)</li>
            <li>Number 0: Win ₹146.25 (1.5x)</li>
          </ul>
        </li>
    
        <li>
          <strong>Violet Selection:</strong>
          <ul>
            <li>Numbers 0 or 5: Win ₹438.75 (4.5x)</li>
          </ul>
        </li>
    
        <li>
          <strong>Number Selection:</strong>
          <ul>
            <li>Matching number: Win ₹877.50 (9x)</li>
          </ul>
        </li>
    
        <li>
          <strong>Small Selection:</strong>
          <ul>
            <li>Numbers 0,1,2,3,4: Win ₹195 (2x)</li>
          </ul>
        </li>
    
        <li>
          <strong>Big Selection:</strong>
          <ul>
            <li>Numbers 5,6,7,8,9: Win ₹195 (2x)</li>
          </ul>
        </li>
      </ol>
    </div>
      </div>
      <div
        style={{
          background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "10px 20px",
            width: "fit-content",
            margin: "0 auto",
            textAlign: "center",
            color: "#F95959",
            cursor: "pointer",
            borderRadius: "5px", // Make it look more like a button
            fontWeight:"bold"
          }}
          onClick={onClose} // Attach onClick event to the inner div
        >
          Close
        </div>
      </div>
    </div>
  );
};

export default Popup;
