import { useState } from "react";

const sampleAttendance = [
  {
    id: 1,
    emp_name: "John Doe",
    supervisor_name: "Michael Scott",
    ward_name: "Ward 5",
    designation: "Supervisor",
    date: "2025-02-19",
    status: "present",
    punch_in_time: "09:00 AM",
    punch_out_time: "05:00 PM",
    punch_in_image: "https://via.placeholder.com/50",
    punch_out_image: "https://via.placeholder.com/50",
    in_address: "123 Street, NY",
    out_address: "456 Avenue, NY",
  },
  {
    id: 2,
    emp_name: "Jane Smith",
    supervisor_name: "Dwight Schrute",
    ward_name: "Ward 2",
    designation: "Worker",
    date: "2025-02-19",
    status: "absent",
    punch_in_time: "-",
    punch_out_time: "-",
    punch_in_image: "",
    punch_out_image: "",
    in_address: "-",
    out_address: "-",
  },
];

function AttendanceReports() {
  const [records] = useState(sampleAttendance);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Filter records based on selected date
  const filteredRecords = records.filter(
    (record) => record.date === selectedDate
  );

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
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Supervisor</th>
              <th className="p-3 border">Ward</th>
              <th className="p-3 border">Designation</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Punch In</th>
              <th className="p-3 border">Punch Out</th>
              <th className="p-3 border">Punch In Image</th>
              <th className="p-3 border">Punch Out Image</th>
              <th className="p-3 border">In Address</th>
              <th className="p-3 border">Out Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b hover:bg-gray-100 text-gray-800"
                >
                  <td className="p-3 border">{record.emp_name}</td>
                  <td className="p-3 border">{record.supervisor_name}</td>
                  <td className="p-3 border">{record.ward_name}</td>
                  <td className="p-3 border">{record.designation}</td>
                  <td className="p-3 border">{record.date}</td>
                  <td
                    className={`p-3 border font-semibold ${
                      record.status === "present"
                        ? "text-green-500"
                        : record.status === "absent"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {record.status}
                  </td>
                  <td className="p-3 border">{record.punch_in_time || "-"}</td>
                  <td className="p-3 border">{record.punch_out_time || "-"}</td>
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
                  <td className="p-3 border">{record.in_address || "-"}</td>
                  <td className="p-3 border">{record.out_address || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-3 text-center text-gray-500">
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
