import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";
import NotificationModal from "./NotificationModal";

function PayReceiptTable() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/signed`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load signed receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReceipts = [...receipts].sort((a, b) => {
    if (!sortField) return 0;

    const getValue = (obj, path) =>
      path.split(".").reduce((o, k) => o?.[k], obj);

    const valA = getValue(a, sortField) || "";
    const valB = getValue(b, sortField) || "";

    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  if (loading) return <p>Loading receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#6e66f3]">Signed Receipts</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#fc875e] text-white px-4 py-2 rounded hover:bg-[#f67a4f]"
        >
          + Send Notification
        </button>
      </div>

      {sortedReceipts.length === 0 ? (
        <p className="text-gray-600">No receipts have been signed yet.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#fc875e] text-white">
            <tr>
              <SortableTableHeader
                label="Employee"
                field="employee.name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Month"
                field="month"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-3 border text-left">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {sortedReceipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-3">{receipt.employee?.name}</td>
                <td className="border p-3">{receipt.month}</td>
                <td className="border p-3">
                  <a
                    href={receipt.signedFileUrl || receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      receipt.signedFileUrl ? "text-green-600" : "text-blue-600"
                    } underline hover:text-blue-800`}
                  >
                    {receipt.signedFileUrl ? "Signed Receipt" : "Original File"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default PayReceiptTable;
