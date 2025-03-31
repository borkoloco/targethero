import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";

function EvidenceVerification() {
  const { token } = useSelector((state) => state.auth);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvidence = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/evidence/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvidenceList(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching evidence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [token]);

  const handleApprove = async (evidenceId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/evidence/${evidenceId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEvidence();
    } catch (err) {
      console.error("Error approving evidence:", err);
    }
  };

  const handleReject = async (evidenceId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/evidence/${evidenceId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEvidence();
    } catch (err) {
      console.error("Error rejecting evidence:", err);
    }
  };

  if (loading) return <p>Loading evidence...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-8">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Pending Evidence
      </h3>

      {evidenceList.length === 0 ? (
        <p className="text-gray-600">No pending evidence to verify.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Mission</th>
              <th className="border p-2">Submitted At</th>
              <th className="border p-2">Evidence</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {evidenceList.map((evidence) => (
              <tr key={evidence.id}>
                <td className="border p-2">{evidence.submitter?.name}</td>
                <td className="border p-2">{evidence.mission?.name}</td>
                <td className="border p-2">
                  {new Date(evidence.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  <a
                    href={evidence.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View File
                  </a>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleApprove(evidence.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(evidence.id)}
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

export default EvidenceVerification;
