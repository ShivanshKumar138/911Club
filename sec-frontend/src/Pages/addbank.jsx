import React, { useEffect, useState } from "react";
import axios from "axios";
import Addbankmain from "../Components/Addbankmain";
import BottomNavigationArea from "../Components/BottomNavigation";
import MaintenancePage from "../Components/MaintenancePage"; // Import the MaintenancePage component
import { domain } from "../Components/config";
import LoadingScreen from "../Components/LoadingScreen";

const Addbank = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await axios.get(`${domain}/maintenance-mode`,{withCredentials:true});
        const { maintenanceMode, accountType } = response.data;
        setIsMaintenance(maintenanceMode);
        setAccountType(accountType);
      } catch (error) {
        console.error("Error fetching maintenance mode:", error);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isMaintenance && accountType !== "Admin") {
    return <MaintenancePage />;
  }

  return (
    <div>
      <Addbankmain>
        <BottomNavigationArea />
      </Addbankmain>
    </div>
  );
};

export default Addbank;
