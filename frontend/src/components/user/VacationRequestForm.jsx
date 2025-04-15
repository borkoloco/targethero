import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function VacationRequestForm({ onSuccess }) {
  const { token } = useSelector((state) => state.auth);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vacations/request`,
        { startDate, endDate, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStartDate("");
      setEndDate("");
      setReason("");
      setMessage("Vacation request submitted successfully!");

      if (onSuccess) onSuccess(); // ← ✅ trigger parent update
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to submit vacation request."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 w-full rounded"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-[#6e66f3] text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>
      {message && (
        <p className="mt-2 text-center text-[#fc875e] text-sm font-medium">
          {message}
        </p>
      )}
    </form>
  );
}
VacationRequestForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default VacationRequestForm;
