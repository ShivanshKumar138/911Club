// src/analytics.js
import ReactGA from "react-ga4";

export const initializeAnalytics = () => {
  ReactGA.initialize("G-H1JP18228B"); // Replace with your Measurement ID
};

export const logPageView = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};
