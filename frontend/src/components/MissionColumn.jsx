import { useEffect, useState } from "react";
import axios from "axios";

function MissionColumn(){
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMissions = async () => {
        try {
          const response = await axios.get("http://localhost:4000/api/Missions");
          setMissions(response.data);
        } catch (err) {
          console.error(err);
          setError("Error fetching missions");
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchMissions();
      }, []);

    if (loading) return <p>Loading missions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return(
        <table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-200">
      
      <th className="border p-2">Type</th>
      <th className="border p-2">Description</th>
      <th className="border p-2">Points</th>
      <th className="border p-2">RUN</th>
      <th className="border p-2">Status</th>
     
    </tr>
  </thead>
  <tbody>
    {missions.map((mission) => (
      <tr key={mission.id}>
        <td className="border p-2">{mission.type}</td>
        
        <td className="border p-2">{mission.description}</td>
        <td className="border p-2">{mission.points}</td>
        <td className="border p-2"> 
          <button className="w-full py-1 px-2 bg-blue-500 text white rounded">Completado</button>
        </td>
       
        <td className="border p-2">{mission.status}</td>
        <td className="border p-2">
         
        </td>
      </tr>
    ))}
  </tbody>
</table>

    );
}

export default MissionColumn;