function MissionDetail() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Mission Detail</h2>
    </div>
  );
}

export default MissionDetail;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMissionDetail,
//   clearMissionDetail,
// } from "../redux/slices/missionsSlice";
// import { useParams } from "react-router-dom";

// function MissionDetail() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { missionDetail, detailStatus, detailError } = useSelector(
//     (state) => state.missions
//   );

//   useEffect(() => {
//     dispatch(fetchMissionDetail(id));

//     return () => {
//       dispatch(clearMissionDetail());
//     };
//   }, [dispatch, id]);

//   if (detailStatus === "loading") return <p>Loading mission details...</p>;
//   if (detailStatus === "failed")
//     return <p className="text-red-500">{detailError}</p>;
//   if (!missionDetail) return <p>Mission not found</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Mission Detail</h2>
//       <div className="border p-4 rounded mb-4">
//         <h3 className="text-xl font-semibold">{missionDetail.description}</h3>
//         <p>Type: {missionDetail.type}</p>
//         <p>Points: {missionDetail.points}</p>
//       </div>
//       {/* Form to submit evidence for mission completion goes here */}
//     </div>
//   );
// }

// export default MissionDetail;
