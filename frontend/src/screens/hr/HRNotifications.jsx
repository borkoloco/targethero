import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../../components/common/ScrollableTable";
import ModalWrapper from "../../components/common/ModalWrapper";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

function HRNotifications() {
  const { token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchNotifications = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/notifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNotifications(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, [token]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => socket.off("newNotification");
  }, []);

  const handleSendNotification = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setRecipient("all");
      setModalOpen(false);
      setNotifications((prev) => [res.data, ...prev]);

      const event = {
        type: "notification",
        description: `Para ${recipient?.name} , ${title}: ${message}`,
        createdAt: new Date().toISOString(),
      };

      socket.emit("newEvent", event);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/recent`,
        event,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      toast.error("Failed to send notification");
      console.error("Failed to send notification", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6e66f3]">Notifications</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded"
        >
          + Send Notification
        </button>
      </div>

      <ScrollableTable>
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Message</th>
            <th className="p-3 border">Recipient</th>
            <th className="p-3 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((note) => (
            <tr key={note.id}>
              <td className="border p-3 font-semibold text-gray-800">
                {note.title}
              </td>
              <td className="border p-3 text-gray-700">{note.message}</td>
              <td className="border p-3 text-gray-600">
                {note.recipient === "all"
                  ? "Everyone"
                  : users.find((u) => u.id === note.recipient)?.name || "User"}
              </td>
              <td className="border p-3 text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Send Notification"
      >
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
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleSendNotification}
            className="bg-[#6e66f3] hover:bg-[#574ed1] text-white px-4 py-2 rounded w-full"
          >
            Send Notification
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}

export default HRNotifications;
