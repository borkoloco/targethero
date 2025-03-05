import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import UserMissions from "../components/UserMissions";

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
    </div>
  );
}

export default UserDashboard;
