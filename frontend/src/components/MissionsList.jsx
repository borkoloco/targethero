import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";

function MissionsList() {
  const dispatch = useDispatch();
  const { missions, status, error } = useSelector((state) => state.missions);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

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

// return (
//   <table className="w-full border-collapse">
//     <thead>
//       <tr className="bg-gray-200">
//         <th className="border p-2">ID</th>
//         <th className="border p-2">Name</th>
//         <th className="border p-2">Type</th>
//         <th className="border p-2">Description</th>
//         <th className="border p-2">Points</th>
//         <th className="border p-2">Status</th>
//       </tr>
//     </thead>
//     <tbody>
//       {missions.map((mission) => (
//         <tr key={mission.id}>
//           <td className="border p-2">{mission.id}</td>
//           <td className="border p-2">{mission.name}</td>
//           <td className="border p-2">{mission.type}</td>
//           <td className="border p-2">{mission.description}</td>
//           <td className="border p-2">{mission.points}</td>
//           <td className="border p-2">
//             {mission.isCompleted ? (
//               mission.completedBy && mission.completer ? (
//                 <>Completada por: {mission.completer.name}</>
//               ) : (
//                 "Completada"
//               )
//             ) : (
//               "Pendiente"
//             )}
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );
