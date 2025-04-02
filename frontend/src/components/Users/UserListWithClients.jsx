import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollableTable from "../SortableTable/ScrollableTable";
import SortableTableHeader from "../SortableTable/SortableTableHeader";
import ModalWrapper from "../Modal/ModalWrapper";
import {
  fetchClients,
  deleteClient,
  updateClient,
} from "../../redux/slices/clientsSlice";

function UserListWithClients() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const clients = useSelector((state) => state.clients.list);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (token) dispatch(fetchClients());
  }, [dispatch, token]);

  const refreshClients = () => dispatch(fetchClients());

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClient(id)).then(refreshClients);
    }
  };

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      notes: client.notes || "",
      status: client.status,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      updateClient({ id: selectedClient.id, clientData: formData })
    );
    setEditModalOpen(false);
    refreshClients();
  };

  const handleApproveStatus = async (client) => {
    if (!client.requestedStatus || client.requestedStatus === client.status)
      return;
    await dispatch(
      updateClient({
        id: client.id,
        clientData: { status: client.requestedStatus, requestedStatus: null },
      })
    );
    refreshClients();
  };

  return (
    <div className="mt-4 bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-[#6e66f3] drop-shadow">
        Client Management
      </h2>
      <ScrollableTable>
        <thead className="sticky top-0 bg-gray-200 z-10">
          <tr>
            <SortableTableHeader
              label="Name"
              field="name"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Email"
              field="contactEmail"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <th className="border p-2">Phone</th>
            <SortableTableHeader
              label="Status"
              field="status"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <th className="border p-2">Requested</th>
            <SortableTableHeader
              label="Creator"
              field="manager.name"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50 transition">
              <td className="border p-2">{client.name}</td>
              <td className="border p-2">{client.contactEmail}</td>
              <td className="border p-2">{client.contactPhone}</td>
              <td className="border p-2 capitalize">{client.status}</td>
              <td className="border p-2 text-center capitalize">
                {client.requestedStatus &&
                client.requestedStatus !== client.status ? (
                  <button
                    onClick={() => handleApproveStatus(client)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Approve {client.requestedStatus}
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="border p-2">{client.manager?.name || "-"}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEditClick(client)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <ModalWrapper
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Client"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail || ""}
            onChange={(e) =>
              setFormData({ ...formData, contactEmail: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone || ""}
            onChange={(e) =>
              setFormData({ ...formData, contactPhone: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Phone"
          />
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="Notes"
          />
          <select
            value={formData.status || "pending"}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Save Changes
          </button>
        </form>
      </ModalWrapper>
    </div>
  );
}

export default UserListWithClients;