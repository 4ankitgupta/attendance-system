import { useState } from "react";

function CreateZone() {
  const [zones, setZones] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Dummy list of cities (replace with API call if needed)
  const cities = [
    { id: 1, name: "New York" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Chicago" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (zoneName.trim() && selectedCity) {
      setZones([
        ...zones,
        { id: zones.length + 1, city: selectedCity, name: zoneName },
      ]);
      setZoneName("");
      setSelectedCity("");
    }
  };

  const handleDelete = (id) => {
    setZones(zones.filter((zone) => zone.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📍 Manage Zones</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
        {/* City Selection Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 border rounded w-full"
          required
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Zone Name Input */}
        <input
          type="text"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          placeholder="Enter Zone Name"
          className="p-2 border rounded w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Zone
        </button>
      </form>

      {/* Zone List */}
      <ul>
        {zones.map((zone) => (
          <li key={zone.id} className="flex justify-between border-b py-2">
            <span>
              🌆 <strong>{zone.city}</strong> - {zone.name}
            </span>
            <button
              onClick={() => handleDelete(zone.id)}
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

export default CreateZone;
