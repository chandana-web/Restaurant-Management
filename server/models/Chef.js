const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalOrdersTaken: { type: Number, default: 0 },
  activeOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
});

module.exports = mongoose.model("Chef", chefSchema);
