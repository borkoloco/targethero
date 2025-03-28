import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import UserMissionsByType from "../components/UserMissionsByType";
import CompletedMission from "../components/CompletedMissions";
import MyRevenue from "../components/MyRevenue";
import MyClients from "../components/MyClients";
import MyBadges from "../components/MyBadges";

function UserDashboard() {
  const dispatch = useDispatch();
  const { profile, profileStatus, profileError } = useSelector(
    (state) => state.users
  );
  const [activeTab, setActiveTab] = useState("missions");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-8 bg-[#f4edf3] min-h-screen">
      {/* Título con diseño especial */}
      <h2 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide drop-shadow-lg">
        User <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">Dashboard</span>
      </h2>
  
      {/* Carga y errores */}
      {profileStatus === "loading" && <p className="text-lg text-gray-700">Loading profile...</p>}
      {profileStatus === "failed" && <p className="text-red-500 text-lg font-semibold">{profileError}</p>}
  
      {/* Tabs con estilo moderno */}
      <div className="flex space-x-4 border-b-2 border-gray-300 pb-2">
        {[
          { key: "missions", label: "My Missions" },
          { key: "clientsRevenue", label: "My Clients & Revenue" },
          { key: "badges", label: "My Badges" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-5 text-lg font-semibold rounded-t-lg transition-all ${
              activeTab === tab.key
                ? "bg-[#6e66f3] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
  
      {/* Contenido de cada tab */}
      {activeTab === "missions" && (
        <div>
          <h3 className="text-3xl font-bold text-[#6e66f3]">Active Missions</h3>
          {profile && (
            <p className="text-2xl font-semibold mt-2 text-gray-800">
              Total Points: <span className="text-[#fc875e]">{profile.points}</span>
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { type: ["diaria", "aleatoria"], title: "Daily & Random Missions" },
              { type: "mensual", title: "Monthly Missions" },
              { type: "bonus", title: "Bonus Missions" },
              { type: "trimestral", title: "Quarterly Missions" }
            ].map((mission, index) => (
              <div key={index} className="p-5 bg-white rounded-xl shadow-lg">
                <UserMissionsByType missionTypes={mission.type} title={mission.title} />
              </div>
            ))}
          </div>
  
          {profile && (
            <h3 className="text-2xl font-bold mt-6 text-[#6e66f3]">
              Completed Missions by {profile.name}:
            </h3>
          )}
          <CompletedMission />
        </div>
      )}
  
      {activeTab === "clientsRevenue" && (
        <div>
          <h3 className="text-3xl font-bold text-[#6e66f3]">My Revenue</h3> <br />
          <div className="p-5 bg-white rounded-xl shadow-lg">
            <MyRevenue />
          </div>
  
          <h3 className="text-3xl font-bold mt-6 text-[#6e66f3]">My Clients</h3> <br />
          <div className="p-5 bg-white rounded-xl shadow-lg">
            <MyClients />
          </div>
        </div>
      )}
  
      {activeTab === "badges" && (
        <div className="p-5 bg-white rounded-xl shadow-lg">
          <MyBadges showEmptyState={true} />
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
