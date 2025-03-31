import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

function CompletedMissions() {
  const { user, token } = useSelector((state) => state.auth);

  const [completedMissions, setCompletedMissions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/missions/completed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedMissions(response.data);
      } catch (err) {
        setError("Error fetching completed missions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchCompletedMissions();
    }
  }, [user, token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedMissions = [...completedMissions].sort((a, b) => {
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

  if (loading) return <p>Loading missions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Completed Missions
      </h3>
      {sortedMissions.length === 0 ? (
        <p className="text-gray-500">No missions completed yet.</p>
      ) : (
        <ScrollableTable>
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
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
              <th className="border p-2 font-semibold text-gray-700">
                Description
              </th>
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
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sortedMissions.map((mission) => (
              <tr key={mission.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{mission.name}</td>
                <td className="border p-2 capitalize">{mission.type}</td>
                <td className="border p-2">{mission.description}</td>
                <td className="border p-2 font-semibold text-[#fc875e]">
                  {mission.points}
                </td>
                <td className="border p-2">
                  {mission.expiresAt
                    ? new Date(mission.expiresAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default CompletedMissions;
