import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { fetchMissions, completeMission } from "../redux/slices/missionsSlice";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import EvidenceForm from "./EvidenceForm";
import axios from "axios";

function MissionAleatoria() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { missions, status, error } = useSelector((state) => state.missions);
  const [myPendingEvidence, setMyPendingEvidence] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);

  useEffect(() => {
    dispatch(fetchMissions());
  }, [dispatch]);

  useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/missions/completed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedMissionIds(response.data);
      } catch (err) {
        console.error("Error fetching completed missions:", err);
      }
    };
    if (user && token) {
      fetchCompletedMissions();
    }
  }, [user, token]);

  useEffect(() => {
    const fetchPendingEvidence = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + `/api/evidence/pending/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyPendingEvidence(response.data);
      } catch (err) {
        console.error("Error fetching pending evidence:", err);
      }
    };
    if (user && token) {
      fetchPendingEvidence();
    }
  }, [user, token]);

  const completedIds = completedMissionIds.map((id) => Number(id));

  const incompleteMissions = missions
  .filter((mission) => !completedIds.includes(Number(mission.id)))
  .filter((mission) => mission.type === "Aleatoria");

  const handleComplete = async (missionId) => {
    try {
      const resultAction = await dispatch(completeMission(missionId));
      if (completeMission.fulfilled.match(resultAction)) {
        if (resultAction.payload.user) {
          dispatch(setCredentials({ token, user: resultAction.payload.user }));
        }
        dispatch(fetchMissions());
        dispatch(fetchUserProfile());

        const completedResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/api/missions/completed",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompletedMissionIds(completedResponse.data);
        const pendingResponse = await axios.get(
          import.meta.env.VITE_API_URL + `/api/evidence/pending/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyPendingEvidence(pendingResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal for evidence submission
  const openEvidenceModal = (missionId) => {
    setSelectedMissionId(missionId);
    setModalOpen(true);
  };

  // Close modal callback
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMissionId(null);
  };

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-1/2  overflow-y-auto h-96 p-4 border rounded shadow">
  
      {/* Misión Diaria */}
      {missions.some((mission) => mission.type === "Diaria") && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Misión Diaria</h2>
          {missions
            .filter((mission) => mission.type === "Diaria")
            .map((mission) => (
              <div
                key={mission.id}
                className="w-full h-auto flex flex-col justify-center gap-1 border p-3 rounded shadow"
              >
                <h3 className="text-sm font-semibold break-words">{mission.name}</h3>
                <p className="text-xs text-gray-700 break-words">Points: {mission.points}</p>
                <button
                  onClick={() => handleComplete(mission.id)}
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded transition"
                >
                  Marcar como Completada
                </button>
              </div>
            ))}
          <hr className="my-4 border-gray-300" />
        </div>
      )}
  
      {/* Misiones Aleatorias */}
      <h2 className="text-lg font-semibold mb-2">Misiones Aleatorias</h2>
      {incompleteMissions.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold">
          No hay misiones disponibles en este momento.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {incompleteMissions.map((mission) => {
            const evidenceForMission = myPendingEvidence.find(
              (evidence) => Number(evidence.missionId) === Number(mission.id)
            );
            return (
              <div
                key={mission.id}
                className="w-full h-auto flex flex-col justify-center gap-1 border p-3 rounded shadow"
              >
                <h3 className="text-sm font-semibold break-words">{mission.name}</h3>
                <p className="text-xs text-gray-700 break-words">Points: {mission.points}</p>
                {mission.evidenceRequired ? (
                  evidenceForMission ? (
                    <button
                      className="mt-2 w-full bg-gray-500 text-white text-xs py-1 rounded transition"
                      disabled
                    >
                      Evidence Submitted, Awaiting Approval
                    </button>
                  ) : (
                    <button
                      onClick={() => openEvidenceModal(mission.id)}
                      className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 rounded transition"
                    >
                      Complete with Evidence
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleComplete(mission.id)}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded transition"
                  >
                    Marcar como Completada
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
}  
export default MissionAleatoria;
