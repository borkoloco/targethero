// src/components/MissionManagement.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchMissions } from "../redux/slices/missionsSlice";

function MissionManagement() {
  const dispatch = useDispatch();
  const { missions, status, error } = useSelector((state) => state.missions);

  // Local state for the mission form
  const [formData, setFormData] = useState({
    name: "",
    type: "diaria",
    description: "",
    points: 0,
  });
  const [editMissionId, setEditMissionId] = useState(null);

  // Fetch missions from the Redux slice when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMissions());
    }
  }, [dispatch, status]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMissionId) {
        // Update mission via backend
        await axios.put(
          `http://localhost:4000/api/missions/update/${editMissionId}`,
          formData
        );
      } else {
        // Create mission via backend
        await axios.post("http://localhost:4000/api/missions/create", formData);
      }
      // Reset form and clear edit ID
      setFormData({ name: "", type: "diaria", description: "", points: 0 });
      setEditMissionId(null);
      // Refresh missions list from Redux
      dispatch(fetchMissions());
    } catch (err) {
      console.error(err);
      // Optionally, you could display a local error message here
    }
  };

  const handleEdit = (mission) => {
    setEditMissionId(mission.id);
    setFormData({
      name: mission.name,
      type: mission.type,
      description: mission.description,
      points: mission.points,
    });
  };

  const handleDelete = async (missionId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/missions/deleteMission/${missionId}`
      );
      dispatch(fetchMissions());
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") return <p>Loading missions...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mission Management</h2>
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
        <h3 className="font-semibold mb-2">
          {editMissionId ? "Edit Mission" : "Create New Mission"}
        </h3>
        {/* Input for mission name */}
        <div className="mb-2">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        {/* Input for mission type */}
        <div className="mb-2">
          <label className="block mb-1">Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="diaria">Diaria</option>
            <option value="aleatoria">Aleatoria</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="bonus">Bonus Track</option>
          </select>
        </div>
        {/* Input for mission description */}
        <div className="mb-2">
          <label className="block mb-1">Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        {/* Input for mission points */}
        <div className="mb-2">
          <label className="block mb-1">Points:</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {editMissionId ? "Update Mission" : "Create Mission"}
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Points</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => (
            <tr key={mission.id}>
              <td className="border p-2">{mission.id}</td>
              <td className="border p-2">{mission.name}</td>
              <td className="border p-2">{mission.type}</td>
              <td className="border p-2">{mission.description}</td>
              <td className="border p-2">{mission.points}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(mission)}
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mission.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MissionManagement;

// import { useEffect, useState } from "react";
// import axios from "axios";

// function MissionManagement() {
//   const [missions, setMissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   // Added "name" field to the state
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "diaria",
//     description: "",
//     points: 0,
//   });
//   const [editMissionId, setEditMissionId] = useState(null);

//   const fetchMissions = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:4000/api/missions/all"
//       );
//       console.log(response.data);
//       setMissions(response.data);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching missions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMissions();
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMissionId) {
//         // Update mission
//         await axios.put(
//           `http://localhost:4000/api/missions/${editMissionId}`,
//           formData
//         );
//       } else {
//         // Create mission
//         await axios.post("http://localhost:4000/api/missions/create", formData);
//       }
//       setFormData({ name: "", type: "diaria", description: "", points: 0 });
//       setEditMissionId(null);
//       fetchMissions();
//     } catch (err) {
//       console.error(err);
//       setError("Error creating/updating mission");
//     }
//   };

//   const handleEdit = (mission) => {
//     setEditMissionId(mission.id);
//     setFormData({
//       name: mission.name,
//       type: mission.type,
//       description: mission.description,
//       points: mission.points,
//     });
//   };

//   const handleDelete = async (missionId) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/missions/${missionId}`);
//       fetchMissions();
//     } catch (err) {
//       console.error(err);
//       setError("Error deleting mission");
//     }
//   };

//   if (loading) return <p>Loading missions...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Mission Management</h2>
//       <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
//         <h3 className="font-semibold mb-2">
//           {editMissionId ? "Edit Mission" : "Create New Mission"}
//         </h3>
//         {/* New input for the mission name */}
//         <div className="mb-2">
//           <label className="block mb-1">Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//             required
//           />
//         </div>
//         <div className="mb-2">
//           <label className="block mb-1">Type:</label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//           >
//             <option value="diaria">Diaria</option>
//             <option value="aleatoria">Aleatoria</option>
//             <option value="mensual">Mensual</option>
//             <option value="trimestral">Trimestral</option>
//             <option value="bonus">Bonus Track</option>
//           </select>
//         </div>
//         <div className="mb-2">
//           <label className="block mb-1">Description:</label>
//           <input
//             type="text"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//             required
//           />
//         </div>
//         <div className="mb-2">
//           <label className="block mb-1">Points:</label>
//           <input
//             type="number"
//             name="points"
//             value={formData.points}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-green-500 text-white p-2 rounded w-full"
//         >
//           {editMissionId ? "Update Mission" : "Create Mission"}
//         </button>
//       </form>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Type</th>
//             <th className="border p-2">Description</th>
//             <th className="border p-2">Points</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {missions.map((mission) => (
//             <tr key={mission.id}>
//               <td className="border p-2">{mission.id}</td>
//               <td className="border p-2">{mission.name}</td>
//               <td className="border p-2">{mission.type}</td>
//               <td className="border p-2">{mission.description}</td>
//               <td className="border p-2">{mission.points}</td>
//               <td className="border p-2">
//                 <button
//                   onClick={() => handleEdit(mission)}
//                   className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(mission.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default MissionManagement;

// import { useEffect, useState } from "react";
// import axios from "axios";

// function MissionManagement() {
//   const [missions, setMissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     type: "diaria",
//     description: "",
//     points: 0,
//   });
//   const [editMissionId, setEditMissionId] = useState(null);

//   const fetchMissions = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:4000/api/missions/all"
//       );
//       console.log(response.data);
//       setMissions(response.data);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching missions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMissions();
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMissionId) {
//         // Update mission
//         await axios.put(
//           `http://localhost:4000/api/missions/${editMissionId}`,
//           formData
//         );
//       } else {
//         // Create mission
//         await axios.post("http://localhost:4000/api/missions/create", formData);
//       }
//       setFormData({ type: "diaria", description: "", points: 0 });
//       setEditMissionId(null);
//       fetchMissions();
//     } catch (err) {
//       console.error(err);
//       setError("Error creating/updating mission");
//     }
//   };

//   const handleEdit = (mission) => {
//     setEditMissionId(mission.id);
//     setFormData({
//       type: mission.type,
//       description: mission.description,
//       points: mission.points,
//     });
//   };

//   const handleDelete = async (missionId) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/missions/${missionId}`);
//       fetchMissions();
//     } catch (err) {
//       console.error(err);
//       setError("Error deleting mission");
//     }
//   };

//   if (loading) return <p>Loading missions...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Mission Management</h2>
//       <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
//         <h3 className="font-semibold mb-2">
//           {editMissionId ? "Edit Mission" : "Create New Mission"}
//         </h3>
//         <div className="mb-2">
//           <label className="block mb-1">Type:</label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//           >
//             <option value="diaria">Diaria</option>
//             <option value="aleatoria">Aleatoria</option>
//             <option value="mensual">Mensual</option>
//             <option value="trimestral">Trimestral</option>
//             <option value="bonus">Bonus Track</option>
//           </select>
//         </div>
//         <div className="mb-2">
//           <label className="block mb-1">Description:</label>
//           <input
//             type="text"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//             required
//           />
//         </div>
//         <div className="mb-2">
//           <label className="block mb-1">Points:</label>
//           <input
//             type="number"
//             name="points"
//             value={formData.points}
//             onChange={handleChange}
//             className="border p-1 rounded w-full"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-green-500 text-white p-2 rounded w-full"
//         >
//           {editMissionId ? "Update Mission" : "Create Mission"}
//         </button>
//       </form>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Type</th>
//             <th className="border p-2">Description</th>
//             <th className="border p-2">Points</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {missions.map((mission) => (
//             <tr key={mission.id}>
//               <td className="border p-2">{mission.id}</td>
//               <td className="border p-2">{mission.type}</td>
//               <td className="border p-2">{mission.description}</td>
//               <td className="border p-2">{mission.points}</td>
//               <td className="border p-2">
//                 <button
//                   onClick={() => handleEdit(mission)}
//                   className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(mission.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default MissionManagement;
