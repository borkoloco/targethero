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
    <div className="mt-4 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-[#6e66f3] mb-4 drop-shadow">
        Missions Overview
      </h2>
      {missions.length === 0 ? (
        <p>No missions available.</p>
      ) : (
        <ScrollableTable>
          <thead className="sticky top-0 bg-[#fc875e] text-white z-10">
            <tr>
              <th className="border p-2">ID</th>
              <SortableTableHeader
                label="Name"
                field="name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Type"
                field="type"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="border p-2">Description</th>
              <SortableTableHeader
                label="Points"
                field="points"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Expires At"
                field="expiresAt"
                {...{ sortField, sortDirection, onSortChange: toggleSort }}
              />
              <th className="border p-2">Completed By</th>
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
                <tr key={mission.id} className="hover:bg-gray-100 transition">
                  <td className="border p-2">{mission.id}</td>
                  <td className="border p-2">{mission.name}</td>
                  <td className="border p-2 capitalize">{mission.type}</td>
                  <td className="border p-2">{mission.description}</td>
                  <td className="border p-2">{mission.points}</td>
                  <td className="border p-2">
                    {mission.expiresAt
                      ? new Date(mission.expiresAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="border p-2">
                    {completedCount} {completedCount === 1 ? "user" : "users"}
                    {totalUsers > 0 && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        ({progressPercentage}% of users)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default MissionsList;
