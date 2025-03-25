import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";
import ModalWrapper from "./ModalWrapper";

function MyClients() {
  const { token, user } = useSelector((state) => state.auth);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    status: "prospect",
    notes: "",
  });
  const [editClientId, setEditClientId] = useState(null);

  const fetchMyClients = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/clients/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClients(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClients();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientData = { ...formData, assignedTo: user.id };

      if (editClientId) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/clients/${editClientId}`,
          clientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          import.meta.env.VITE_API_URL + "/api/clients",
          clientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setFormData({
        name: "",
        contactEmail: "",
        contactPhone: "",
        status: "prospect",
        notes: "",
      });
      setEditClientId(null);
      setModalOpen(false);
      fetchMyClients();
    } catch (err) {
      console.error(err);
      setError("Error creating/updating client");
    }
  };

  const handleEdit = (client) => {
    setEditClientId(client.id);
    setFormData({
      name: client.name,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      status: client.status,
      notes: client.notes,
    });
    setModalOpen(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/clients/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyClients();
    } catch (err) {
      console.error(err);
      setError("Error deleting client");
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

  const sortedClients = [...clients].sort((a, b) => {
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

  if (loading) return <p>Loading my clients...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">My Clients</h3>

      <button
        onClick={() => {
          setEditClientId(null);
          setFormData({
            name: "",
            contactEmail: "",
            contactPhone: "",
            status: "prospect",
            notes: "",
          });
          setModalOpen(true);
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Client
      </button>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editClientId ? "Edit Client" : "Add Client"}
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
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Phone:</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="border p-1 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            {editClientId ? "Update Client" : "Add Client"}
          </button>
        </form>
      </ModalWrapper>

      {clients.length === 0 ? (
        <p>No clients assigned yet.</p>
      ) : (
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
                label="Email"
                field="contactEmail"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="border p-2">Phone</th>
              <SortableTableHeader
                label="Status"
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedClients.map((client) => (
              <tr key={client.id}>
                <td className="border p-2">{client.id}</td>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.contactEmail}</td>
                <td className="border p-2">{client.contactPhone}</td>
                <td className="border p-2">{client.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default MyClients;
