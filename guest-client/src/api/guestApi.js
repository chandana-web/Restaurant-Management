// src/api/menuApi.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err);
    throw err.response?.data || err.message;
  }
);

export const getAllMenuItems = async () => {
  try {
    const res = await axiosClient.get("/menu");
    return res;
  } catch (error) {
    console.error(" Failed to fetch menu:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const res = await axiosClient.post("/orders", orderData); //  match your backend route
    return res;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};
