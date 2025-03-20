import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function MyRevenue() {
  const { token } = useSelector((state) => state.auth);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/revenue/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRevenue(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching revenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/revenue/my",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        type: "",
      });
      fetchRevenue();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error creating revenue");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p>Loading revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">My Revenue</h3>

      {/* Revenue Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Add New Revenue</h4>
        {formError && <p className="text-red-500">{formError}</p>}
        <div className="mb-2">
          <label className="block mb-1">Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
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
        <div className="mb-2">
          <label className="block mb-1">Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., daily, weekly"
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
          disabled={formLoading}
        >
          {formLoading ? "Submitting..." : "Add Revenue"}
        </button>
      </form>

      {/* Revenue Records Table */}
      {revenue.length === 0 ? (
        <p>No revenue records found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {revenue.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">${record.amount}</td>
                <td className="border p-2">{record.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyRevenue;
