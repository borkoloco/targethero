import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";

function SignPayReceipts() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/my-receipts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReceipts();
  }, [token]);

  const handleFileChange = (id, file) => {
    setFileMap((prev) => ({ ...prev, [id]: file }));
  };

  const handleSign = async (id) => {
    const file = fileMap[id];
    if (!file) return;

    const formData = new FormData();
    formData.append("signedFile", file);

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/pay-receipts/${id}/sign`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setFileMap((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    fetchMyReceipts();
  };

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

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <h2 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Sign Pay Receipts
      </h2>

      {loading ? (
        <p>Loading receipts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sortedReceipts.length === 0 ? (
        <p className="text-gray-600">No receipts to sign yet.</p>
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
              <th className="p-2 border">Receipt</th>
              <SortableTableHeader
                label="Signed"
                field="signedFileUrl"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
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
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="border p-2">
                  {receipt.signedFileUrl ? (
                    <a
                      href={receipt.signedFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      Signed
                    </a>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  {!receipt.signedFileUrl && (
                    <>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFileChange(receipt.id, e.target.files[0])
                        }
                      />
                      <button
                        onClick={() => handleSign(receipt.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Sign
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default SignPayReceipts;
