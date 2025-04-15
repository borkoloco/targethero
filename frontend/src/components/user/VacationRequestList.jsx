import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ModalWrapper from "../common/ModalWrapper";
import VacationRequestForm from "./VacationRequestForm";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";

function VacationRequestList() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vacations/my-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch {
      setError("Failed to fetch vacation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-[#6e66f3]">
          My Vacation Requests
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded"
        >
          + New Request
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No vacation requests yet.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="sticky top-0 bg-[#fc875e] z-10 text-white">
            <tr>
              <SortableTableHeader
                label="Start Date"
                field="startDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="End Date"
                field="endDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-2 border">Reason</th>
              <SortableTableHeader
                label="Status"
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Submitted"
                field="createdAt"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedRequests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{req.startDate}</td>
                <td className="border p-2">{req.endDate}</td>
                <td className="border p-2">{req.reason}</td>
                <td className="border p-2 capitalize">{req.status}</td>
                <td className="border p-2">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Vacation Request"
      >
        <VacationRequestForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchRequests();
          }}
        />
      </ModalWrapper>
    </div>
  );
}

export default VacationRequestList;
