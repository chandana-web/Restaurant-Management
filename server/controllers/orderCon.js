const Order = require("../models/Order");
const Table = require("../models/Table");
const MenuItem = require("../models/MenuItem");
const Chef=require("../models/Chef")
const mongoose  = require("mongoose");

// Create new order (for dine-in or takeaway)
const createOrder = async (req, res) => {
  try {
    const { customerName, num, orderType,numOfPeople, items } = req.body;

    if (!num || !orderType || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find table if dine-in
    let table = null;
    let tableNumber=null
    if (orderType === "Dine-In") {
         if (!numOfPeople || numOfPeople < 1) {
        return res.status(400).json({ message: "Number of people required for dine-in orders" });
      }
     
      // Find smallest available table that fits the group
      const suitableTables = await Table.find({
        isAvailable: true,
        chairs: { $gte: numOfPeople }
      }).sort({ chairs: 1 });

      if (!suitableTables.length) {
        return res.status(400).json({
          message: `No available table found for ${numOfPeople} people.`,
        });
      }

      // Assign first matching table
      table = suitableTables[0];
      tableNumber = table.tableNumber;
      table.isAvailable = false;
      await table.save();
    }

    // 🔹 Calculate total and prep time
    let totalAmount = 0;
    let totalPrepTime = 0;
    const formattedItems = [];

    for (const item of items) {
      let menuItem;
      if (mongoose.Types.ObjectId.isValid(item.menuItem)) {
        menuItem = await MenuItem.findById(item.menuItem);
      } else {
        menuItem = await MenuItem.findOne({
          name: { $regex: new RegExp(item.menuItem, "i") },
        });
      }

      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }

      const quantity = item.quantity || 1;
      formattedItems.push({ menuItem: menuItem._id, quantity });

      totalAmount += menuItem.price * quantity;
      if (menuItem.averagePrepTime && typeof menuItem.averagePrepTime === "number") {
        totalPrepTime += menuItem.averagePrepTime * quantity;
      }
    }

    // 🔹 Assign chef with least active orders
    const chefs = await Chef.find();
    if (chefs.length === 0) {
      return res.status(400).json({ message: "No chefs found. Please initialize chefs first." });
    }

   let sortedChefs = chefs.sort(
  (a, b) => (a.totalOrdersTaken || 0) - (b.totalOrdersTaken || 0)
);
const selectedChef = sortedChefs[0];
     

    // Create order
    const order = new Order({
      customerName,
      num,
      orderType,
      numOfPeople,
      table: tableNumber,
      items: formattedItems,
      totalAmount,
      chef: selectedChef._id,
      totalPrepTime,
    });

    const savedOrder = await order.save();

    // Link order to table if dine-in
    if (table) {
      table.currentOrder = savedOrder._id;
      await table.save();
    }

    // Update chef’s active and total orders
    selectedChef.activeOrders.push(savedOrder._id);
    selectedChef.totalOrdersTaken += 1;
    await selectedChef.save();

    res.status(201).json({
      message: `Order created and assigned to ${selectedChef.name}`,
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem", "name price category")
      .populate("table", "tableNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

//Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Processing", "Done", "Not Picked Up"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Free table when order is done or served
    if (order.orderType === "Dine-In" && status==="Done") {
      const table = await Table.findOne({tableNumber: order.table});
      if (table) {
        table.isAvailable = true;
        table.currentOrder = null;
        await table.save();
      }
    }

     //  Remove order from chef’s activeOrders when completed
    if (status === "Done" && order.chef) {
      const chef = await Chef.findById(order.chef);
      if (chef) {
        chef.activeOrders = chef.activeOrders.filter(
          (o) => o.toString() !== order._id.toString()
        );
        await chef.save();
      }
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
};

module.exports = { createOrder, getAllOrders, updateOrderStatus };

  