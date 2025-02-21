import { useState } from "react";

const initialSupervisors = [
  {
    id: 1,
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "1234567890",
    role: "supervisor",
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "9876543210",
    role: "admin",
  },
];

function Supervisors() {
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "supervisor",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setSupervisors(
        supervisors.map((sup) => (sup.id === formData.id ? formData : sup))
      );
    } else {
      setSupervisors([
        ...supervisors,
        { ...formData, id: supervisors.length + 1 },
      ]);
    }
    setFormData({ id: "", name: "", email: "", phone: "", role: "supervisor" });
    setIsEditing(false);
  };

  const handleEdit = (sup) => {
    setFormData(sup);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setSupervisors(supervisors.filter((sup) => sup.id !== id));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">🧑‍🏫 Supervisor Management</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 shadow-md rounded-lg mb-4"
      >
        {isEditing && (
          <div className="mb-2">
            <label className="block font-medium">User ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        )}
        <div className="mb-2">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md"
        >
          {isEditing ? "Update Supervisor" : "Add Supervisor"}
        </button>
      </form>

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {supervisors.map((sup) => (
            <tr key={sup.id} className="border-b">
              <td className="p-3">{sup.name}</td>
              <td className="p-3">{sup.email}</td>
              <td className="p-3">{sup.phone}</td>
              <td className="p-3">{sup.role}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(sup)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(sup.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Supervisors;
