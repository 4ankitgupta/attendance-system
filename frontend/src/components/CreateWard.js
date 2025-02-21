import { useState } from "react";

function CreateWard() {
  const [wards, setWards] = useState([]);
  const [wardName, setWardName] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  // Dummy list of zones (Replace with API data if needed)
  const zones = [
    { id: 1, name: "North Zone" },
    { id: 2, name: "South Zone" },
    { id: 3, name: "East Zone" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (wardName.trim() && selectedZone) {
      setWards([
        ...wards,
        { id: wards.length + 1, zone: selectedZone, name: wardName },
      ]);
      setWardName("");
      setSelectedZone("");
    }
  };

  const handleDelete = (id) => {
    setWards(wards.filter((ward) => ward.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏘️ Manage Wards</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
        {/* Zone Selection Dropdown */}
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">Select Zone</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.name}>
              {zone.name}
            </option>
          ))}
        </select>

        {/* Ward Name Input */}
        <input
          type="text"
          value={wardName}
          onChange={(e) => setWardName(e.target.value)}
          placeholder="Enter Ward Name"
          className="p-2 border rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Ward
        </button>
      </form>

      {/* Ward List */}
      <ul>
        {wards.map((ward) => (
          <li key={ward.id} className="flex justify-between border-b py-2">
            <span>
              🏙️ <strong>{ward.zone}</strong> - {ward.name}
            </span>
            <button
              onClick={() => handleDelete(ward.id)}
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

export default CreateWard;
