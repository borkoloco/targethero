import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { fetchMissions, completeMission } from "../redux/slices/missionsSlice";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import EvidenceForm from "./EvidenceForm";
import axios from "axios";

function UserMissions() {
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

  const incompleteMissions = missions.filter(
    (mission) => !completedIds.includes(Number(mission.id))
  );

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {incompleteMissions.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold">
          No hay misiones disponibles en este momento.
        </p>
      ) : (
        incompleteMissions.map((mission) => {
          // Check if the current user has pending evidence for this mission
          const evidenceForMission = myPendingEvidence.find(
            (evidence) => Number(evidence.missionId) === Number(mission.id)
          );
          return (
            <div
              key={mission.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{mission.name}</h3>
              <p className="text-gray-700 mb-1">Type: {mission.type}</p>
              <p className="text-gray-700 mb-1">
                Description: {mission.description}
              </p>
              <p className="text-gray-700 mb-1">Points: {mission.points}</p>
              {mission.evidenceRequired ? (
                evidenceForMission ? (
                  <button
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded transition"
                    disabled
                  >
                    Evidence Submitted, Awaiting Approval
                  </button>
                ) : (
                  <button
                    onClick={() => openEvidenceModal(mission.id)}
                    className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition"
                  >
                    Complete with Evidence
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleComplete(mission.id)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                >
                  Marcar como Completada
                </button>
              )}
            </div>
          );
        })
      )}

      {/* Evidence Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>
            <EvidenceForm
              missionId={selectedMissionId}
              onEvidenceSubmitted={() => {
                closeModal();
                dispatch(fetchMissions());
                dispatch(fetchUserProfile());

                axios
                  .get(
                    import.meta.env.VITE_API_URL +
                      `/api/evidence/pending/${user.id}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                  .then((response) => setMyPendingEvidence(response.data))
                  .catch((err) =>
                    console.error("Error fetching pending evidence:", err)
                  );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMissions;
