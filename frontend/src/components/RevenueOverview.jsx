import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRevenue,
  fetchAllRevenue,
  deleteRevenue,
} from "../redux/slices/revenueSlice";
import ScrollableTable from "./ScrollableTable";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";

function RevenueOverview() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { all: records, status, error } = useSelector((state) => state.revenue);
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

  const sortedRecords = [...records].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
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
    await dispatch(deleteRevenue(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateRevenue({ id: editRecord.id, revenueData: formData }));
    setEditRecord(null);
    setModalOpen(false);
  };

  const handleApprove = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/revenue/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchAllRevenue());
  };

  if (status === "loading") return <p>Loading revenue overview...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-[#6e66f3] mb-4 drop-shadow">
        Revenue Overview
      </h3>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Revenue"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Type:</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded w-full"
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
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <SortableTableHeader
                label="Type"
                field="type"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{record.user?.name}</td>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">${record.amount}</td>
                <td className="border p-2">{record.type}</td>
                <td className="border p-2 capitalize">{record.status}</td>
                <td className="border p-2 space-x-2">
                  {record.status === "pending" ? (
                    <button
                      onClick={() => handleApprove(record.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(record)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mr-2 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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
