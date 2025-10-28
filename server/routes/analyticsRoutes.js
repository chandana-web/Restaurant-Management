const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analysticsCon");

// Example: /api/analytics?filter=daily | weekly | monthly | yearly
router.get("/", getAnalytics);

module.exports = router;
