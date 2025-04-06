import { useState, useEffect } from "react";
import axios from "axios";
import { Domain } from "@/components/Config";

const PaymentConfigPage = () => {
  const [isAllPaymentMethodOn, setIsAllPaymentMethodOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await axios.get(Domain + "/payment-config");
        setIsAllPaymentMethodOn(response.data.isAllPaymentMethodOn);
        setLoading(false);
      } catch (err) {
        setError("Failed to load payment configuration");
        setLoading(false);
        console.error(err);
      }
    };

    fetchConfig();
  }, []);

  // Handle toggle change
  const handleToggleChange = async () => {
    try {
      setLoading(true);
      const newValue = !isAllPaymentMethodOn;

      const response = await axios.post(Domain + "/payment-config", {
        isAllPaymentMethodOn: newValue,
      });

      setIsAllPaymentMethodOn(response.data.isAllPaymentMethodOn);
      setLoading(false);
    } catch (err) {
      setError("Failed to update payment configuration");
      setLoading(false);
      console.error(err);
    }
  };

  if (loading && !isAllPaymentMethodOn) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Configuration</h1>

      <div className="bg-white shadow rounded p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Enable All Payment Methods</h2>
            <p className="text-gray-600">
              {isAllPaymentMethodOn
                ? "All payment methods are currently enabled"
                : "All payment methods are currently disabled"}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAllPaymentMethodOn}
              onChange={handleToggleChange}
              className="sr-only peer"
              disabled={loading}
            />
            <div
              className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                           peer-focus:ring-blue-300 rounded-full peer 
                           ${
                             isAllPaymentMethodOn
                               ? "after:translate-x-full after:border-white bg-blue-600"
                               : ""
                           } 
                           after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                           after:bg-white after:border-gray-300 after:border after:rounded-full 
                           after:h-5 after:w-5 after:transition-all`}
            ></div>
          </label>
        </div>

        {loading && <p className="mt-2 text-sm text-gray-500">Updating...</p>}
      </div>
    </div>
  );
};

export default PaymentConfigPage;
