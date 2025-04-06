import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountMain from "../Components/AccountMain";
import BottomNavigationArea from "../Components/BottomNavigation";
import MaintenancePage from "../Components/MaintenancePage"; // Import the MaintenancePage component
import { domain } from "../Components/config";
import LoadingScreen from "../Components/LoadingScreen";

const Account = () => {
  return (
    <div>
      <AccountMain>
        <BottomNavigationArea />
      </AccountMain>
    </div>
  );
};

export default Account;
