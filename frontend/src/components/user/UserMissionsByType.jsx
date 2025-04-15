import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import {
  fetchMissions,
  completeMission,
} from "../../redux/slices/missionsSlice";
import { fetchUserProfile } from "../../redux/slices/usersSlice";
import axios from "axios";
import EvidenceForm from "../common/EvidenceForm";
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
        const completedIds = response.data.map((mission) => mission.id);
        setCompletedMissionIds(completedIds);
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

  const filteredMissions = missions.filter((mission) => {
    const isTypeMatch = (missionTypes ?? []).includes(mission.type);
    const isNotCompleted = !completedMissionIds.includes(Number(mission.id));
    const isNotExpired =
      !mission.expiresAt || new Date(mission.expiresAt) >= new Date();

    return isTypeMatch && isNotCompleted && isNotExpired;
  });

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
        className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <h4 className="text-xl font-bold text-[#6e66f3] mb-2">
          {mission.name}
        </h4>
        <p className="text-gray-700 mb-1">{mission.description}</p>
        <h3 className="font-semibold text-[#fc875e] mb-3">
          Points: {mission.points}
        </h3>
        {mission.evidenceRequired ? (
          evidenceForMission ? (
            <button
              className="w-full bg-gray-400 text-white py-2 rounded-xl"
              disabled
            >
              Evidence Submitted
            </button>
          ) : (
            <button
              onClick={() => openEvidenceModal(mission.id)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl transition"
            >
              Complete with Evidence
            </button>
          )
        ) : (
          <button
            onClick={() => handleComplete(mission.id)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition"
          >
            Mark as Completed
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">{title}</h3>
      {filteredMissions.length === 0 ? (
        <p className="text-gray-500">No missions available in this category.</p>
      ) : filteredMissions.length === 1 ? (
        renderMissionCard(filteredMissions[0])
      ) : (
        <Swiper
          spaceBetween={20}
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
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 md:w-1/2">
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
              >
                ×
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
