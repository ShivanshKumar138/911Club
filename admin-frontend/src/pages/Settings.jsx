/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { apiCall } from "@/utils/api";
import { FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import axios from "axios";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Domain } from "../components/Config";

const domain = Domain;

const FormField = ({ label, error, children }) => (
  <div className="space-y-1 w-full">
    <label className="text-sm font-medium">{label}</label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const SettingsCard = ({
  title,
  onUpdate,
  children,
  initialValues,
  currentValues,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { toast } = useToast();

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormErrors({});
  };

  const handleUpdate = () => {
    onUpdate();
    setFormErrors({});
    handleClose();
    toast({
      title: "Settings Updated",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all"
      onClick={handleOpen}
    >
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Click to update</p>
      </CardContent>

      <Dialog open={isOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()} // prevent clicks inside dialog from bubbling up
          hideCloseButton={true}
          className="w-full max-w-[90vw] sm:max-w-lg overflow-y-auto max-h-[85vh] relative 
                     transform -translate-y-full sm:-translate-y-52"
        >
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, { errors: formErrors })
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const Settings = () => {
  const [upiSettings, setUpiSettings] = useState({
    upiId: "",
    trxAddress: "",
    image: null,
  });
  const [depositBonus, setDepositBonus] = useState({
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
  });
  const [commissionRates, setCommissionRates] = useState({
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
  });
  const [gameWinningType, setGameWinningType] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(true);
  const [isRandomWinning, setIsRandomWinning] = useState(true);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isGameWinningLoading, setIsGameWinningLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [telegramLink, setTelegramLink] = useState(""); // New state for Telegram link
  const [walletHoldSettings, setWalletHoldSettings] = useState({
    uid: "",
    status: false,
    holdAmount: "", // Add holdAmount to the state
  });

  useEffect(() => {
    const fetchCommissionRates = async () => {
      try {
        const response = await apiCall("/fetch-commission-rates", {
          method: "GET",
        });
        if (response.data) setDepositBonus(response.data);
      } catch (error) {
        console.error("Error fetching deposit bonus:", error);
      }
    };
    fetchCommissionRates();

    const fetchCommissionRatesData = async () => {
      try {
        const response = await apiCall("/commissionRates-data-get", {
          method: "GET",
        });
        if (response) setCommissionRates(response);
      } catch (error) {
        console.error("Error fetching commission rates:", error);
      }
    };
    fetchCommissionRatesData();

    const fetchGameWinningType = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${domain}/game-winning-type`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsRandomWinning(response.data.data.isRandomWinning);
      } catch (error) {
        console.error("Error fetching game winning type:", error);
        setSnackbar({
          open: true,
          message: "Error fetching game winning type settings",
          severity: "error",
        });
      }
    };
    fetchGameWinningType();
  }, []);

  const handleUpdateUpiTrx = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const formData = new FormData();
      formData.append("Upi", upiSettings.upiId);
      formData.append("Trx", upiSettings.trxAddress);
      if (upiSettings.image) formData.append("image", upiSettings.image);

      const response = await axios.post(
        "https://api.747lottery.fun/upsertID",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200)
        console.log("UPI / TRX Address updated successfully");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  };

  const handleUpdateDepositBonus = async () => {
    try {
      const updatedDepositBonus = {
        ...depositBonus,
        level6: Number(depositBonus.level6),
      };
      console.log("depositBonus", updatedDepositBonus);
      await apiCall("/update-commission-rates", {
        method: "PUT",
        body: JSON.stringify(updatedDepositBonus),
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleUpdateCommissionRates = async () => {
    try {
      console.log("commissionRates", commissionRates);
      await apiCall("/commissionRates", {
        method: "PUT",
        body: JSON.stringify(commissionRates),
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };
  const handleToggleGameWinningType = async () => {
    setIsGameWinningLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `${domain}/game-winning-type`,
        { isRandomWinning: !isRandomWinning },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsRandomWinning(response.data.data.isRandomWinning);
        console.log(response);
        setSnackbar({
          open: true,
          message: "Game winning type updated successfully",
          severity: "success",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to update game winning type"
        );
      }
    } catch (error) {
      console.error("Error while toggling game winning type:", error);
      setSnackbar({
        open: true,
        message: "Failed to update game winning type",
        severity: "error",
      });
    } finally {
      setIsGameWinningLoading(false);
    }
  };

  const handleUpdateWalletHold = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const response = await axios.patch(
        "https://api.747lottery.fun/toggle-wallet-hold",
        walletHoldSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Wallet ${
            walletHoldSettings.status ? "locked" : "unlocked"
          } successfully`,
          severity: "success",
        });
        setWalletHoldSettings({ uid: "", status: false, holdAmount: "" }); // Reset form
      }
    } catch (error) {
      console.error("Update error:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to update wallet hold status",
        severity: "error",
      });
    }
  };

  const handleUpdateTelegramLink = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");
      console.log("telegramLink ------>>", telegramLink);
      const response = await axios.put(
        "https://api.747lottery.fun/UpdateTelegramLink",
        { telegramLink },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("tele updated------>>", response);
      if (response.status === 200) {
        console.log("Telegram link updated successfully");
        setSnackbar({
          open: true,
          message: "Telegram link updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Failed to update Telegram link",
        severity: "error",
      });
    }
  };
  useEffect(() => {
    const fetchTelegramLink = async () => {
      try {
        const response = await apiCall("/getTelegramLink", { method: "GET" });
        if (response.data) setTelegramLink(response.data.telegramLink);
      } catch (error) {
        console.error("Error fetching Telegram link:", error);
      }
    };
    fetchTelegramLink();

    const fetchNeedToDepositFirst = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await axios.get(`${domain}/need-to-deposit-first`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNeedToDepositFirst(response.data.data.needToDepositFirst);
      } catch (error) {
        console.error("Error fetching need to deposit first setting:", error);
        setSnackbar({
          open: true,
          message: "Error fetching need to deposit first setting",
          severity: "error",
        });
      }
    };

    fetchNeedToDepositFirst();
  }, []);

  const handleToggleDepositFirst = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${domain}/update-need-to-deposit-first`,
        { needToDepositFirst: !needToDepositFirst },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNeedToDepositFirst(response.data.data.needToDepositFirst);
        setSnackbar({
          open: true,
          message: "Setting updated successfully",
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to update setting");
      }
    } catch (error) {
      console.error("Error while toggling needToDepositFirst:", error);
      setSnackbar({
        open: true,
        message: "Failed to update setting",
        severity: "error",
      });
    } finally {
      console.log("Need to deposit first setting updated successfully");
    }
  };

  const handleToggleRegisterType = async () => {
    console.log("Working");
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);
    const userInfo = localStorage.getItem("userInfo");
    const parsedUserInfo = JSON.parse(userInfo);
    console.log(parsedUserInfo);
    console.log(parsedUserInfo.username);
    try {
      const response = await axios.put({ domain } + "/register-otp-toggle", {
        username: parsedUserInfo.username,
        isToggle: newToggleState,
      });
      console.log(response.data);
      const response2 = await axios.get({ domain } + "/register-otp-toggle");
      console.log(response2.data);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Register Otp Toggle button</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isToggleOn}
                    onChange={handleToggleRegisterType}
                  />
                }
                label={isToggleOn ? "On" : "Off"}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Game Winning Type</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isRandomWinning}
                    onChange={handleToggleGameWinningType}
                    disabled={isGameWinningLoading}
                  />
                }
                label={isRandomWinning ? "Random" : "Fixed"}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Need to Deposit First</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={needToDepositFirst}
                    onChange={handleToggleDepositFirst}
                  />
                }
                label={needToDepositFirst ? "Required" : "Optional"}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SettingsCard
          title="Update UPI / TRX Address"
          onUpdate={handleUpdateUpiTrx}
        >
          <FormField label="UPI ID">
            <Input
              value={upiSettings.upiId}
              onChange={(e) =>
                setUpiSettings({ ...upiSettings, upiId: e.target.value })
              }
            />
          </FormField>
          <FormField label="TRX Address">
            <Input
              value={upiSettings.trxAddress}
              onChange={(e) =>
                setUpiSettings({ ...upiSettings, trxAddress: e.target.value })
              }
            />
          </FormField>
          <FormField label="Upload Image">
            <Input
              type="file"
              onChange={(e) =>
                setUpiSettings({ ...upiSettings, image: e.target.files[0] })
              }
            />
          </FormField>
        </SettingsCard>

        <SettingsCard
          title="Update Deposit Bonus Commission"
          onUpdate={handleUpdateDepositBonus}
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <FormField key={level} label={`Level ${level}`}>
              <Input
                value={depositBonus[`level${level}`]}
                onChange={(e) =>
                  setDepositBonus({
                    ...depositBonus,
                    [`level${level}`]: e.target.value,
                  })
                }
              />
            </FormField>
          ))}
        </SettingsCard>

        <SettingsCard
          title="Update Game Commission Rates"
          onUpdate={handleUpdateCommissionRates}
        >
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <FormField key={level} label={`Level ${level}`}>
              <Input
                value={commissionRates[`level${level}`]}
                onChange={(e) =>
                  setCommissionRates({
                    ...commissionRates,
                    [`level${level}`]: e.target.value,
                  })
                }
              />
            </FormField>
          ))}
        </SettingsCard>

        <SettingsCard
          title="Update Telegram Link"
          onUpdate={handleUpdateTelegramLink}
        >
          <FormField label="Telegram Link">
            <Input
              value={telegramLink}
              onChange={(e) => setTelegramLink(e.target.value)}
            />
          </FormField>
        </SettingsCard>

        <SettingsCard
          title="Update User Wallet Hold Status"
          onUpdate={handleUpdateWalletHold}
        >
          <FormField label="User ID (UID)">
            <Input
              value={walletHoldSettings.uid}
              onChange={(e) =>
                setWalletHoldSettings({
                  ...walletHoldSettings,
                  uid: e.target.value,
                })
              }
              placeholder="Enter user UID"
            />
          </FormField>
          <FormField label="Wallet Status">
            <Select
              value={walletHoldSettings.status.toString()}
              onValueChange={(value) =>
                setWalletHoldSettings({
                  ...walletHoldSettings,
                  status: value === "true",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select wallet status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Locked</SelectItem>
                <SelectItem value="false">Unlocked</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Hold Amount">
            <Input
              type="number"
              value={walletHoldSettings.holdAmount}
              onChange={(e) =>
                setWalletHoldSettings({
                  ...walletHoldSettings,
                  holdAmount: Number(e.target.value),
                })
              }
              placeholder="Enter hold amount"
            />
          </FormField>
        </SettingsCard>
      </div>
    </div>
  );
};

export default Settings;
