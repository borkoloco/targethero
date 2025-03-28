import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/ranking"
        );
        setRanking(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching ranking");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRanking = [...ranking].sort((a, b) => {
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

  if (loading) return <p>Loading ranking...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Leaderboard</h2>
      <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#6e66f3] text-white">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedRanking.map((user, index) => (
                <tr key={user.id} className="hover:bg-[#e6e6f7]">
                  <td className="border-b p-3 text-gray-800">{index + 1}</td>
                  <td className="border-b p-3 text-gray-800">{user.name}</td>
                  <td className="border-b p-3 text-gray-800">{user.role}</td>
                  <td className="border-b p-3 text-gray-800">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}

export default Ranking;
