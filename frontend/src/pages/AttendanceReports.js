import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const apiUrl = `${API_BASE_URL}/api/attendance`;

function AttendanceReports() {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${apiUrl}?date=${selectedDate}`);
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchRecords();
  }, [selectedDate]); // ✅ Runs when selectedDate changes

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">📅 Attendance Reports</h1>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]} // Prevents future dates
          onChange={(e) => setSelectedDate(e.target.value)}
          className="ml-2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Attendance Table */}
      <div className="w-full overflow-x-auto">
        <table className="bg-white shadow-md rounded-lg border border-gray-300 w-full min-w-max">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border">Sr No.</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">EmpCode</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Ward</th>
              <th className="p-3 border">Zone</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Contact No.</th>
              <th className="p-3 border">Punch In</th>
              <th className="p-3 border">In Address</th>
              <th className="p-3 border">Punch In Image</th>
              <th className="p-3 border">Punch Out</th>
              <th className="p-3 border">Out Address</th>
              <th className="p-3 border">Punch Out Image</th>
              <th className="p-3 border">Duration</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record.sr_no}
                  className="border-b hover:bg-gray-100 text-gray-800"
                >
                  <td className="p-3 border">{record.sr_no}</td>
                  <td className="p-3 border">{record.name}</td>
                  <td className="p-3 border">{record.emp_code}</td>
                  <td className="p-3 border">{record.date}</td>
                  <td className="p-3 border">{record.ward}</td>
                  <td className="p-3 border">{record.zone}</td>
                  <td className="p-3 border">{record.city}</td>
                  <td className="p-3 border">{record.contact_no}</td>
                  <td className="p-3 border">{record.punch_in || "-"}</td>
                  <td className="p-3 border">{record.in_address || "-"}</td>
                  <td className="p-3 border text-center">
                    {record.punch_in_image ? (
                      <img
                        src={record.punch_in_image}
                        alt="Punch In"
                        className="w-10 h-10 rounded mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 border">{record.punch_out || "-"}</td>
                  <td className="p-3 border">{record.out_address || "-"}</td>
                  <td className="p-3 border text-center">
                    {record.punch_out_image ? (
                      <img
                        src={record.punch_out_image}
                        alt="Punch Out"
                        className="w-10 h-10 rounded mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 border">{record.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="p-3 text-center text-gray-500">
                  No records found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceReports;
