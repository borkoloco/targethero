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
    status:"pending"
  });
  const [editClientId, setEditClientId] = useState(null);

  const fetchMyClients = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/clients/approved",
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
    <div className="mt-4 p-4 rounded-lg bg-[#f3f4f6] shadow-md">
  
      <button
        onClick={() => {
          setEditClientId(null);
          setFormData({
            name: "",
            contactEmail: "",
            contactPhone: "",
            status: "prospect",
            notes: "",
            estado: "pending"
          });
          setModalOpen(true);
        }}
        className="mb-4 bg-[#FFA500] text-white px-6 py-3 rounded-lg hover:bg-[#e69500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-50 mx-auto block"

      >
        Add Client
      </button>
  
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editClientId ? "Edit Client" : "Add Client"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Email:</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Phone:</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600"
          >
            {editClientId ? "Update Client" : "Add Client"}
          </button>
        </form>
      </ModalWrapper>
  
      {clients.length === 0 ? (
        <p className="text-gray-700">No clients assigned yet.</p>
      ) : (
        <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-[#6e66f3] rounded-t-lg text-white">
                <tr>
                  <th className="p-3 text-left rounded-tl-lg">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Phone</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#e6e6f7]">
                    <td className="p-3 text-gray-800">{client.id}</td>
                    <td className="p-3 text-gray-800">{client.name}</td>
                    <td className="p-3 text-gray-800">{client.contactEmail}</td>
                    <td className="p-3 text-gray-800">{client.contactPhone}</td>
                    <td className="p-3 text-gray-800">{client.status}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyClients;
