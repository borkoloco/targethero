import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";
import ModalWrapper from "./ModalWrapper";

function RevenueOverview() {
  const { token } = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formData, setFormData] = useState({
    userId: null,
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
  });

  useEffect(() => {
    const fetchRevenueByUser = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/revenue",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching revenue");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueByUser();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
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

  const handleEdit = (record) => {
    setEditRecord(record);
    setFormData({
      userId: record.userId,
      amount: record.amount,
      date: record.date.slice(0, 10),
      type: record.type,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/revenue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/revenue/${editRecord.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditRecord(null);
      setModalOpen(false);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/revenue",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecords(response.data);
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  if (loading) return <p>Loading revenue overview...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Revenue"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="border p-1 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Update Revenue
          </button>
        </form>
      </ModalWrapper>

      {records.length === 0 ? (
        <p>No revenue records found.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
              <th className="border p-2">User</th>
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
            {sortedRecords.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.user?.name}</td>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">${record.amount}</td>
                <td className="border p-2">{record.type}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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

export default RevenueOverview;
