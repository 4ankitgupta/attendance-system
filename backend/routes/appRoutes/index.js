const express = require("express");
const router = express.Router();

// Import all route files
const supervisorsWards = require("./supervisorsWard");
const attendanceRoutes = require("./attendanceRoutes");
const employeeRoutes = require("./employeeDetail");

// App Routes
router.use("/supervisor/wards", supervisorsWards);
router.use("/attendance/employee", attendanceRoutes);
router.use("/attendance/employee/detail", employeeRoutes);

module.exports = router;
