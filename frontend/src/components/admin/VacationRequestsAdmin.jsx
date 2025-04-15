import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";

function VacationRequestsAdmin() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/vacations/all`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequests(res.data);
  };

  const handleAdminApprove = async (id) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/vacations/${id}/admin-approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl mt-6 font-sans">
      <h2 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Admin Vacation Approval
      </h2>
      <ScrollableTable>
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="p-2 border">{req.user?.name}</td>
              <td className="p-2 border">{req.startDate}</td>
              <td className="p-2 border">{req.endDate}</td>
              <td className="p-2 border">{req.reason}</td>
              <td className="p-2 border capitalize">
                {req.status === "pending" && (
                  <span className="text-purple-600 font-medium">Pending</span>
                )}
                {req.status === "admin_approved" && (
                  <span className="text-yellow-600 font-medium">
                    Admin Approved
                  </span>
                )}
                {req.status === "approved" && (
                  <span className="text-green-600 font-medium">Approved</span>
                )}
                {req.status === "rejected" && (
                  <span className="text-red-500 font-medium">Rejected</span>
                )}
              </td>
              <td className="p-2 border">
                {req.status === "pending" ? (
                  <button
                    onClick={() => handleAdminApprove(req.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-gray-400 italic">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default VacationRequestsAdmin;
