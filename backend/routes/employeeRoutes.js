const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 🟢 Fetch all employees
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.employee ORDER BY emp_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// 🟢 Insert a new employee
router.post("/", async (req, res) => {
  try {
    const { name, emp_code, phone, ward_id, designation_id } = req.body;
    const result = await pool.query(
      "INSERT INTO public.employee (name, emp_code, phone, ward_id, designation_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, emp_code, phone, ward_id, designation_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// 🟢 Update an existing employee
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, emp_code, phone, ward_id, designation_id } = req.body;

    const result = await pool.query(
      "UPDATE public.employee SET name = $1, emp_code = $2, phone = $3, ward_id = $4, designation_id = $5 WHERE emp_id = $6 RETURNING *",
      [name, emp_code, phone, ward_id, designation_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// 🟢 Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM public.employee WHERE emp_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
