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
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Pending Evidence</h3>
      {evidenceList.length === 0 ? (
        <p>No pending evidence to verify.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-gray-200 z-10">
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
                <td className="border p-2">{evidence.user?.name}</td>
                <td className="border p-2">{evidence.mission?.name}</td>
                <td className="border p-2">
                  {new Date(evidence.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  <a
                    href={evidence.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                </td>

                <td className="border p-2">
                  <button
                    onClick={() => handleApprove(evidence.id)}
                    className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(evidence.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
