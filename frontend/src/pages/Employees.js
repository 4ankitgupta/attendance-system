import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const apiUrl = `${API_BASE_URL}/api/employees`;

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    emp_id: "",
    name: "",
    emp_code: "",
    phone: "",
    ward_id: "",
    designation_id: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetLable = () => {
    // Reset the newEmployee object to its default values
    setNewEmployee({
      emp_id: "",
      name: "",
      emp_code: "",
      phone: "",
      ward_id: "",
      designation_id: "",
    });
    // Reset editingEmployee to null so that the Add Employee button appears
    setEditingEmployee(null);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(apiUrl);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const addOrUpdateEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.emp_code.trim()) return;

    try {
      if (editingEmployee) {
        // Update existing employee
        await axios.put(`${apiUrl}/${newEmployee.emp_id}`, newEmployee);
      } else {
        // Add new employee
        await axios.post(apiUrl, newEmployee);
      }
      fetchEmployees(); // Refresh the employee list
      setNewEmployee({
        emp_id: "",
        name: "",
        emp_code: "",
        phone: "",
        ward_id: "",
        designation_id: "",
      });
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const deleteEmployee = async (emp_id) => {
    try {
      await axios.delete(`${apiUrl}/${emp_id}`);
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const editEmployee = (emp) => {
    setNewEmployee(emp);
    setEditingEmployee(emp.emp_id);
  };

  // Static dropdown values (replace with API call later)
  const wards = [
    { id: 1, name: "Ward 1" },
    { id: 2, name: "Ward 2" },
  ];

  const designations = [
    { id: 1, name: "Nurse" },
    { id: 2, name: "Doctor" },
    { id: 3, name: "Technician" },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">👨‍💼 Employee Management</h1>

      {/* Employee Form */}
      <div className="border p-4 mb-4 bg-gray-100 rounded">
        <label className="block mb-2">Employee ID (Auto-generated)</label>
        <input
          type="text"
          value={newEmployee.emp_id}
          disabled
          className="border p-2 w-full rounded bg-gray-200"
        />

        <label className="block mt-2">Name</label>
        <input
          type="text"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <label className="block mt-2">Emp Code</label>
        <input
          type="text"
          value={newEmployee.emp_code}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, emp_code: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        <label className="block mt-2">Phone</label>
        <input
          type="text"
          value={newEmployee.phone}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, phone: e.target.value })
          }
          className="border p-2 w-full rounded"
        />

        {/* Ward Dropdown */}
        <label className="block mt-2">Ward</label>
        <select
          value={newEmployee.ward_id}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, ward_id: Number(e.target.value) })
          }
          className="border p-2 w-full rounded"
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>

        {/* Designation Dropdown */}
        <label className="block mt-2">Designation</label>
        <select
          value={newEmployee.designation_id}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              designation_id: Number(e.target.value),
            })
          }
          className="border p-2 w-full rounded"
        >
          <option value="">Select Designation</option>
          {designations.map((desig) => (
            <option key={desig.id} value={desig.id}>
              {desig.name}
            </option>
          ))}
        </select>

        <button
          onClick={addOrUpdateEmployee}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md mt-4 mr-4"
        >
          {editingEmployee ? "Update Employee" : "➕ Add Employee"}
        </button>
        <button
          onClick={resetLable}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md mt-4"
        >
          Reset
        </button>
      </div>

      {/* Employee Table */}
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Emp Code</th>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Ward</th>
            <th className="p-3">Designation</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.emp_id} className="border-b">
              <td className="p-3">{emp.emp_code}</td>
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.phone}</td>
              <td className="p-3">
                {wards.find((w) => w.id === emp.ward_id)?.name || "Unknown"}
              </td>
              <td className="p-3">
                {designations.find((d) => d.id === emp.designation_id)?.name ||
                  "Unknown"}
              </td>
              <td className="p-3">
                <button
                  onClick={() => editEmployee(emp)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteEmployee(emp.emp_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
