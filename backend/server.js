require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const employeeRoutes = require("./routes/employeeRoutes");
const cityRoutes = require("./routes/cityRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const wardRoutes = require("./routes/wardRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");

const app = express();
app.use(express.json());
// app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Attendance System API is running...");
});

// middleware
const authenticateUser = require("./middleware/authMiddleware");

app.get("/api/protected", authenticateUser, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

// Use employee routes
app.use("/api/employees", employeeRoutes);
// Use city routes
app.use("/api/cities", cityRoutes);
// Use zone routes
app.use("/api/zones", zoneRoutes);
// Use ward routes
app.use("/api/wards", wardRoutes);
// Use department routes
app.use("/api/departments", departmentRoutes);
// Use department routes
app.use("/api/designations", designationRoutes);
// Use attendance routes
app.use("/api/attendance", attendanceRoutes);
// Use attendance routes
app.use("/api/supervisor", supervisorRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
