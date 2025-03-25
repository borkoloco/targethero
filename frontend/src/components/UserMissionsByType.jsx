import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { fetchMissions, completeMission } from "../redux/slices/missionsSlice";
import { fetchUserProfile } from "../redux/slices/usersSlice";
import axios from "axios";
import EvidenceForm from "./EvidenceForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function UserMissionsByType({ missionTypes, title }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { missions, status, error } = useSelector((state) => state.missions);
  const [pendingEvidence, setPendingEvidence] = useState([]);
  const [completedMissionIds, setCompletedMissionIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  useEffect(() => {
    dispatch(fetchMissions());
  }, [dispatch]);

  useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/missions/completed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCompletedMissionIds(response.data.map((id) => Number(id)));
      } catch (err) {
        console.error("Error fetching completed missions:", err);
      }
    };
    if (user && token) {
      fetchCompletedMissions();
    }
  }, [user, token, missions]);

  useEffect(() => {
    const fetchPendingEvidence = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/evidence/pending/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingEvidence(response.data);
      } catch (err) {
        console.error("Error fetching pending evidence:", err);
      }
    };
    if (user && token) {
      fetchPendingEvidence();
    }
  }, [user, token]);

  const filteredMissions = missions.filter(
    (mission) =>
      (missionTypes ?? []).includes(mission.type) &&
      !completedMissionIds.includes(Number(mission.id))
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

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/missions/completed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompletedMissionIds(response.data.map((id) => Number(id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEvidenceModal = (missionId) => {
    setSelectedMissionId(missionId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMissionId(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/evidence/pending/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPendingEvidence(response.data))
      .catch((err) => console.error("Error fetching pending evidence:", err));
  };

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const renderMissionCard = (mission) => {
    const evidenceForMission = pendingEvidence.find(
      (evidence) => Number(evidence.missionId) === Number(mission.id)
    );

    return (
      <div
        key={mission.id}
        className="p-4 border rounded shadow hover:shadow-lg transition bg-white"
      >
        <h4 className="text-lg font-semibold mb-2">{mission.name}</h4>
        <p className="text-gray-700 mb-1">{mission.description}</p>
        <p className="font-bold mb-2">Points: {mission.points}</p>
        {mission.evidenceRequired ? (
          evidenceForMission ? (
            <button
              className="w-full bg-gray-500 text-white py-2 rounded"
              disabled
            >
              Evidence Submitted, Awaiting Approval
            </button>
          ) : (
            <button
              onClick={() => openEvidenceModal(mission.id)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition"
            >
              Complete with Evidence
            </button>
          )
        ) : (
          <button
            onClick={() => handleComplete(mission.id)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
          >
            Mark as Completed
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {filteredMissions.length === 0 ? (
        <p className="text-gray-500">No missions available in this category.</p>
      ) : filteredMissions.length === 1 ? (
        renderMissionCard(filteredMissions[0])
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          modules={[Pagination]}
          pagination={{ clickable: true }}
        >
          {filteredMissions.map((mission) => (
            <SwiperSlide key={mission.id}>
              {renderMissionCard(mission)}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

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
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

UserMissionsByType.propTypes = {
  missionTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

UserMissionsByType.defaultProps = {
  missionTypes: [],
};

export default UserMissionsByType;
