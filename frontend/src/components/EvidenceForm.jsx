import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function EvidenceForm({ missionId, onEvidenceSubmitted }) {
  const { token } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("evidence", file);
    formData.append("comment", comment);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/api/evidence/${missionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onEvidenceSubmitted(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error submitting evidence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <h3 className="font-semibold text-lg">Submit Evidence</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full border p-2 rounded-md"
      />
      <textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } transition`}
      >
        {loading ? "Submitting..." : "Submit Evidence"}
      </button>
    </form>
  );
}

EvidenceForm.propTypes = {
  missionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onEvidenceSubmitted: PropTypes.func.isRequired,
};

export default EvidenceForm;
