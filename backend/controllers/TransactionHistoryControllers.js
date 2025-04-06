const TransactionModel = require("../models/TransictionHistory"); // Ensure correct model path
const express = require("express");

exports.addTransactionDetails = async (
  userId,
  amount,
  type,
  date, // Changed from 'time' to 'date' to match the model
  depositAmount = 0,
  betAmount = 0,
  gameType = "N/A",
  commissionFromUser = null,
  depositAmountOfUser = 0,
  commissionLevel = 0, // Added parameter
  firstDepositChecker = "notDepositYet" // Default value
) => {
  try {
    console.log("....> addTransactionDetails function called");
    console.log(".....> Parameters:", {
      userId,
      amount,
      type,
      date,
      depositAmount,
      betAmount,
      gameType,
      commissionFromUser,
      depositAmountOfUser,
      commissionLevel,
      firstDepositChecker,
    });

    // Create a new transaction record with the updated schema
    const newTransaction = new TransactionModel({
      user: userId,
      amount,
      type,
      date, // Ensure 'date' field is used
      depositAmount,
      betAmount,
      depositAmountOfUser,
      gameType,
      commissionFromUser,
      commissionLevel, // Add this field
      firstDepositChecker, // Add this field
    });

    console.log(".....> New Transaction:", newTransaction);
    await newTransaction.save();
    console.log(".....> Transaction saved successfully");
  } catch (error) {
    console.error(
      "....> Error occurred while adding transaction details:",
      error
    );
  }
};


