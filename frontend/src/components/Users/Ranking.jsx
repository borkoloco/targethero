import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableTable from "../SortableTable/ScrollableTable";
import SortableTableHeader from "../SortableTable/SortableTableHeader";

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
    <div className="mt-4 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-[#6e66f3] mb-4 drop-shadow">
        Leaderboard 🏆
      </h2>
      <ScrollableTable>
        <thead className="sticky top-0 bg-[#fc875e] text-white z-10">
          <tr>
            <th className="border p-2">Rank</th>
            <SortableTableHeader
              label="Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Role</th>
            <th className="border p-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedRanking.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-100 transition">
              <td className="border p-2 font-semibold">{index + 1}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2 capitalize">{user.role}</td>
              <td className="border p-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default Ranking;
