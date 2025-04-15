import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedVacationRequests } from "../../redux/slices/vacationSlice";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";

function ApprovedVacationRequests() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { approvedRequests } = useSelector((state) => state.vacations);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (token) dispatch(fetchApprovedVacationRequests(token));
  }, [token, dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sorted = [...approvedRequests].sort((a, b) => {
    if (!sortField) return 0;
    const valA = sortField.split(".").reduce((o, k) => o?.[k], a) || "";
    const valB = sortField.split(".").reduce((o, k) => o?.[k], b) || "";
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl mt-8 font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Approved Vacation Requests
      </h3>
      {sorted.length === 0 ? (
        <p className="text-gray-500">No approved vacation requests yet.</p>
      ) : (
        <ScrollableTable>
          <thead className="bg-[#6e66f3] text-white sticky top-0 z-10">
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
              <SortableTableHeader
                label="Approved On"
                field="updatedAt"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((req) => (
              <tr key={req.id}>
                <td className="border p-2">{req.user?.name}</td>
                <td className="border p-2">{req.startDate}</td>
                <td className="border p-2">{req.endDate}</td>
                <td className="border p-2">{req.reason}</td>
                <td className="border p-2">
                  {new Date(req.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default ApprovedVacationRequests;
