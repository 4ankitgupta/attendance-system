import { useState } from "react";

function CreateDepartment() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (departmentName.trim()) {
      setDepartments([
        ...departments,
        { id: departments.length + 1, name: departmentName },
      ]);
      setDepartmentName("");
    }
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((department) => department.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏢 Manage Departments</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="Enter Department Name"
          className="p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
      <ul>
        {departments.map((department) => (
          <li
            key={department.id}
            className="flex justify-between border-b py-2"
          >
            {department.name}
            <button
              onClick={() => handleDelete(department.id)}
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

export default CreateDepartment;
