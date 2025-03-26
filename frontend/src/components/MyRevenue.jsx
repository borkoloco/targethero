import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";

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
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRevenueId, setEditRevenueId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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
      if (editRevenueId) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/revenue/${editRevenueId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          import.meta.env.VITE_API_URL + "/api/revenue/my",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setFormData({
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        type: "",
      });
      setEditRevenueId(null);
      setModalOpen(false);
      fetchRevenue();
    } catch (err) {
      setFormError(err.response?.data?.error || "Error saving revenue");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditRevenueId(record.id);
    setFormData({
      amount: record.amount,
      date: record.date.slice(0, 10),
      type: record.type,
    });
    setModalOpen(true);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRevenue = [...revenue].sort((a, b) => {
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

  if (loading) return <p>Loading revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">My Revenue</h3>

      <button
        onClick={() => {
          setEditRevenueId(null);
          setFormData({
            amount: "",
            date: new Date().toISOString().slice(0, 10),
            type: "",
          });
          setModalOpen(true);
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Revenue
      </button>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editRevenueId ? "Edit Revenue" : "Add Revenue"}
      >
        <form onSubmit={handleSubmit}>
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
            {formLoading
              ? "Submitting..."
              : editRevenueId
              ? "Update Revenue"
              : "Add Revenue"}
          </button>
        </form>
      </ModalWrapper>

      {revenue.length === 0 ? (
        <p>No revenue records found.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
              <th className="border p-2">Date</th>
              <SortableTableHeader
                label="Amount"
                field="amount"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Type"
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRevenue.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">${record.amount}</td>
                <td className="border p-2">{record.type}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
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

export default MyRevenue;
