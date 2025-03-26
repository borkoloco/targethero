import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";

function UserListWithClients() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [clientsByUser, setClientsByUser] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const fetchClientsForUser = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/clients?assignedTo=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientsByUser((prev) => ({ ...prev, [userId]: response.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleClients = async (user) => {
    setSelectedUser(user);
    await fetchClientsForUser(user.id);
    setModalOpen(true);
  };

  const handleClientDelete = async (clientId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/clients/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchClientsForUser(selectedUser.id);
    } catch (err) {
      console.error("Error deleting client:", err);
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

  const getSortedClients = () => {
    const clients = clientsByUser[selectedUser?.id] || [];
    if (!sortField) return clients;
    return [...clients].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management with Clients</h2>
      {users.map((user) => (
        <div key={user.id} className="border p-4 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm">Email: {user.email}</p>
              <p className="text-sm">Points: {user.points}</p>
            </div>
            <button
              onClick={() => toggleClients(user)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Show Clients
            </button>
          </div>
        </div>
      ))}

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Clients for ${selectedUser?.name}`}
      >
        {getSortedClients().length > 0 ? (
          <ScrollableTable>
            <thead className="sticky top-0 bg-gray-200">
              <tr>
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
              {getSortedClients().map((client) => (
                <tr key={client.id}>
                  <td className="border p-2">{client.name}</td>
                  <td className="border p-2">{client.contactEmail}</td>
                  <td className="border p-2">{client.contactPhone}</td>
                  <td className="border p-2">{client.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this client?"
                          )
                        ) {
                          handleClientDelete(client.id);
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </ScrollableTable>
        ) : (
          <p className="text-center text-gray-600 p-4">
            This user has no clients yet.
          </p>
        )}
      </ModalWrapper>
    </div>
  );
}

export default UserListWithClients;
