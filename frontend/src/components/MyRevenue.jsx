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
  const [successMessage, setSuccessMessage] = useState("");  // Estado para el mensaje de éxito

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    status: "pending",
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
        import.meta.env.VITE_API_URL + "/api/revenue/approved",
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
          { ...formData, status: "pending" },
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

      // Mostrar mensaje de éxito después de enviar la revenue
      setSuccessMessage("Se envió la revenue al administrador.");
      setTimeout(() => setSuccessMessage(""), 5000);  // Ocultar mensaje después de 5 segundos
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

  const handleDelete = async (revenueId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_URL + `/api/revenue/${revenueId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRevenue();
    } catch (err) {
      console.error(err);
      setError("Error deleting Revenue");
    }
  };

  if (loading) return <p>Loading revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 rounded-lg bg-[#f3f4f6] shadow-md">
  
      <button
        onClick={() => {
          setEditRevenueId(null);
          setFormData({
            amount: "",
            date: new Date().toISOString().slice(0, 10),
            type: "",
            status: "pending",
          });
          setModalOpen(true);
        }}
       className="mb-4 bg-[#FFA500] text-white px-6 py-3 rounded-lg hover:bg-[#e69500] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-opacity-50 mx-auto block"
      >
        Add Revenue
      </button>
  
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
  
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editRevenueId ? "Edit Revenue" : "Add Revenue"}
      >
        <form onSubmit={handleSubmit}>
          {formError && <p className="text-red-500">{formError}</p>}
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g., daily, weekly"
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600"
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
        <p className="text-gray-700">No revenue records found.</p>
      ) : (
        <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-[#6e66f3] rounded-t-lg text-white">
                <tr>
                  <th className="p-3 text-left rounded-tl-lg">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-center rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRevenue.map((record) => (
                  <tr key={record.id} className="hover:bg-[#e6e6f7]">
                    <td className="p-3 text-gray-800">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-800">${record.amount}</td>
                    <td className="p-3 text-gray-800">{record.type}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default MyRevenue;
