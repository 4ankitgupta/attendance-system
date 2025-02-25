import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const apiUrl = `${API_BASE_URL}/api/wards`;

function CreateWard() {
  const [wards, setWards] = useState([]);
  const [wardName, setWardName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [zones, setZones] = useState([]);
  const [editingWard, setEditingWard] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchZones();
    fetchWards();
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/zones`);
      setZones(response.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchWards = async () => {
    try {
      const response = await axios.get(apiUrl);
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (editingWard) {
        await axios.put(`${apiUrl}/${editingWard.ward_id}`, {
          zone_id: selectedZone,
          ward_name: wardName,
        });
        setWards((prevWards) =>
          prevWards.map((ward) =>
            ward.ward_id === editingWard.ward_id
              ? { ...ward, ward_name: wardName, zone_id: selectedZone }
              : ward
          )
        );
      } else {
        const response = await axios.post(apiUrl, {
          zone_id: selectedZone,
          ward_name: wardName,
        });
        setWards([...wards, response.data]);
      }
      resetForm();
      fetchWards();
    } catch (error) {
      if (error.response) {
        const errCode = error.response.data.code;
        setErrorMessage(
          errCode === "23505"
            ? "⚠️ Ward already exists in this zone."
            : "⚠️ Error saving ward. Please try again."
        );
      } else {
        setErrorMessage("⚠️ Network error. Please check your connection.");
      }
      console.error("Error saving ward:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setWards(wards.filter((ward) => ward.ward_id !== id));
    } catch (error) {
      console.error("Error deleting ward:", error);
    }
  };

  const handleEdit = (ward) => {
    setEditingWard(ward);
    setWardName(ward.ward_name);
    setSelectedZone(ward.zone_id);

    const zone = zones.find((z) => z.zone_id === ward.zone_id);
    if (zone) {
      setSelectedCity(zone.city_id.toString());
    }
  };
  const resetForm = () => {
    setWardName("");
    setSelectedZone("");
    setEditingWard(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏘️ Manage Wards</h2>

      {errorMessage && <div className="text-red-600 mb-3">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3">
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

        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="p-2 border rounded w-full"
          required
          disabled={!selectedCity} // Disable if no city is selected
        >
          <option value="" disabled>
            Select Zone
          </option>
          {zones
            .filter((zone) => zone.city_id === parseInt(selectedCity)) // Filter zones for selected city
            .map((zone) => (
              <option key={zone.zone_id} value={zone.zone_id}>
                {zone.zone_name}
              </option>
            ))}
        </select>

        <input
          type="text"
          value={wardName}
          onChange={(e) => setWardName(e.target.value)}
          placeholder="Enter Ward Name"
          className="p-2 border rounded w-full"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 rounded ${
              selectedCity && selectedZone && wardName
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!selectedCity || !selectedZone || !wardName} // Disable if any field is empty
          >
            {editingWard ? "Update Ward" : "Add Ward"}
          </button>
          {editingWard && (
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

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">City</th>
            <th className="p-3">Zone</th>
            <th className="p-3">Ward</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wards.map((ward) => (
            <tr key={ward.ward_id} className="border-b text-center">
              <td className="p-3">{ward.city_name || "N/A"}</td>
              <td className="p-3">{ward.zone_name || "Unknown Zone"}</td>
              <td className="p-3">{ward.ward_name}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEdit(ward)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(ward.ward_id)}
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

export default CreateWard;
