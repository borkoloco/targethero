import { useEffect, useState } from "react";
import axios from "axios";

function RevenueManagement() {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    total: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [editRevenueId, setEditRevenueId] = useState(null);

  const fetchRevenues = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/revenues"
      );
      setRevenues(response.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching revenues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editRevenueId) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/revenues/${editRevenueId}`,
          formData
        );
      } else {
        await axios.post(
          import.meta.env.VITE_API_URL + "/api/revenues",
          formData
        );
      }
      setFormData({
        userId: "",
        total: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setEditRevenueId(null);
      fetchRevenues();
    } catch (err) {
      console.error(err);
      setError("Error creating/updating revenue");
    }
  };

  const handleEdit = (revenue) => {
    setEditRevenueId(revenue.id);
    setFormData({
      userId: revenue.userId,
      total: revenue.total,
      date: revenue.date,
    });
  };

  const handleDelete = async (revenueId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/revenues/${revenueId}`
      );
      fetchRevenues();
    } catch (err) {
      console.error(err);
      setError("Error deleting revenue");
    }
  };

  if (loading) return <p>Loading revenues...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue Management</h2>
      <form onSubmit={handleCreateOrUpdate} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold mb-2">
          {editRevenueId ? "Edit Revenue" : "Create New Revenue"}
        </h3>
        <div className="mb-2">
          <label className="block mb-1">User ID:</label>
          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Total:</label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {editRevenueId ? "Update Revenue" : "Create Revenue"}
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {revenues.map((revenue) => (
            <tr key={revenue.id}>
              <td className="border p-2">{revenue.id}</td>
              <td className="border p-2">{revenue.userId}</td>
              <td className="border p-2">{revenue.total}</td>
              <td className="border p-2">
                {new Date(revenue.date).toLocaleDateString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(revenue)}
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(revenue.id)}
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

export default RevenueManagement;
