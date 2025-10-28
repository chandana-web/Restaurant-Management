
import axiosClient from "./axiosClient"

//  Get all orders

export const getAllOrders = async () => {
  try {
    const res = await axiosClient.get("/orders");
    console.log("API raw response:", res); // Should log Array([...])
    return res; // ✅ Return res directly (not res.data)
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

// ✅ Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const res = await axiosClient.patch(`/orders/${id}/status`, { status });
    return res; // same reason, no .data
  } catch (err) {
    console.error("Error updating order status:", err);
    throw err;
  }
};