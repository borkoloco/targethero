// src/screens/UserDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import UserMissions from "../components/UserMissions";
import CompletedMission from "../components/CompletedMissions";
import MyClients from "../components/MyClients";

function UserDashboard() {
  const dispatch = useDispatch();
  const { profile, profileStatus, profileError } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">User Dashboard</h2>
      {profileStatus === "loading" && <p>Loading profile...</p>}
      {profileStatus === "failed" && (
        <p className="text-red-500">{profileError}</p>
      )}
      {profile && (
        <p className="text-xl font-semibold">Total Points: {profile.points}</p>
      )}
      <h3 className="text-2xl font-bold mt-4">Active Missions</h3>
      <UserMissions />
      {profile && (
        <h4 className="text-2xl font-bold mt-4">
          Completed Missions by {profile.name}:
        </h4>
      )}
      <CompletedMission />
      <h3 className="text-2xl font-bold mt-4">My Clients</h3>
      <MyClients />
    </div>
  );
}

export default UserDashboard;

// function BoilerComponent() {
//   return (
//     <div>
//       <h2>Boilerplate Component</h2>
//       <p>This is a basic component with no props.</p>
//     </div>
//   );
// }

// export default BoilerComponent;
