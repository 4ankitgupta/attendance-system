const express = require("express");
const router = express.Router();

// Import all route files
const supervisorsWards = require("./supervisorsWard");
const attendanceRoutes = require("./attendanceRoutes");

// App Routes
router.use("/supervisor/wards", supervisorsWards);
router.use("/attendance/employee", attendanceRoutes);

module.exports = router;
