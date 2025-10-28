const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String },
  num: { type: String, required:true },
  orderType: { type: String, enum: ["Dine-In", "Take-Away", "Take Away"], required: true },
  numOfPeople: {
      type: Number,
      min: [2, "Minimum 2 people required for dine-in"],
      required: function () {
        return this.orderType === "Dine-In";
      },
    },
  table: { type: Number},
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required:true,},
      quantity: { type: Number, min: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  totalPrepTime:{type: Number, default:0},
  status: {
    type: String,
    enum: ["Processing", "Done", "Not Picked Up"],
    default: "Processing",
  },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
