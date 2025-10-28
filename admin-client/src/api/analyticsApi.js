import axiosClient from "./axiosClient";

// 🔹 For the main analytics section (revenue, chefs, clients, etc.)
export const getAnalytics = async () => {
  try {
    const res= await axiosClient.get("/analytics?filter=yearly");
    return res.data || res;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// 🔹 For the Order Summary Card (served, dine-in, take-away)
export const getOrderSummary = async (filter = "daily") => {
  try {
    const res = await axiosClient.get(`/analytics?filter=${filter}`);
    // extract only the needed fields
    const data = res.data || res;
    return {
      servedOrders: data.servedOrders || data.served || 0,
      dineInOrders: data.dineInOrders || data.dineIn || 0,
      takeAwayOrders: data.takeAwayOrders || data.takeAway || 0,
    };
  } catch (error) {
    console.error("Error fetching order summary:", error);
    throw error;
  }
};


export const getRevenueData = async (filter = "daily") => {
  try {
    const res = await axiosClient.get(`/analytics?filter=${filter}`);
    const data = res.data || res;

    // Transform to chart-friendly format
    const formatted =
      data.revenueData?.map((item) => ({
        label: item.label || item._id || "",
        revenue: item.totalRevenue || item.amount || 0,
      })) || [];

    return formatted;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw error;
  }
};

export const getAllTables = async () => {
  try {
    const res = await axiosClient.get("/tables");
    const data = res.data || res;

  
    return data.map((t) => ({
      id: t._id,
      tableNumber: t.tableNumber,
      chairs: t.chairs,
      isAvailable: t.isAvailable,
    }));
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};






