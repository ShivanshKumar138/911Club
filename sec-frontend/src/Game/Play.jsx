import React from 'react';

const Play = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        padding: '0',
        backgroundColor: '#ffffff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        color: 'black',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundImage: "linear-gradient(to right,#4782ff, #4782ff)",
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          padding: '15px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: 0, color: "white" }}>How to play</h2>
      </div>
      <div
  style={{
    padding: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
    textAlign: 'left ', 
  }}
>
  <p>
  1 minutes 1 issue, 55 seconds to order, 5 seconds waiting for the draw. It opens all day. The total number of trade is 1440 issues.<br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    if you spend 100 to trade, after deducting service fee 2%, contract amount : 98
    <br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    1. Select green: if the result shows 1,3,7,9 you will get (98*2)=196;If the result shows 5, you will get (98*1.5) 147    <br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    2. Select red: if the result shows 2, 4, 6, will get (98*2)=196; If the result shows 0, you will get (98*1.5) 147   <br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    3. Select violet: if the result shows 0 or 5, you will get (98*2)=196
  </p>
  <p>
  4. Select number: if the result is the same as the number you selected, you will get (98*9)=882<br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    5. Select big: if the result shows 5, 6, 7, 8, 9 you will get (98*2)=196
    <br />
    <span style={{ display: 'block', marginBottom: '20px' }}></span>
    6. Select small: if the result shows 0, 1, 2, 3, 4 you will get (98*2)=196
    <br />
  </p>
</div>
<div
        style={{
          backgroundColor: '#ffffff',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundImage: "linear-gradient(to right,#4782ff, #4782ff)",
            padding: '10px 20px',
            width: 'fit-content',
            margin: '0 auto',
            textAlign: 'center',
            color: "white",
            cursor: 'pointer',
            borderRadius: '5px', // Make it look more like a button
          }}
          onClick={onClose} // Attach onClick event to the inner div
        >
          Close
        </div>
      </div>
    </div>
  );
};

export default Play;