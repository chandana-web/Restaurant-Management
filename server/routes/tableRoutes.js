const express = require("express");
const router = express.Router();
const {
  createTable,
  getAllTables,
  updateTableStatus,
  deleteTable
} = require("../controllers/tableCon");

router.post("/", createTable);              // Add a new table
router.get("/", getAllTables);              // View all tables
router.put("/:id", updateTableStatus);      // Update availability
router.delete("/:id", deleteTable);         // Delete a table

module.exports = router;
