function MissionList() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Mission List</h2>
    </div>
  );
}

export default MissionList;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMissions } from "../redux/slices/missionsSlice";
// import { Link } from "react-router-dom";

// function MissionsList() {
//   const dispatch = useDispatch();
//   const { missions, status, error } = useSelector((state) => state.missions);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchMissions());
//     }
//   }, [status, dispatch]);

//   if (status === "loading") return <p>Loading missions...</p>;
//   if (status === "failed") return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Missions and Challenges</h2>
//       {missions.length === 0 ? (
//         <p>No missions available.</p>
//       ) : (
//         <ul>
//           {missions.map((mission) => (
//             <li key={mission.id} className="border p-4 mb-2 rounded">
//               <h3 className="text-xl font-semibold">{mission.description}</h3>
//               <p>Type: {mission.type}</p>
//               <p>Points: {mission.points}</p>
//               <Link
//                 to={`/missions/${mission.id}`}
//                 className="text-blue-500 hover:underline"
//               >
//                 View Details
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default MissionsList;
