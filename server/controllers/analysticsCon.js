const Order = require("../models/Order");
const Table = require("../models/Table");
const Chef = require("../models/Chef");
const RestaurantAnalytics = require("../models/Restaurant");

// Utility: Date range generator
const getDateRange = (filter) => {
  const now = new Date();
  let startDate;
  switch (filter) {
    case "daily":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0);
  }
  return { startDate, endDate: now };
};

const getAnalytics = async (req, res) => {
  try {
    const filter = req.query.filter || "daily";
    const { startDate, endDate } = getDateRange(filter);

    //Fetch all orders in date range
    const filteredOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    if (!filteredOrders.length) {
      return res.status(200).json({ message: "No orders found for this period" });
    }

    //  Calculate metrics
    const clientNumbers = filteredOrders
      .map((o) => (o.num ? String(o.num).trim() : null))
      .filter(Boolean);
    const totalClients = new Set(filteredOrders.map(o => String(o.num).trim()).filter(Boolean)).size;

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const totalChefs = await Chef.countDocuments();
    const dineInOrders = filteredOrders.filter(
      (o) => o.orderType === "Dine-In"
    ).length;
    const takeAwayOrders = filteredOrders.filter(
      (o) => o.orderType === "Take Away"
    ).length;
    const servedOrders = filteredOrders.filter(
      (o) => o.status === "Done"
    ).length;

    const totalTables = await Table.countDocuments();
    const activeTables = await Table.countDocuments({ isAvailable: false });

    //  Get per-chef statistics
    const chefs = await Chef.find();
    const chefStats = chefs.map((chef) => ({
    name: chef.name,
    activeOrders: chef.activeOrders ? chef.activeOrders.length : 0,
    totalOrdersTaken: chef.totalOrdersTaken || 0,
    }));


    // ✅ Group revenue by timeframe
    const revenueMap = {};
    filteredOrders.forEach((order) => {
      const d = new Date(order.createdAt);
      let key;
      switch (filter) {
        case "yearly":
          key = d.toLocaleString("default", { month: "short" });
          break;
        case "monthly":
          key = d.getDate();
          break;
        case "weekly":
          key = d.toLocaleString("default", { weekday: "short" });
          break;
        default:
          key = `${d.getHours()}:00`;
      }
      if (!revenueMap[key]) revenueMap[key] = { totalRevenue: 0, totalOrders: 0 };
      revenueMap[key].totalRevenue += order.totalAmount;
      revenueMap[key].totalOrders += 1;
    });

    const revenueData = Object.entries(revenueMap).map(([label, data]) => ({
      label,
      ...data,
    }));

    // (Optional) Save summary to analytics model for caching
    await RestaurantAnalytics.findOneAndUpdate(
      { period: filter },
      {
        period: filter,
        totalOrders,
        totalRevenue,
        totalClients,
        dineInOrders,
        takeAwayOrders,
        servedOrders,
        activeTables,
        totalTables,
        revenueData,
        chefStats,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    // ✅ Send response
    res.status(200).json({
      filter,
      totalChefs,
      totalRevenue,
      totalOrders,
      totalClients,
      dineInOrders,
      takeAwayOrders,
      servedOrders,
      activeTables,
      totalTables,
      revenueData,
      chefStats,
    });
  } catch (error) {
    console.error("Error in analytics:", error);
    res
      .status(500)
      .json({ message: "Error fetching analytics", error: error.message });
  }
};

module.exports = { getAnalytics };

