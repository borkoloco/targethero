import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";

function MissionsList() {
  const dispatch = useDispatch();
  const { missions, status, error } = useSelector((state) => state.missions);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center">
    <div className="w-full max-w-[1200px] sm:max-w-[90%] md:w-[calc(100%-240px)] h-[400px] border rounded-lg shadow-lg p-4 overflow-auto bg-white">
      <h3 className="font-semibold mb-2 text-center ">Missions Overview</h3>
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
              <th className="border p-2">Completed By</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => {
              const completedCount = mission.completers
                ? mission.completers.length
                : 0;

              const totalUsers = users ? users.length : 0;
              const progressPercentage = totalUsers
                ? ((completedCount / totalUsers) * 100).toFixed(1)
                : 0;
              return (
                <tr key={mission.id}>
                  <td className="border p-2">{mission.id}</td>
                  <td className="border p-2">{mission.name}</td>
                  <td className="border p-2">{mission.type}</td>
                  <td className="border p-2">{mission.description}</td>
                  <td className="border p-2">{mission.points}</td>
                  <td className="border p-2">
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
      )}
    </div>
    </div>
  );
}

export default MissionsList;
