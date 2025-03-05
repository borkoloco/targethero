import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";

function CompletedMissions() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { missions, status, error } = useSelector((state) => state.missions);


    
    const userCompletedMissions = missions.filter(
        (mission) => mission.isCompleted && mission.completedBy === user.id
    );

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchMissions());
        }
    }, [dispatch, status]);
  
    if (status === "loading") return <p>Loading missions...</p>;
    if (status === "failed") return <p className="text-red-500">{error}</p>;
  
    return (
      <div className="mt-4 border p-4 rounded">
        {userCompletedMissions.length === 0 ? (
          <p>No missions available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Points</th>
                
              </tr>
            </thead>
            <tbody>
              {userCompletedMissions.map((mission) => (
                <tr key={mission.id}>
                  <td className="border p-2">{mission.name}</td>
                  <td className="border p-2">{mission.type}</td>
                  <td className="border p-2">{mission.description}</td>
                  <td className="border p-2">{mission.points}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  
  export default CompletedMissions;