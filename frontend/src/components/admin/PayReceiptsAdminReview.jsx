import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";

function PayReceiptsAdminReview() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);

  const fetchReceipts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/pay-receipts/sent`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReceipts(res.data);
  };

  const handleAdminApprove = async (id) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/pay-receipts/${id}/admin-approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchReceipts();
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md font-sans space-y-4">
      <h2 className="text-2xl font-bold text-[#6e66f3]">
        Admin Signature Approvals
      </h2>

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
              <td className="p-2 border">{receipt.employee?.name}</td>
              <td className="p-2 border">{receipt.month}</td>
              <td className="p-2 border">
                <a
                  href={receipt.fileUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="p-2 border">
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
              <td className="p-2 border capitalize">
                {receipt.signatureStatus}
              </td>
              <td className="p-2 border">
                {receipt.signatureStatus === "awaiting_admin_approval" && (
                  <button
                    onClick={() => handleAdminApprove(receipt.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default PayReceiptsAdminReview;
