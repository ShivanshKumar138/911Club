import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeMain from "../Components/HomeMain";
import BottomNavigationArea from "../Components/BottomNavigation";
import { domain } from "../Components/config";
import MaintenancePage from "../Components/MaintenancePage"; // Import the MaintenancePage component
import LoadingScreen from "../Components/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and admin status from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const isAdmin = urlParams.get("admin") === "true";
    if (token) {
      // Use your existing login function from AuthContext
      login(token, false);
      console.log(login(token, isAdmin));
      // Redirect to home page after successful login
      navigate("/home", { replace: true });
    } else {
      // No token found, redirect to login
      navigate("/login", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div>
      <h1>Wait while redirecting....</h1>
    </div>
  );
};

export default LoadingPage;
