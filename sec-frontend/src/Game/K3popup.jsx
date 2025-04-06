import React from 'react';

const K3popup = ({ isOpen, onClose }) => {
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
          backgroundColor: "#F95959",
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
  <span style={{ display: 'block', marginBottom: '20px' }}></span>
  Fast 3 open with 3 numbers in each period as the opening number. The opening numbers are 111 to 666, natural numbers. No zeros in the array and the opening numbers are in no particular order. Quick 3 is to guess all or part of the 3 winning numbers.
  <br />
  <span style={{ display: 'block', marginBottom: '20px' }}>
    <b>Sum Value</b>
    <br />
    Place a bet on the sum of three numbers
    <br /><br />
    
    <b>Choose 3 same number all</b>
    <br />
    For all the same three numbers (111, 222, ..., 666) Make an all-inclusive bet
    <br /><br />
    
    <b>Choose 3 same number single</b>
    <br />
    From all the same three numbers (111, ..., 666) Choose a group of numbers in any of them to place bets
    <br /><br />
    
    <b>Choose 2 Same Multiple</b>
    <br />
    Place a bet on two designated same numbers and an arbitrary number among the three numbers
    <br /><br />
    
    <b>Choose 2 Same Single</b>
    <br />
    Place a bet on two designated same numbers and a designated different number among the three numbers (except for the three same numbers)
    <br /><br />
    
    <b>3 numbers different</b>
    <br />
    Place a bet on three different numbers
    <br /><br />
    
    <b>2 numbers different</b>
    <br />
    Place a bet on two designated different numbers and an arbitrary number among the three numbers
    <br /><br />
    
    <b>Choose 3 Consecutive numbers all</b>
    <br />
    For all three consecutive numbers (123, 234, 345, 456) Place a bet
  </span>
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
            backgroundColor: "#F95959",
            padding: '10px 20px',
            width: 'fit-content',
            margin: '0 auto',
            textAlign: 'center',
            color: "white",
            cursor: 'pointer',
            borderRadius: '5px', // Make it look more like a button
          }}
          onClick={onClose} 
        >
          Close
        </div>
      </div>
    </div>
  );
};

export default K3popup;