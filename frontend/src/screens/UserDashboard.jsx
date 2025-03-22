import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import UserMissionsByType from "../components/UserMissionsByType";
import CompletedMission from "../components/CompletedMissions";
import MyRevenue from "../components/MyRevenue";
import MyClients from "../components/MyClients";
import Badges from "../components/Badges";

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
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">User Dashboard</h2>

      {/* Display profile loading/error messages */}
      {profileStatus === "loading" && <p>Loading profile...</p>}
      {profileStatus === "failed" && (
        <p className="text-red-500">{profileError}</p>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("missions")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "missions"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          My Missions
        </button>
        <button
          onClick={() => setActiveTab("clientsRevenue")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "clientsRevenue"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          My Clients & Revenue
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "missions" && (
        <div>
          <h3 className="text-2xl font-bold">Active Missions</h3>
          {profile && (
            <p className="text-xl font-semibold mt-2">
              Total Points: {profile.points}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <UserMissionsByType
              missionType="Aleatoria"
              title="Random Missions"
            />
            <UserMissionsByType
              missionType= "Mensual"
              title="Monthly Missions"
            />
            <UserMissionsByType missionType="Bonus Track" title="Bonus Missions" />
            <UserMissionsByType
              missionType="Trimestral"
              title="Quarterly Missions"
            />
          </div>
          {profile && (
            <h4 className="text-2xl font-bold mt-4 text-center">
            Completed Missions by {profile.name}:
          </h4>
          
          )}
          <CompletedMission />
          <Badges/>
        </div>
      )}

      {activeTab === "clientsRevenue" && (
        <div>
          <h3 className="text-2xl font-bold">My Revenue</h3>
          <MyRevenue />
          <h3 className="text-2xl font-bold mt-4">My Clients</h3>
          <MyClients />
         
        </div>
      )}
    
    </div>
    
  );
}

export default UserDashboard;
