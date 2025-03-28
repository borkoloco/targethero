import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";
import axios from "axios";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

function CompletedMissions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { missions, status, error } = useSelector((state) => state.missions);
  const { token } = useSelector((state) => state.auth);

  const [completedMissionIds, setCompletedMissionIds] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/missions/completed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedMissionIds(response.data);
      } catch (err) {
        console.error("Error fetching completed missions:", err);
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

  const userCompletedMissions = missions.filter((mission) =>
    completedMissionIds.includes(mission.id)
  );

  const sortedMissions = [...userCompletedMissions].sort((a, b) => {
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
    <div className="mt-4 p-4 rounded-lg bg-[#f3f4f6] shadow-md">
      {sortedMissions.length === 0 ? (
        <p className="text-white">No missions completed yet.</p>
      ) : (
        <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#6e66f3] rounded-t-lg text-white">
                <tr>
                  <th className="p-3 text-left rounded-tl-lg">Name</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Description</th>
                  <th className="p-3 text-center rounded-tr-lg">Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedMissions.map((mission) => (
                  <tr key={mission.id} className="hover:bg-[#e6e6f7]">
                    <td className="border-b p-3 text-gray-800">{mission.name}</td>
                    <td className="border-b p-3 text-gray-800">{mission.type}</td>
                    <td className="border-b p-3 text-gray-800">{mission.description}</td>
                    <td className="border-b p-3 text-gray-800">{mission.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default CompletedMissions;
