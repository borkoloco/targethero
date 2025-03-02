import { useSelector } from "react-redux";
import UserMissions from "../components/UserMissions";

function UserDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2 className="text-2xl font-bold">User Dashboard</h2>
      <p className="text-xl font-semibold">Total Points: {user?.points || 0}</p>
      <p className="text-2xl font-bold">Misiones</p>
      <UserMissions />
    </div>
  );
}

export default UserDashboard;
