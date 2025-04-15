import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";

function PendingBadgeEvidenceList() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/badge-evidence/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvidences(res.data);
      } catch {
        setError("Failed to fetch pending badge evidences");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [token]);

  const handleDecision = async (id, action) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/badge-evidence/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvidences((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to update evidence status.");
    }
  };

  if (loading) return <p>Loading pending badge evidence...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-8">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Pending Badge Evidence
      </h3>

      {evidences.length === 0 ? (
        <p className="text-gray-600">No pending badge evidence to verify.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-[#fc875e] text-white z-10">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Badge</th>
              <th className="border p-2">Submitted At</th>
              <th className="border p-2">Evidence</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {evidences.map((evidence) => (
              <tr key={evidence.id}>
                <td className="border p-2">{evidence.user?.name}</td>
                <td className="border p-2">
                  {evidence.badgeRule?.badge?.name}
                </td>
                <td className="border p-2">
                  {new Date(evidence.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  <a
                    href={evidence.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View File
                  </a>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(evidence.id, "approve")}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(evidence.id, "reject")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Reject
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

export default PendingBadgeEvidenceList;
