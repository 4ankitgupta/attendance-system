import { useState } from "react";

const supervisors = [
  { id: 1, name: "Alice Brown" },
  { id: 2, name: "Michael Johnson" },
];

const wards = [
  { id: 101, name: "Ward A" },
  { id: 102, name: "Ward B" },
  { id: 103, name: "Ward C" },
];

function AssignSupervisorWard() {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({ supervisorId: "", wardIds: [] });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, wardIds: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.supervisorId && formData.wardIds.length > 0) {
      setAssignments([
        ...assignments,
        { ...formData, id: assignments.length + 1 },
      ]);
      setFormData({ supervisorId: "", wardIds: [] });
    }
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((assign) => assign.id !== id));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">🏥 Assign Supervisor to Wards</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 shadow-md rounded-lg mb-4"
      >
        <div className="mb-2">
          <label className="block font-medium">Select Supervisor</label>
          <select
            name="supervisorId"
            value={formData.supervisorId}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Supervisor --</option>
            {supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Select Wards</label>
          <select
            name="wardIds"
            multiple
            value={formData.wardIds}
            onChange={handleMultiSelectChange}
            className="w-full p-2 border rounded"
            required
          >
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md"
        >
          Assign Wards
        </button>
      </form>

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Supervisor</th>
            <th className="p-3">Assigned Wards</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assign) => (
            <tr key={assign.id} className="border-b">
              <td className="p-3">
                {
                  supervisors.find(
                    (sup) => sup.id === Number(assign.supervisorId)
                  )?.name
                }
              </td>
              <td className="p-3">
                {assign.wardIds
                  .map(
                    (wardId) =>
                      wards.find((ward) => ward.id === Number(wardId))?.name
                  )
                  .join(", ")}
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(assign.id)}
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

export default AssignSupervisorWard;
