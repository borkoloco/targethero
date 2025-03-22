import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";
import axios from "axios";

function CompletedMissions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { missions, status, error } = useSelector((state) => state.missions);
  const { token } = useSelector((state) => state.auth);

  const [completedMissionIds, setCompletedMissionIds] = useState([]);

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
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching completed missions:", err);
      }
    };

    if (user && token) {
      fetchCompletedMissions();
    }
  }, [user, token]);

  const userCompletedMissions = missions.filter((mission) =>
    completedMissionIds.includes(mission.id)
  );

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center">
  
      
      <div className="w-full max-w-[1200px] sm:max-w-[90%] md:w-[calc(100%-240px)] h-[400px] border rounded-lg shadow-lg p-4 overflow-auto bg-white">
        {userCompletedMissions.length === 0 ? (
          <p>No missions completed yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-sm sm:text-base">Name</th>
                <th className="border p-2 text-sm sm:text-base">Type</th>
                <th className="border p-2 text-sm sm:text-base">Description</th>
                <th className="border p-2 text-sm sm:text-base">Points</th>
              </tr>
            </thead>
            <tbody>
              {userCompletedMissions.map((mission) => (
                <tr key={mission.id}>
                  <td className="border p-2 text-sm sm:text-base">{mission.name}</td>
                  <td className="border p-2 text-sm sm:text-base">{mission.type}</td>
                  <td className="border p-2 text-sm sm:text-base">{mission.description}</td>
                  <td className="border p-2 text-sm sm:text-base">{mission.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  
}

export default CompletedMissions;
