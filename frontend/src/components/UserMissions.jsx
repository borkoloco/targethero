import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { fetchMissions, completeMission } from "../redux/slices/missionsSlice";
import { fetchUserProfile } from "../redux/slices/usersSlice";

function UserMissions() {
  const dispatch = useDispatch();
  const { token, user  } = useSelector((state) => state.auth);
  const { missions, status, error } = useSelector((state) => state.missions);

  useEffect(() => {
    dispatch(fetchMissions());
  }, [dispatch]);

  const handleComplete = async (missionId) => {
    try {
      const resultAction = await dispatch(completeMission(missionId));
      if (completeMission.fulfilled.match(resultAction)) {
        if (resultAction.payload.user) {
          dispatch(setCredentials({ token, user: resultAction.payload.user }));
        }

        dispatch(fetchMissions());
        dispatch(fetchUserProfile());
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const incompleteMissions = missions.filter(mission => !mission.isCompleted);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {incompleteMissions.length === 0 ? (
        <p className=" text-gray-500 text-lg font-semibold">
          No hay misiones disponibles en este momento.
        </p>
      ) : (
        incompleteMissions.map((mission) => (
          <div
            key={mission.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{mission.name}</h3>
            <p className="text-gray-700 mb-1">Type: {mission.type}</p>
            <p className="text-gray-700 mb-1">Description: {mission.description}</p>
            <p className="text-gray-700 mb-1">Points: {mission.points}</p>
            {mission.isCompleted ? (
              <p className="text-green-600 font-bold">
                Completada{" "}
                {mission.completedBy && mission.completer
                  ? `por: ${mission.completer.name}`
                  : ""}
              </p>
            ) : (
              <button
                onClick={() => handleComplete(mission.id)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
              >
                Marcar como Completada
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
export default UserMissions;