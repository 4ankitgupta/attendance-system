const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 🟢 Fetch attendance report with formatted date and time
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        ROW_NUMBER() OVER () AS sr_no,
        e.name, 
        e.emp_code, 
        TO_CHAR(a.date, 'DD-MM-YYYY') AS date,
        w.ward_name AS ward, 
        z.zone_name AS zone, 
        c.city_name AS city, 
        e.phone AS contact_no, 
        TO_CHAR(a.punch_in_time, 'HH24:MI:SS') AS punch_in, 
        a.in_address, 
        a.punch_in_image, 
        TO_CHAR(a.punch_out_time, 'HH24:MI:SS') AS punch_out, 
        a.out_address, 
        a.punch_out_image, 
        a.duration
      FROM attendance a
      JOIN employee e ON a.emp_id = e.emp_id
      JOIN wards w ON a.ward_id = w.ward_id
      JOIN zones z ON w.zone_id = z.zone_id
      JOIN cities c ON z.city_id = c.city_id
      ORDER BY a.date DESC;`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
