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
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">User Dashboard</h2>

      {profileStatus === "loading" && <p>Loading profile...</p>}
      {profileStatus === "failed" && (
        <p className="text-red-500">{profileError}</p>
      )}

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
        <button
          onClick={() => setActiveTab("badges")}
          className={`py-2 px-4 font-semibold ${
            activeTab === "badges"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          My Badges
        </button>
      </div>

      {activeTab === "missions" && (
        <div>
          <h3 className="text-2xl font-bold">Active Missions</h3>
          {profile && (
            <p className="text-xl font-semibold mt-2">
              Total Points: {profile.points}
            </p>
          )}
          <div className="border border-gray-300 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserMissionsByType
                missionTypes={["diaria", "aleatoria"]}
                title="Daily & Random Missions"
              />
              <UserMissionsByType
                missionTypes="mensual"
                title="Monthly Missions"
              />
              <UserMissionsByType missionTypes="bonus" title="Bonus Missions" />
              <UserMissionsByType
                missionTypes="trimestral"
                title="Quarterly Missions"
              />
            </div>
          </div>

          {profile && (
            <h4 className="text-2xl font-bold mt-4">
              Completed Missions by {profile.name}:
            </h4>
          )}
          <CompletedMission />
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

      {activeTab === "badges" && (
        <div>
          <MyBadges showEmptyState={true} />
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
