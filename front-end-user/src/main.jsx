import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import i18n from "./contexts/i18n";
import { I18nextProvider } from "react-i18next"; // add this line
import { BankProvider } from "./Pages/BankContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    <I18nextProvider i18n={i18n}>
      <BankProvider>
        <App />
      </BankProvider>
    </I18nextProvider>

);
