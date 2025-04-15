import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";
import PayReceiptUpload from "./PayReceiptUpload";

function PayReceiptsSent() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchReceipts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/pay-receipts/sent`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReceipts(res.data);
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await axios.put(
      `${
        import.meta.env.VITE_API_URL
      }/api/pay-receipts/${id}/approve-signature`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchReceipts();
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  if (loading) return <p>Loading sent receipts...</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6e66f3]">
          Receipts to Approve
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#fc875e] text-white px-4 py-2 rounded hover:bg-[#f67a4f]"
        >
          + Upload Pay Receipt
        </button>
      </div>

      <ScrollableTable>
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Receipt</th>
            <th className="p-2 border">Signature</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.id}>
              <td className="border p-2">{receipt.employee?.name}</td>
              <td className="border p-2">{receipt.month}</td>
              <td className="border p-2">
                <a
                  href={receipt.fileUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="border p-2">
                {receipt.signatureUrl ? (
                  <img
                    src={receipt.signatureUrl}
                    alt="Signature"
                    className="h-12"
                  />
                ) : (
                  "No signature"
                )}
              </td>
              <td className="border p-2 capitalize">
                {receipt.signatureStatus === "approved" && (
                  <span className="text-green-600 font-medium">Approved</span>
                )}
                {receipt.signatureStatus === "awaiting_approval" && (
                  <span className="text-yellow-600 font-medium">
                    Awaiting HR approval
                  </span>
                )}
                {receipt.signatureStatus === "awaiting_admin_approval" && (
                  <span className="text-purple-600 font-medium">
                    Awaiting Admin approval
                  </span>
                )}
                {receipt.signatureStatus === "unsigned" && (
                  <span className="text-gray-500">Unsigned</span>
                )}
              </td>
              <td className="border p-2">
                {receipt.signatureStatus === "awaiting_approval" && (
                  <button
                    onClick={() => handleApprove(receipt.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <PayReceiptUpload
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchReceipts}
      />
    </div>
  );
}

export default PayReceiptsSent;
