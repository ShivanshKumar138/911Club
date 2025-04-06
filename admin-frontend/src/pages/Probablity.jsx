/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Domain } from "@/components/Config";

const WinProbabilitySettings = () => {
  const [probability, setProbability] = useState(30);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(Domain + "/win-probability");
      if (response.data.success) {
        // Convert from decimal to percentage for the UI
        setProbability(response.data.settings.singlePlayerWinProbability * 100);
      }
    } catch (error) {
      setMessage("Error loading settings");
      setMessageType("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setSaving(true);
      const response = await axios.put(Domain + "/win-probability", {
        // Convert from percentage to decimal for the database
        singlePlayerWinProbability: probability / 100,
      });

      if (response.data.success) {
        setMessage("Settings updated successfully");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Error updating settings");
      setMessageType("error");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">
          Single Player Win Probability
        </h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Win Probability (%)
            </label>

            <div className="relative mt-2">
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                min="0"
                max="100"
                step="1"
                required
              />
              <span className="absolute right-3 top-3 text-gray-500">%</span>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  style={{ width: `${probability}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Set the probability (0-100%) that a single player will win their
              bet
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all focus:ring-4 focus:ring-blue-300 ${
                saving ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Settings"
              )}
            </button>

            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setProbability(30)}
            >
              Reset to default (30%)
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 px-4 py-3 rounded-md ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default WinProbabilitySettings;
