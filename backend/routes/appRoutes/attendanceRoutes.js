const express = require("express");
const axios = require("axios");
const router = express.Router();
const pool = require("../../config/db");
const multer = require("multer");
const fs = require("fs");
const { uploadImageToB2 } = require("../../utils/b2Storage"); // BlackBlaze Upload

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage: storage });

// Fetch or create attendance record for an employee
router.post("/", async (req, res) => {
  const { emp_id, date, ward_id } = req.body;
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const attendanceDate = date || today;

  if (!emp_id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    // Check if attendance record exists
    const result = await pool.query(
      `SELECT a.attendance_id, CAST(a.date AS VARCHAR) AS date, 
              TO_CHAR(a.punch_in_time, 'HH12:MI AM') AS punch_in_time, 
              TO_CHAR(a.punch_out_time, 'HH12:MI AM') AS punch_out_time, 
              a.duration, a.punch_in_image, a.punch_out_image, 
              a.latitude_in, a.longitude_in, a.in_address, 
              a.latitude_out, a.longitude_out, a.out_address,
              e.emp_id, e.emp_code, e.name AS employee_name, 
              d.designation_name, w.ward_id, w.ward_name
       FROM attendance a
       JOIN employee e ON a.emp_id = e.emp_id
       JOIN designation d ON e.designation_id = d.designation_id
       JOIN wards w ON e.ward_id = w.ward_id
       WHERE a.emp_id = $1 AND a.date = $2`,
      [emp_id, attendanceDate]
    );

    let attendance;

    if (result.rows.length > 0) {
      // Attendance record found
      attendance = result.rows[0];
    } else {
      // Create a new attendance record
      const insertResult = await pool.query(
        `INSERT INTO attendance (emp_id, date, ward_id) VALUES ($1, CURRENT_DATE, $2) RETURNING attendance_id, date`,
        [emp_id, ward_id]
      );

      attendance = {
        attendance_id: insertResult.rows[0].attendance_id,
        date: attendanceDate,
        punch_in_time: null,
        punch_out_time: null,
        duration: null,
        punch_in_image: null,
        punch_out_image: null,
        latitude_in: null,
        longitude_in: null,
        in_address: null,
        latitude_out: null,
        longitude_out: null,
        out_address: null,
        emp_id,
        emp_code: null, // Fetching separately
        employee_name: null,
        designation_name: null,
        ward_id: insertResult.rows[0].ward_id,
        ward_name: null,
      };

      // Fetch employee details
      const empDetails = await pool.query(
        `SELECT emp_code, name AS employee_name, d.designation_name, w.ward_id, w.ward_name
         FROM employee e
         JOIN designation d ON e.designation_id = d.designation_id
         JOIN wards w ON e.ward_id = w.ward_id
         WHERE e.emp_id = $1`,
        [emp_id]
      );

      if (empDetails.rows.length > 0) {
        Object.assign(attendance, empDetails.rows[0]);
      }
    }
    res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance record: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT Route - Now using multipart/form-data
router.put("/", upload.single("image"), async (req, res) => {
  const { attendance_id, punch_type, latitude, longitude, address } = req.body;

  if (!attendance_id || !punch_type || !latitude || !longitude || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch existing attendance record
    const attendanceResult = await pool.query(
      `SELECT punch_in_time, punch_out_time FROM attendance WHERE attendance_id = $1`,
      [attendance_id]
    );

    if (attendanceResult.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    const { punch_in_time, punch_out_time } = attendanceResult.rows[0];

    // Validate punch conditions (keep your existing validation logic)
    if (punch_type === "IN" && punch_in_time) {
      return res
        .status(400)
        .json({ error: "User has already punched in for today." });
    }
    if (punch_type === "OUT" && punch_out_time) {
      return res
        .status(400)
        .json({ error: "User has already punched out for today." });
    }
    if (punch_type === "OUT" && !punch_in_time) {
      return res
        .status(400)
        .json({ error: "User must punch in before punching out." });
    }

    let imageUrl = null;

    // Upload image directly as binary if provided
    if (req.file) {
      // Upload the raw buffer directly without base64 conversion
      imageUrl = await uploadImageToB2(
        req.file.buffer, // Direct binary buffer
        `attendance_${attendance_id}_${punch_type}.jpg`
      );
    }

    // Update attendance record
    const updateQuery =
      punch_type === "IN"
        ? `UPDATE attendance SET 
          punch_in_time = NOW(),
          latitude_in = $1, 
          longitude_in = $2, 
          in_address = $3, 
          punch_in_image = $4
         WHERE attendance_id = $5 RETURNING *`
        : `UPDATE attendance SET 
          punch_out_time = NOW(),
          latitude_out = $1, 
          longitude_out = $2, 
          out_address = $3, 
          punch_out_image = $4
         WHERE attendance_id = $5 RETURNING *`;

    const updateValues = [
      latitude,
      longitude,
      address,
      imageUrl,
      attendance_id,
    ];
    const result = await pool.query(updateQuery, updateValues);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Attendance update failed" });
    }

    res.json({
      message: `Punch ${punch_type} updated successfully`,
      attendance: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get attendance image - Optimized version
router.get("/image", async (req, res) => {
  const { attendance_id, punch_type } = req.query;

  if (!attendance_id || !punch_type) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const imageColumn =
      punch_type.toUpperCase() === "IN" ? "punch_in_image" : "punch_out_image";

    // Fetch image URL from the database
    const result = await pool.query(
      `SELECT ${imageColumn} AS image_url FROM attendance WHERE attendance_id = $1`,
      [attendance_id]
    );

    if (result.rows.length === 0 || !result.rows[0].image_url) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imageUrl = result.rows[0].image_url;

    // Fetch the image from Backblaze B2 with Authorization
    const authResponse = await axios.post(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {},
      {
        auth: {
          username: process.env.B2_APPLICATION_KEY_ID,
          password: process.env.B2_APPLICATION_KEY,
        },
      }
    );

    const authToken = authResponse.data.authorizationToken;

    const imageResponse = await axios.get(imageUrl, {
      headers: {
        Authorization: authToken,
      },
      responseType: "stream", // Stream the response directly
    });

    // Set proper headers
    res.set({
      "Content-Type": "image/jpeg",
      "Content-Disposition": `inline; filename="attendance_${attendance_id}_${punch_type}.jpg"`,
    });

    // Pipe the image stream directly to the response
    imageResponse.data.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
