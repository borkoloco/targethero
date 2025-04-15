import { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function PayReceiptUpload({ isOpen, onClose, onSuccess }) {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [month, setMonth] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    };

    fetchUsers();
  }, [isOpen, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !month || !file) return;

    const formData = new FormData();
    formData.append("userId", selectedUser);
    formData.append("month", month);
    formData.append("receipts", file);

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/pay-receipts/upload`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    onSuccess?.();
    onClose();
    setSelectedUser("");
    setMonth("");
    setFile(null);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Upload Pay Receipt">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Employee</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-[#6e66f3] text-white py-2 px-4 rounded w-full"
        >
          Upload
        </button>
      </form>
    </ModalWrapper>
  );
}

PayReceiptUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default PayReceiptUpload;
