import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/users"
      );
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/users/${editUserId}`,
          formData
        );
      } else {
        await axios.post(import.meta.env.VITE_API_URL + "/api/users", formData);
      }
      setFormData({ name: "", email: "", password: "", role: "user" });
      setEditUserId(null);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Error creating/updating user");
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("Error deleting user");
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

  const sortedUsers = [...users].sort((a, b) => {
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

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">User Management</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditUserId(null);
            setFormData({ name: "", email: "", password: "", role: "user" });
            setModalOpen(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
        >
          Create New User
        </button>
      </div>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editUserId ? "Edit User" : "Create New User"}
      >
        <form onSubmit={handleCreateOrUpdate}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required={!editUserId}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium p-2 rounded-lg w-full transition-all"
          >
            {editUserId ? "Update User" : "Create User"}
          </button>
        </form>
      </ModalWrapper>

      <ScrollableTable>
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr className="text-left text-gray-700 font-medium">
            <th className="border p-3">ID</th>
            <SortableTableHeader
              label="Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Email"
              field="email"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Role"
              field="role"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-all">
              <td className="border p-3">{user.id}</td>
              <td className="border p-3">{user.name}</td>
              <td className="border p-3">{user.email}</td>
              <td className="border p-3">{user.role}</td>
              <td className="border p-3">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-all mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this client?")) {
                      handleDelete(user.id);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
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

export default UserManagement;
