import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchAvailablePoints,
} from "../../redux/slices/usersSlice";

function PointsOverview() {
  const dispatch = useDispatch();
  const { profile, availablePoints } = useSelector((state) => state.users);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
      dispatch(fetchAvailablePoints());
    }
  }, [dispatch, token]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="text-xl font-bold">
        Total Points Earned: {profile.points}
      </h3>
      <h3 className="text-xl font-bold">
        Available Points: {availablePoints ?? "Loading..."}
      </h3>
    </div>
  );
}

export default PointsOverview;
