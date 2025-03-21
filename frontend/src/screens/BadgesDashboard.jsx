import { useState } from "react";
import Badges from "../components/Badges"; 

function BadgesDashboard() {
  const [activeTab, setActiveTab] = useState("all"); 

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Insignias</h1>
      <div className="flex justify-center mb-4">
        <button 
          className={`px-4 py-2 mx-2 text-lg font-semibold rounded-lg ${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          
        </button>
        
      </div>
      <div className="mt-4">
        {activeTab === "all" ? (
          <Badges /> 
        ) : (
          <p className="text-center text-gray-600 text-lg">Aquí irían las insignias del usuario...</p>
        )}
      </div>
    </div>
  );
}

export default BadgesDashboard;
