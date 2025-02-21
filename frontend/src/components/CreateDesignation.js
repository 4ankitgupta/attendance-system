import { useState } from "react";

function CreateDesignation() {
  const [designations, setDesignations] = useState([]);
  const [designationName, setDesignationName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Dummy list of departments (replace with API call if needed)
  const departments = [
    { id: 1, name: "Human Resources" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Marketing" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (designationName.trim() && selectedDepartment) {
      setDesignations([
        ...designations,
        {
          id: designations.length + 1,
          department: selectedDepartment,
          name: designationName,
        },
      ]);
      setDesignationName("");
      setSelectedDepartment("");
    }
  };

  const handleDelete = (id) => {
    setDesignations(
      designations.filter((designation) => designation.id !== id)
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏢 Manage Designations</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
        {/* Department Selection Dropdown */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Designation Name Input */}
        <input
          type="text"
          value={designationName}
          onChange={(e) => setDesignationName(e.target.value)}
          placeholder="Enter Designation Name"
          className="p-2 border rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Designation
        </button>
      </form>

      {/* Designation List */}
      <ul>
        {designations.map((designation) => (
          <li
            key={designation.id}
            className="flex justify-between border-b py-2"
          >
            <span>
              🏛️ <strong>{designation.department}</strong> - {designation.name}
            </span>
            <button
              onClick={() => handleDelete(designation.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateDesignation;
