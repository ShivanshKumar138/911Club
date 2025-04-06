import React, { createContext, useContext, useState } from "react";

// Create the context
const BankContext = createContext();

// Create a provider component
export const BankProvider = ({ children }) => {
  const [selectedBank, setSelectedBank] = useState(null);

  // Log changes to selectedBank
  console.log("BankProvider - selectedBank:", selectedBank);

  return (
    <BankContext.Provider value={{ selectedBank, setSelectedBank }}>
      {children}
    </BankContext.Provider>
  );
};

// Create a custom hook to use the BankContext
export const useBank = () => useContext(BankContext);
