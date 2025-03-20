import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchMissions } from "../redux/slices/missionsSlice";

function MissionManagement() {
  const dispatch = useDispatch();
  const { missions, status, error } = useSelector((state) => state.missions);

  const [formData, setFormData] = useState({
    name: "",
    type: "aleatoria",
    description: "",
    points: 0,
    evidenceRequired: false,
  });
  const [editMissionId, setEditMissionId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting mission with data:", formData);
    try {
      if (editMissionId) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/missions/${editMissionId}`,
          formData
        );
      } else {
        await axios.post(
          import.meta.env.VITE_API_URL + "/api/missions",
          formData
        );
      }
      setFormData({
        name: "",
        type: "diaria",
        description: "",
        points: 0,
        evidenceRequired: false,
      });
      setEditMissionId(null);
      dispatch(fetchMissions());
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (mission) => {
    setEditMissionId(mission.id);
    setFormData({
      name: mission.name,
      type: mission.type,
      description: mission.description,
      points: mission.points,
      evidenceRequired: mission.evidenceRequired,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/missions/${id}`);
      const currentScroll = window.pageYOffset;
      dispatch(fetchMissions()).then(() => {
        setTimeout(() => window.scrollTo(0, currentScroll), 0);
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mission Management</h2>
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold mb-2">
          {editMissionId ? "Edit Mission" : "Create New Mission"}
        </h3>

        <div className="mb-2">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="aleatoria">Aleatoria</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="bonus">Bonus Track</option>
            <option value="diaria">Diaria</option>
            {/* diaria no se si va */}
          </select>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Points:</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="evidenceRequired"
              checked={formData.evidenceRequired}
              onChange={handleChange}
              className="mr-2"
            />
            Require Evidence
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {editMissionId ? "Update Mission" : "Create Mission"}
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Points</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr key={mission.id}>
              <td className="border p-2">{mission.id}</td>
              <td className="border p-2">{mission.name}</td>
              <td className="border p-2">{mission.type}</td>
              <td className="border p-2">{mission.description}</td>
              <td className="border p-2">{mission.points}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(mission)}
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mission.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MissionManagement;
