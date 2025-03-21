import { useEffect, useState } from "react";
import axios from "axios";

function Badges() {
  const [Badges, setBadges] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/badges")
      .then((res) => {
        console.log("Datos de la API:", res.data);
        setBadges(res.data);
      })
      .catch((err) => console.error("Error al obtener insignias:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold mb-6">Insignias</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
        {Badges.map((badge) => (
          <div key={badge.id} className="border p-4 rounded-lg shadow-lg text-center bg-white">
            <img 
  src={`http://localhost:4000/assets/${badge.logoUrl}`} 
  alt={`Logo ${badge.name}`} 
  className="w-24 h-24 mx-auto mb-2"
  onError={(e) => e.target.src = "/fallback-image.png"} // Imagen de respaldo si falla
/>
            <h2 className="text-lg font-semibold">{badge.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Badges;