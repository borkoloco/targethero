import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function RoomReservationForm({ onSuccess }) {
  const { token } = useSelector((state) => state.auth);

  const [room, setRoom] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/room-reservations`,
        { room, checkIn, checkOut, guestName, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoom("");
      setCheckIn("");
      setCheckOut("");
      setGuestName("");
      setStatus("pending");
      setMessage("Room reservation submitted successfully!");

      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to submit room reservation."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Room</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Check-in Date</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Check-out Date</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Guest Name</label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-[#6e66f3] text-white px-4 py-2 rounded"
      >
        Submit Reservation
      </button>

      {message && (
        <p className="mt-2 text-center text-[#fc875e] text-sm font-medium">
          {message}
        </p>
      )}
    </form>
  );
}

RoomReservationForm.propTypes = {
  onSuccess: PropTypes.func,
};

export default RoomReservationForm;
