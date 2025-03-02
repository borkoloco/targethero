import { useEffect, useState } from "react";
import axios from "axios";

function MissionsList() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMissions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/missions");
      setMissions(response.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  if (loading) return <p>Loading missions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="font-semibold mb-2">Missions</h3>
      {missions.length === 0 ? (
        <p>No missions available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Points</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => (
              <tr key={mission.id}>
                <td className="border p-2">{mission.id}</td>
                <td className="border p-2">{mission.name}</td>
                <td className="border p-2">{mission.type}</td>
                <td className="border p-2">{mission.description}</td>
                <td className="border p-2">{mission.points}</td>
                <td className="border p-2">
                  {mission.isCompleted ? (
                    mission.completedBy && mission.completer ? (
                      <>Completada por: {mission.completer.name}</>
                    ) : (
                      "Completada"
                    )
                  ) : (
                    "Pendiente"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MissionsList;
