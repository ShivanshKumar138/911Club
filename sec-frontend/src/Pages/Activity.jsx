import React, { useEffect, useState } from "react";
import axios from "axios";
import ActivityMain from "../Components/ActivityMain";
import BottomNavigationArea from "../Components/BottomNavigation";
import MaintenancePage from "../Components/MaintenancePage"; // Import the MaintenancePage component
import { domain } from "../Components/config";
import LoadingScreen from "../Components/LoadingScreen";

const Activity = () => {

  return (
    <div>
      <ActivityMain>
        <BottomNavigationArea />
      </ActivityMain>
    </div>
  );
};

export default Activity;
