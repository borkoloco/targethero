import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMissions } from "../redux/slices/missionsSlice";
import socket from "./socket";

function RealTimeUpdater() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("missionCompleted", (data) => {
      console.log("missionCompleted event received:", data);
      dispatch(fetchMissions());
      //I could also update the local state directly if i have enough details.
    });
    socket.on("newMission", (mission) => {
      console.log("newMission event received:", mission);
      dispatch(fetchMissions());
    });

    return () => {
      socket.off("missionCompleted");
      socket.off("newMission");
    };
  }, [dispatch]);

  return null;
}

export default RealTimeUpdater;
