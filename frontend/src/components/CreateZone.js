import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const apiUrl = `${API_BASE_URL}/api/zones`;

function CreateZone() {
  const [zones, setZones] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [editingZone, setEditingZone] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCities();
    fetchZones();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(apiUrl);
      setZones(response.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      if (editingZone) {
        // Update existing zone
        await axios.put(`${apiUrl}/${editingZone.zone_id}`, {
          city_id: selectedCity,
          zone_name: zoneName,
        });
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone.zone_id === editingZone.zone_id
              ? { ...zone, zone_name: zoneName, city_id: selectedCity }
              : zone
          )
        );
      } else {
        // Add new zone
        const response = await axios.post(apiUrl, {
          city_id: selectedCity,
          zone_name: zoneName,
        });
        setZones([...zones, response.data]);
      }

      // Reset form
      resetForm();
      fetchZones(); // Refresh zone list
    } catch (error) {
      if (error.response) {
        const errCode = error.response.data.code;

        if (errCode === "23505") {
          setErrorMessage("⚠️ Zone already exists for this city.");
        } else {
          setErrorMessage("⚠️ Error saving zone. Please try again.");
        }
      } else {
        setErrorMessage("⚠️ Network error. Please check your connection.");
      }
      console.error("Error saving zone:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setZones(zones.filter((zone) => zone.zone_id !== id));
    } catch (error) {
      console.error("Error deleting zone:", error);
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setZoneName(zone.zone_name);
    setSelectedCity(zone.city_id); // Ensure city selection updates correctly
  };

  const resetForm = () => {
    setZoneName("");
    setSelectedCity("");
    setEditingZone(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📍 Manage Zones</h2>

      {/* Error Alert */}
      {errorMessage && <div className="text-red-600 mb-3">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
        {/* City Selection Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 border rounded w-full"
          required
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city.city_id} value={city.city_id}>
              {city.city_name}
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

        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${
              selectedCity && zoneName
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedCity || !zoneName} // Disable if any field is empty
          >
            {editingZone ? "Update Zone" : "Add Zone"}
          </button>
          {editingZone && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Zone Table */}
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">City</th>
            <th className="p-3">Zone</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.zone_id} className="border-b text-center">
              <td className="p-3">{zone.city_name}</td>
              <td className="p-3">{zone.zone_name}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(zone)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(zone.zone_id)}
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

export default CreateZone;
