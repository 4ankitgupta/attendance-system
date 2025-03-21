const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ Import middleware

const router = express.Router();

// ✅ Get Logged-in User
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_id, name, email, role FROM users WHERE user_id = $1",
      [req.user.user_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Create new User
router.post("/register", async (req, res) => {
  const { name, emp_code, email, phone, role, password } = req.body;

  if (!name || !emp_code || !email || !phone || !role || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      "INSERT INTO users (name, emp_code, email, phone, role, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, role",
      [name, emp_code, email, phone, role, hashedPassword]
    );

    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique violation
      return res
        .status(400)
        .json({ error: "Email or Employee Code already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

router.put("/update", async (req, res) => {
  const { user_id, name, emp_code, email, phone, role } = req.body;

  if (!user_id || !name || !emp_code || !email || !phone || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE USERS SET name = $2, emp_code = $3, email = $4, phone = $5, role = $6 where user_id = $1",
      [user_id, name, emp_code, email, phone, role]
    );

    res.status(200).json({ message: "User updated", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Updation failed" });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { user_id: user.rows[0].user_id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.rows[0].user_id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        emp_code: user.rows[0].emp_code,
        phone: user.rows[0].phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Logout User
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
