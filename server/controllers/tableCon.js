const Table = require("../models/Table");

//  Create a new table
const createTable = async (req, res) => {
  try {
    const { tableNumber, chairs } = req.body;

    const existing = await Table.findOne({ tableNumber });
    if (existing) return res.status(400).json({ message: "Table already exists" });

    const table = new Table({
      tableNumber,
      chairs: chairs || 4,
      isAvailable: true
    });

    await table.save();
    res.status(201).json({ message: "Table created successfully", table });
  } catch (error) {
    res.status(500).json({ message: "Error creating table", error });
  }
};

//  Get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error });
  }
};

// Update table availability
const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const table = await Table.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!table) return res.status(404).json({ message: "Table not found" });
    res.status(200).json({ message: "Table updated successfully", table });
  } catch (error) {
    res.status(500).json({ message: "Error updating table", error });
  }
};

//  Delete a table
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndDelete(id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting table", error });
  }
};

module.exports = {
  createTable,
  getAllTables,
  updateTableStatus,
  deleteTable
};
