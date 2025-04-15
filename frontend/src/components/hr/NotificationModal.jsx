import { useState } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "../common/ModalWrapper";
import axios from "axios";
import { useSelector } from "react-redux";

function NotificationModal({ isOpen, onClose }) {
  const { token } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setMessage("");
      onClose();
    } catch (err) {
      console.error("Failed to send notification", err);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Send Notification">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
        <button
          onClick={handleSend}
          className="bg-[#6e66f3] hover:bg-[#574ed1] text-white px-4 py-2 rounded w-full"
        >
          Send Notification
        </button>
      </div>
    </ModalWrapper>
  );
}

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationModal;
