require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const allRoutes = require("./routes/index");

const app = express();

// Middleware
app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  cors({
    origin: true, // Reflects the request origin
    credentials: true,
  })
);
app.use(cookieParser());

// Auth Routes
app.use("/api/auth", authRoutes);

// General API Route
app.get("/", (req, res) => {
  res.send("Attendance System API is running...");
});

// Other Routes
app.use("/api", allRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
