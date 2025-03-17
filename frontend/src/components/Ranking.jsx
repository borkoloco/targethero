import { useEffect, useState } from "react";
import axios from "axios";

function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading ranking...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((user, index) => (
            <tr key={user.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
