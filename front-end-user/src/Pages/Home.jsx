import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeMain from "../Components/HomeMain";
import BottomNavigationArea from "../Components/BottomNavigation";
import { domain } from "../Components/config";
import MaintenancePage from "../Components/MaintenancePage"; // Import the MaintenancePage component
import LoadingScreen from "../Components/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <HomeMain>
        <BottomNavigationArea />
      </HomeMain>
    </div>
  );
};

export default Home;
