import { useState } from "react";

function CreateCity() {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim()) {
      setCities([...cities, { id: cities.length + 1, name: cityName }]);
      setCityName("");
    }
  };

  const handleDelete = (id) => {
    setCities(cities.filter((city) => city.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏙️ Manage Cities</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter City Name"
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
        {cities.map((city) => (
          <li key={city.id} className="flex justify-between border-b py-2">
            {city.name}
            <button
              onClick={() => handleDelete(city.id)}
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

export default CreateCity;
