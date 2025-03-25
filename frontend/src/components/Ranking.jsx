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
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ScrollableTable>
        <thead className="sticky top-0 bg-gray-200 z-10">
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
            <SortableTableHeader
              label="Points"
              field="points"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
          </tr>
        </thead>
        <tbody>
          {sortedRanking.map((user, index) => (
            <tr key={user.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default Ranking;
