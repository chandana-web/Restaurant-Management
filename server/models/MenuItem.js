const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // image URL or path
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Pizza, Burger, etc.
  rating: { type: Number, default: 0 },
  averagePrepTime: { type: Number, default: 0},
  inStock: { type: Boolean, default: true },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
