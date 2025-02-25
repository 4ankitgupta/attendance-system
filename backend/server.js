require("dotenv").config();
const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const cityRoutes = require("./routes/cityRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const wardRoutes = require("./routes/wardRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const designationRoutes = require("./routes/designationRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Attendance System API is running...");
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
