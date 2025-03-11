import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function UserListWithClients() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [clientsByUser, setClientsByUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        `http://localhost:4000/api/clients?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientsByUser((prev) => ({ ...prev, [userId]: response.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleClients = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      fetchClientsForUser(userId);
    }
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
              onClick={() => toggleClients(user.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {expandedUserId === user.id ? "Hide Clients" : "Show Clients"}
            </button>
          </div>
          {expandedUserId === user.id && clientsByUser[user.id] && (
            <div className="mt-2">
              <h3 className="font-semibold">Clients for {user.name}:</h3>
              {clientsByUser[user.id].length === 0 ? (
                <p>No clients assigned.</p>
              ) : (
                <ul>
                  {clientsByUser[user.id].map((client) => (
                    <li key={client.id} className="ml-4">
                      {client.name} ({client.contactEmail})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserListWithClients;
