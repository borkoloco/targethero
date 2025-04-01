import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRevenue,
  createRevenue,
  updateRevenue,
} from "../redux/slices/revenueSlice";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";

function MyRevenue() {
  const dispatch = useDispatch();
  const {
    all: allRevenue,
    status,
    error,
  } = useSelector((state) => state.revenue);
  const user = useSelector((state) => state.auth.user);
  const revenue = allRevenue.filter((r) => r.userId === user.id);

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

  useEffect(() => {
    dispatch(fetchAllRevenue());
  }, [dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRevenue = [...revenue].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      if (editRevenueId) {
        await dispatch(
          updateRevenue({
            id: editRevenueId,
            revenueData: { ...formData, status: "pending" },
          })
        );
      } else {
        await dispatch(createRevenue(formData));
      }
      setEditRevenueId(null);
      setFormData({
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        type: "",
      });
      setModalOpen(false);
    } catch {
      setFormError("Failed to save revenue");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (record) => {
    if (record.status === "pending") return;
    setEditRevenueId(record.id);
    setFormData({
      amount: record.amount,
      date: record.date.slice(0, 10),
      type: record.type,
    });
    setModalOpen(true);
  };

  if (status === "loading") return <p>Loading revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-6">
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
          className="bg-[#6e66f3] hover:bg-[#574ed1] text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          + Add Revenue
        </button>
      </div>
  
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editRevenueId ? "Edit Revenue" : "Add Revenue"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <p className="text-red-500">{formError}</p>}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6e66f3]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6e66f3]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6e66f3]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-all shadow-md"
            disabled={formLoading}
          >
            {formLoading ? "Submitting..." : editRevenueId ? "Update Revenue" : "Add Revenue"}
          </button>
        </form>
      </ModalWrapper>
  
      {revenue.length === 0 ? (
        <p className="text-gray-500 mt-6 text-center">No revenue records found.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-[#fc875e] z-10 shadow-sm">
            <tr className="text-white">
              <th className="border p-3">Date</th>
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
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRevenue.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-3 text-green-600 font-medium">${record.amount}</td>
                <td className="border p-3 text-gray-700">{record.type}</td>
                <td className="border p-3 capitalize text-gray-700">{record.status}</td>
                <td className="border p-3">
                  <button
                    disabled={record.status === "pending"}
                    onClick={() => handleEdit(record)}
                    className={`${
                      record.status === "pending"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#6e66f3] hover:bg-[#574ed1]"
                    } text-white px-4 py-2 rounded-xl transition-all font-medium`}
                  >
                    {record.status === "pending" ? "Pending" : "Edit"}
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
