import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";
import SignaturePadModal from "./SignaturePadModal";

function PayReceiptList() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/my-receipts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load pay receipts");
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
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleOpenSignModal = (receipt) => {
    setSelectedReceipt(receipt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setModalOpen(false);
  };

  const handleSign = async (signatureDataUrl) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${
          selectedReceipt.id
        }/sign`,
        { signature: signatureDataUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReceipts();
    } catch (err) {
      console.error("Failed to sign receipt", err);
    }
  };

  if (loading) return <p>Loading pay receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 font-sans">
      <h3 className="text-xl font-bold text-[#6e66f3] mb-4">My Pay Receipts</h3>

      {receipts.length === 0 ? (
        <p className="text-gray-600">No pay receipts available.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#fc875e] text-white">
            <tr>
              <SortableTableHeader
                label="Month"
                field="month"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReceipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-2">{receipt.month}</td>
                <td className="border p-2">
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                </td>
                <td className="border p-2 capitalize">
                  {receipt.signatureStatus === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {receipt.signatureStatus === "awaiting_admin_approval" && (
                    <span className="text-purple-600">
                      Awaiting admin approval
                    </span>
                  )}

                  {receipt.signatureStatus === "awaiting_approval" && (
                    <span className="text-yellow-600">Awaiting approval</span>
                  )}
                  {receipt.signatureStatus === "unsigned" && (
                    <span className="text-gray-500">Unsigned</span>
                  )}
                </td>
                <td className="border p-2">
                  {receipt.signatureStatus === "unsigned" && (
                    <button
                      onClick={() => handleOpenSignModal(receipt)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Sign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <SignaturePadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSign={handleSign}
      />
    </div>
  );
}

export default PayReceiptList;
