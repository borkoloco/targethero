import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyClients,
  createClient,
  updateClient,
  deleteClient,
} from "../redux/slices/clientsSlice";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";
import ModalWrapper from "./ModalWrapper";

function MyClients() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const myClients = useSelector((state) => state.clients.myList || []);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    requestedStatus: "prospect",
    notes: "",
  });
  const [editClientId, setEditClientId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyClients()).then(() => setLoading(false));
  }, [dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedClients = [...myClients].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      notes: formData.notes,
      assignedTo: user.id,
      status: formData.requestedStatus,
    };

    if (editClientId) {
      dispatch(updateClient({ id: editClientId, clientData: data }));
    } else {
      dispatch(createClient(data));
    }

    resetForm();
  };

  const handleEdit = (client) => {
    if (client.status === "pending") return;
    setEditClientId(client.id);
    setFormData({
      name: client.name,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      requestedStatus: client.requestedStatus || client.status,
      notes: client.notes,
    });
    setModalOpen(true);
  };

  const handleDelete = (clientId) => {
    dispatch(deleteClient(clientId));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contactEmail: "",
      contactPhone: "",
      requestedStatus: "prospect",
      notes: "",
    });
    setEditClientId(null);
    setModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-[#6e66f3]">My Clients</h3>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-[#6e66f3] hover:bg-[#574ed1] text-white px-4 py-2 rounded-xl transition"
        >
          Add Client
        </button>
      </div>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editClientId ? "Edit Client" : "Add Client"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "contactEmail", "contactPhone", "notes"].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize font-semibold">
                {field === "contactEmail"
                  ? "Email"
                  : field === "contactPhone"
                  ? "Phone"
                  : field}
                :
              </label>
              {field === "notes" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <input
                  type={field === "contactEmail" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required={field === "name"}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block mb-1 font-semibold">
              Requested Status:
            </label>
            <select
              name="requestedStatus"
              value={formData.requestedStatus}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
          >
            {editClientId ? "Update Client" : "Add Client"}
          </button>
        </form>
      </ModalWrapper>

      {myClients.length === 0 ? (
        <p className="text-gray-500 mt-4">No clients assigned yet.</p>
      ) : (
        <ScrollableTable>
          <thead className="bg-[#fc875e] sticky top-0 z-10">
            <tr className="text-white">
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
              <tr key={client.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{client.id}</td>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.contactEmail}</td>
                <td className="border p-2">{client.contactPhone}</td>
                <td className="border p-2 capitalize">{client.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    disabled={client.status === "pending"}
                    onClick={() => handleEdit(client)}
                    className={`${
                      client.status === "pending"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#6e66f3] hover:bg-[#574ed1]"
                    } text-white px-3 py-1 rounded-xl transition`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl transition"
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
