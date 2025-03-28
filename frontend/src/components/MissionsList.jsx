import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

function MissionsList() {
  const dispatch = useDispatch();
  const { missions, status, error } = useSelector((state) => state.missions);
  const { users } = useSelector((state) => state.users);

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedMissions = [...missions].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    } else {
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-black">Mission Overview</h2>
      {missions.length === 0 ? (
        <p className="text-white">No missions available.</p>
      ) : (
        <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#6e66f3] rounded-t-lg text-white">
                <tr>
                  <SortableTableHeader
                    label="Name"
                    field="name"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSortChange={toggleSort}
                    className="p-3 text-left rounded-tl-lg" // Rounded left top
                  />
                  <SortableTableHeader
                    label="Type"
                    field="type"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSortChange={toggleSort}
                    className="p-3 text-center"
                  />
                  <th className="p-3 text-center">Description</th>
                  <SortableTableHeader
                    label="Points"
                    field="points"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSortChange={toggleSort}
                    className="p-3 text-center"
                  />
                  <th className="p-3 text-center rounded-tr-lg">Completed By</th> {/* Rounded right top */}
                </tr>
              </thead>
              <tbody>
                {sortedMissions.map((mission) => {
                  const completedCount = mission.completers?.length || 0;
                  const totalUsers = users?.length || 0;
                  const progressPercentage = totalUsers
                    ? ((completedCount / totalUsers) * 100).toFixed(1)
                    : 0;
  
                  return (
                    <tr key={mission.id} className="hover:bg-[#e6e6f7]">
                      <td className="border-b p-3 text-gray-800 rounded-l-lg">{mission.name}</td>
                      <td className="border-b p-3 text-gray-800">{mission.type}</td>
                      <td className="border-b p-3 text-gray-800">{mission.description}</td>
                      <td className="border-b p-3 text-gray-800">{mission.points}</td>
                      <td className="border-b p-3 text-gray-800 rounded-r-lg">
                        {completedCount} {completedCount === 1 ? "user" : "users"}
                        {totalUsers > 0 && (
                          <span> ({progressPercentage}% of users)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
  
  
  
}

export default MissionsList;
