const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ Create a new user
router.post("/", async (req, res) => {
  const { name, emp_code, email, phone, role, password, confirmPassword } =
    req.body;

  // ✅ Validate required fields
  if (
    !name ||
    !emp_code ||
    !email ||
    !phone ||
    !role ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ✅ Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // ✅ Check if user with the same emp_code or email already exists
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE emp_code = $1 OR email = $2",
      [emp_code, email]
    );

    if (existingUser.rowCount > 0) {
      return res
        .status(400)
        .json({ error: "Employee code or email already exists" });
    }

    // ✅ Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Insert new user
    const result = await pool.query(
      "INSERT INTO users (name, emp_code, email, phone, role, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, name, emp_code, email, phone, role",
      [name, emp_code, email, phone, role, hashedPassword]
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
