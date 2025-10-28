const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  period: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], required: true },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalClients: { type: Number, default: 0 },
  dineInOrders: { type: Number, default: 0 },
  takeAwayOrders: { type: Number, default: 0 },
  servedOrders: { type: Number, default: 0 },
  activeTables: { type: Number, default: 0 },
  totalTables: { type: Number, default: 0 },
  revenueData: [
    {
     label: String,           // e.g. "Mon", "Jan", or "12:00"
    totalRevenue: Number,    // revenue for that time block
    totalOrders: Number,     // orders for that time block
    },
  ],
  chefStats: [
    {
      name: String,
      activeOrders: Number,
      totalOrdersTaken: Number,
    },
  ],

  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RestaurantAnalytics", analyticsSchema);