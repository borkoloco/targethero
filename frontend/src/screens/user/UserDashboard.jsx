import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/usersSlice";
import UserMissionsByType from "../../components/user/UserMissionsByType";
import CompletedMission from "../../components/user/CompletedMissions";
import MyRevenue from "../../components/user/MyRevenue";
import MyClients from "../../components/user/MyClients";
import MyBadges from "../../components/user/MyBadges";
import ActiveBadges from "../../components/user/ActiveBadges";
import useDailyTrigger from "../../hooks/useDailyTrigger";
import { fetchMissions } from "../../redux/slices/missionsSlice";

function UserDashboard() {
  const dispatch = useDispatch();
  const { profile, profileStatus, profileError } = useSelector(
    (state) => state.users
  );
  const [activeTab, setActiveTab] = useState("missions");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useDailyTrigger(() => {
    dispatch(fetchMissions());
  });

  return (
    <div className="min-h-screen bg-[#f4edf3] p-6 font-sans">
      <h2 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide mb-6 drop-shadow-lg">
        User{" "}
        <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">
          Dashboard
        </span>
      </h2>

      {profileStatus === "loading" && <p>Loading profile...</p>}
      {profileStatus === "failed" && (
        <p className="text-red-500">{profileError}</p>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab("missions")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "missions"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          My Missions
        </button>
        <button
          onClick={() => setActiveTab("clientsRevenue")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "clientsRevenue"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          My Clients & Revenue
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "badges"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          My Badges
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === "missions" && (
          <div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4 text-[#6e66f3]">
                Active Missions
              </h3>
              {profile && (
                <p className="text-lg font-medium text-gray-700 mb-4">
                  Total Points:{" "}
                  <span className="text-[#fc875e] font-semibold">
                    {profile.points}
                  </span>
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserMissionsByType
                  missionTypes={["diaria", "aleatoria"]}
                  title="Daily & Random Missions"
                />
                <UserMissionsByType
                  missionTypes="mensual"
                  title="Monthly Missions"
                />
                <UserMissionsByType
                  missionTypes="bonus"
                  title="Bonus Missions"
                />
                <UserMissionsByType
                  missionTypes="trimestral"
                  title="Quarterly Missions"
                />
              </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl">
              {profile && (
                <h4 className="text-2xl font-bold mb-4 text-[#6e66f3]">
                  Completed Missions by {profile.name}:
                </h4>
              )}
              <CompletedMission />
            </div>
          </div>
        )}

        {activeTab === "clientsRevenue" && (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
                My Revenue
              </h3>
              <MyRevenue />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
                My Clients
              </h3>
              <MyClients />
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
                My Badges
              </h3>
              <MyBadges showEmptyState={true} />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
                My Active Badges
              </h3>
              <ActiveBadges />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserProfile } from "../redux/slices/usersSlice";
// import UserMissionsByType from "../components/UserMissionsByType";
// import CompletedMission from "../components/CompletedMissions";
// import MyRevenue from "../components/MyRevenue";
// import MyClients from "../components/MyClients";
// import MyBadges from "../components/MyBadges";
// import useDailyTrigger from "../hooks/useDailyTrigger";
// import { fetchMissions } from "../redux/slices/missionsSlice";

// function UserDashboard() {
//   const dispatch = useDispatch();
//   const { profile, profileStatus, profileError } = useSelector(
//     (state) => state.users
//   );
//   const [activeTab, setActiveTab] = useState("missions");

//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [dispatch]);

//   useDailyTrigger(() => {
//     dispatch(fetchMissions());
//   });

//   return (
//     <div className="min-h-screen bg-[#f4edf3] p-6 font-sans">
//       <h2 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide mb-6 drop-shadow-lg">
//         User{" "}
//         <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">
//           Dashboard
//         </span>
//       </h2>

//       {profileStatus === "loading" && <p>Loading profile...</p>}
//       {profileStatus === "failed" && (
//         <p className="text-red-500">{profileError}</p>
//       )}

//       <div className="flex flex-wrap gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab("missions")}
//           className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
//             activeTab === "missions"
//               ? "bg-[#fc875e] text-white"
//               : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
//           }`}
//         >
//           My Missions
//         </button>
//         <button
//           onClick={() => setActiveTab("clientsRevenue")}
//           className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
//             activeTab === "clientsRevenue"
//               ? "bg-[#fc875e] text-white"
//               : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
//           }`}
//         >
//           My Clients & Revenue
//         </button>
//         <button
//           onClick={() => setActiveTab("badges")}
//           className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
//             activeTab === "badges"
//               ? "bg-[#fc875e] text-white"
//               : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
//           }`}
//         >
//           My Badges
//         </button>
//       </div>

//       <div className="space-y-8">
//         {activeTab === "missions" && (
//           <div>
//             <div className="p-6 bg-white rounded-2xl shadow-xl">
//               <h3 className="text-2xl font-bold mb-4 text-[#6e66f3]">
//                 Active Missions
//               </h3>
//               {profile && (
//                 <p className="text-lg font-medium text-gray-700 mb-4">
//                   Total Points:{" "}
//                   <span className="text-[#fc875e] font-semibold">
//                     {profile.points}
//                   </span>
//                 </p>
//               )}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <UserMissionsByType
//                   missionTypes={["diaria", "aleatoria"]}
//                   title="Daily & Random Missions"
//                 />
//                 <UserMissionsByType
//                   missionTypes="mensual"
//                   title="Monthly Missions"
//                 />
//                 <UserMissionsByType
//                   missionTypes="bonus"
//                   title="Bonus Missions"
//                 />
//                 <UserMissionsByType
//                   missionTypes="trimestral"
//                   title="Quarterly Missions"
//                 />
//               </div>
//             </div>

//             <div className="mt-6 p-6 bg-white rounded-2xl shadow-xl">
//               {profile && (
//                 <h4 className="text-2xl font-bold mb-4 text-[#6e66f3]">
//                   Completed Missions by {profile.name}:
//                 </h4>
//               )}
//               <CompletedMission />
//             </div>
//           </div>
//         )}

//         {activeTab === "clientsRevenue" && (
//           <div className="space-y-8">
//             <div className="p-6 bg-white rounded-2xl shadow-xl">
//               <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
//                 My Revenue
//               </h3>
//               <MyRevenue />
//             </div>
//             <div className="p-6 bg-white rounded-2xl shadow-xl">
//               <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
//                 My Clients
//               </h3>
//               <MyClients />
//             </div>
//           </div>
//         )}

//         {activeTab === "badges" && (
//           <div className="p-6 bg-white rounded-2xl shadow-xl">
//             <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
//               My Badges
//             </h3>
//             <MyBadges showEmptyState={true} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;
