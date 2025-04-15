import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllVacationRequests,
  updateVacationStatus,
} from "../../redux/slices/vacationSlice";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";

function VacationRequests() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { allRequests } = useSelector((state) => state.vacations);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (token) dispatch(fetchAllVacationRequests(token));
  }, [token, dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sorted = [...allRequests]

    .filter((r) => r.status !== "approved" && r.status !== "rejected")
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = sortField.split(".").reduce((o, k) => o?.[k], a) || "";
      const valB = sortField.split(".").reduce((o, k) => o?.[k], b) || "";
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const handleDecision = (id, action) => {
    dispatch(updateVacationStatus({ id, action, token }));
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl mt-8 font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Vacation Requests
      </h3>
      {sorted.length === 0 ? (
        <p className="text-gray-500">No pending vacation requests</p>
      ) : (
        <ScrollableTable>
          <thead className="bg-[#fc875e] text-white sticky top-0 z-10">
            <tr>
              <SortableTableHeader
                label="User"
                field="user.name"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <SortableTableHeader
                label="Start Date"
                field="startDate"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <SortableTableHeader
                label="End Date"
                field="endDate"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((req) => (
              <tr key={req.id}>
                <td className="border p-2">{req.user?.name}</td>
                <td className="border p-2">{req.startDate}</td>
                <td className="border p-2">{req.endDate}</td>
                <td className="border p-2">{req.reason}</td>
                <td className="border p-2 capitalize">
                  {req.status === "pending" && (
                    <span className="text-purple-600 font-medium">
                      Pending (Admin)
                    </span>
                  )}
                  {req.status === "admin_approved" && (
                    <span className="text-yellow-600 font-medium">
                      Ready for HR approval
                    </span>
                  )}
                  {req.status === "approved" && (
                    <span className="text-green-600 font-medium">Approved</span>
                  )}
                  {req.status === "rejected" && (
                    <span className="text-red-500 font-medium">Rejected</span>
                  )}
                </td>

                <td className="border p-2 space-x-2">
                  {req.status === "admin_approved" ? (
                    <>
                      <button
                        onClick={() => handleDecision(req.id, "approve")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(req.id, "reject")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : req.status === "pending" ? (
                    <span className="text-purple-600 italic">
                      Awaiting admin approval
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default VacationRequests;
