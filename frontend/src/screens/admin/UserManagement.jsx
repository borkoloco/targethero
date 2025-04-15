import { useEffect, useState } from "react";
import axios from "axios";
<<<<<<<< HEAD:frontend/src/components/Users/UserManagement.jsx
import ScrollableTable from "../SortableTable/ScrollableTable";
import ModalWrapper from "../Modal/ModalWrapper";
import SortableTableHeader from "../SortableTable/SortableTableHeader";
========
import ScrollableTable from "../../components/common/ScrollableTable";
import ModalWrapper from "../../components/common/ModalWrapper";
import SortableTableHeader from "../../components/common/SortableTableHeader";
>>>>>>>> d78a76c85fc6a3b61591cd248d296dbf2019b4c9:frontend/src/screens/admin/UserManagement.jsx

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
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans mb-8">
      <h2 className="text-3xl font-extrabold text-[#6e66f3] mb-6 drop-shadow">
        User Management
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditUserId(null);
            setFormData({ name: "", email: "", password: "", role: "user" });
            setModalOpen(true);
          }}
          className="bg-[#6e66f3] hover:bg-[#574ed1] text-white px-4 py-2 rounded-xl transition duration-200"
        >
          + Create New User
        </button>
      </div>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editUserId ? "Edit User" : "Create New User"}
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required={!editUserId}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full transition"
          >
            {editUserId ? "Update User" : "Create User"}
          </button>
        </form>
      </ModalWrapper>

      <ScrollableTable>
        <thead className="sticky top-0 bg-[#fc875e]  z-10">
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
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2 capitalize">{user.role}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-[#6e66f3] hover:bg-[#5a55d1] text-white px-3 py-1 rounded-xl text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this user?")) {
                      handleDelete(user.id);
                    }
                  }}
                  className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-3 py-1 rounded-xl text-sm"
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
