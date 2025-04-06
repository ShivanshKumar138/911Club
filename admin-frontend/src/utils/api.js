import { getToken, removeToken } from "./auth";
import { Domain } from "../components/Config";

// const BASE_URL = "https://api.747lottery.fun";
const BASE_URL = "http://localhost:3002";

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${Domain}${endpoint}`, config);
  console.log("Response:", response);
  return handleResponse(response);
};
