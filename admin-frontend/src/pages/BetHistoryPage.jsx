/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Domain } from "@/components/Config";

const GameDetailsPage = () => {
  const [gameType, setGameType] = useState("wingo");
  const [gameData, setGameData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchUserId, setSearchUserId] = useState("");

  const gameOptions = [
    { value: "wingo", label: "Wingo" },
    { value: "fiveD", label: "Five D" },
    { value: "k3", label: "K3" },
    { value: "trx", label: "TRX" },
  ];

  useEffect(() => {
    fetchGameData();
  }, [gameType]);

  useEffect(() => {
    filterGameData();
  }, [searchUserId, gameData]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        Domain + `/get-all-bet?gameType=${gameType}`
      );
      setGameData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch game data");
      console.error("Error fetching game data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterGameData = () => {
    if (!searchUserId.trim()) {
      setFilteredData(gameData);
      return;
    }

    const filtered = gameData.filter(
      (bet) => bet.userId && bet.userId.toString().includes(searchUserId)
    );
    setFilteredData(filtered);
  };

  const handleGameChange = (e) => {
    setGameType(e.target.value);
    setSearchUserId(""); // Reset search when changing game type
  };

  const handleSearchChange = (e) => {
    setSearchUserId(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterGameData();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Game Details</h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <label htmlFor="gameType" className="block mb-2 font-medium">
            Select Game Type:
          </label>
          <select
            id="gameType"
            value={gameType}
            onChange={handleGameChange}
            className="w-full md:w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {gameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-grow">
            <input
              type="text"
              value={searchUserId}
              onChange={handleSearchChange}
              placeholder="Search by User ID"
              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading game data...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">UID</th>
                <th className="py-3 px-4 border-b text-left">Order ID</th>
                <th className="py-3 px-4 border-b text-left">Period ID</th>
                <th className="py-3 px-4 border-b text-right">Bet Amount</th>
                <th className="py-3 px-4 border-b text-right">Win/Loss</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((bet) => (
                  <tr key={bet._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{bet.userId}</td>
                    <td className="py-3 px-4 border-b">{bet.orderId}</td>
                    <td className="py-3 px-4 border-b">{bet.periodId}</td>
                    <td className="py-3 px-4 border-b text-right">
                      {bet.betAmount}
                    </td>
                    <td
                      className={`py-3 px-4 border-b text-right ${
                        parseFloat(bet.winLoss) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {bet.winLoss}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    {searchUserId
                      ? "No records found matching your search"
                      : "No data available for this game type"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredData.length > 0 && (
            <div className="mt-4 text-gray-600">
              Showing {filteredData.length} records
              {searchUserId ? ` for user ID containing "${searchUserId}"` : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameDetailsPage;
