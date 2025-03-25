import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchMissions } from "../redux/slices/missionsSlice";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";
import BulkImportForm from "./BulkImportForm";

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
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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
      setModalOpen(false);
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
    setModalOpen(true);
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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedMissions = [...missions].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    } else {
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Mission Management</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <BulkImportForm type="missions" />
          <button
            onClick={() => {
              setEditMissionId(null);
              setFormData({
                name: "",
                type: "aleatoria",
                description: "",
                points: 0,
                evidenceRequired: false,
              });
              setModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create New Mission
          </button>
        </div>
      </div>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editMissionId ? "Edit Mission" : "Create New Mission"}
      >
        <form onSubmit={handleSubmit}>
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
      </ModalWrapper>

      <ScrollableTable>
        <thead className="sticky top-0 bg-gray-200 z-10">
          <tr>
            <th className="border p-2">ID</th>
            <SortableTableHeader
              label="Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Type"
              field="type"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Description</th>
            <SortableTableHeader
              label="Points"
              field="points"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMissions.map((mission) => (
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
      </ScrollableTable>
    </div>
  );
}

export default MissionManagement;
