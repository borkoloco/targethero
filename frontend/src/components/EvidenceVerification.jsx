import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function EvidenceVerification() {
  const { token } = useSelector((state) => state.auth);
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingEvidence = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/evidence/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvidences(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching evidence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvidence();
  }, [token]);

  const handleApprove = async (evidenceId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/evidence/${evidenceId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingEvidence();
    } catch (err) {
      console.error(err);
      setError("Error approving evidence");
    }
  };

  const handleReject = async (evidenceId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/evidence/${evidenceId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingEvidence();
    } catch (err) {
      console.error(err);
      setError("Error rejecting evidence");
    }
  };

  if (loading) return <p>Loading evidence submissions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 border p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">Evidence Verification</h2>
      {evidences.length === 0 ? (
        <p>No pending evidence submissions.</p>
      ) : (
        <ul>
          {evidences.map((evidence) => (
            <li key={evidence.id} className="border p-4 mb-2 rounded">
              <p>
                <strong>Mission:</strong> {evidence.mission?.name}
              </p>
              <p>
                <strong>Submitted by:</strong> {evidence.submitter?.name}
              </p>
              <p>
                <strong>Comment:</strong> {evidence.comment || "None"}
              </p>
              <a
                href={`http://localhost:4000/${evidence.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline block my-2"
              >
                Download Evidence
              </a>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(evidence.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(evidence.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EvidenceVerification;
