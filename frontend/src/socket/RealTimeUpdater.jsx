import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";
import socket from "./socket";
import { toast } from "react-toastify";

function RealTimeUpdater() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("missionCompleted", ({ missionId, completer }) => {
      console.log("missionCompleted event received:", missionId);
      dispatch(fetchMissions());

      if (completer) {
        toast.success(`${completer} completed a mission! 🎯`);
      } else {
        toast.success(`A mission was completed!`);
      }
    });

    socket.on("newMission", (mission) => {
      console.log("newMission event received:", mission);
      dispatch(fetchMissions());
      toast.info(`New mission available: ${mission.name}`);
    });

    return () => {
      socket.off("missionCompleted");
      socket.off("newMission");
    };
  }, [dispatch]);

  return null;
}

export default RealTimeUpdater;
