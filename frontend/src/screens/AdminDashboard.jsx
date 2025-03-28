import { useState } from "react";
import UserManagement from "../components/UserManagement";
import MissionManagement from "../components/MissionManagement";
import UserListWithClients from "../components/UserListWithClients";
import EvidenceVerification from "../components/EvidenceVerification";
import RevenueAdmin from "../components/RevenueAdmin";
import ClientAprove from "../components/ClientAprove"
import BadgeManagement from "../components/BadgeManagement"; // 👈 new

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-6 space-y-8 bg-[#f4edf3] min-h-screen">
      {/* Título con diseño especial */}
      <h1 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide drop-shadow-lg">
        Admin <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">Dashboard</span>
      </h1>
  
      {/* Tabs con diseño mejorado */}
      <div className="flex space-x-4 border-b-2 border-gray-300 pb-2">
        {[
          { key: "users", label: "User Management" },
          { key: "missions", label: "Mission Management" },
          { key: "badges", label: "Badge Management" },
          { key:"aproval", label:"Pendings" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-5 text-lg font-semibold rounded-t-lg transition-all ${
              activeTab === tab.key
                ? "bg-[#6e66f3] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
  
      {/* Contenido de cada tab */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        {activeTab === "users" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#6e66f3]">Manage Users</h3>
            <UserManagement />
            <UserListWithClients />
          
          </div>
        )}
  
        {activeTab === "missions" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#6e66f3]">Manage Missions</h3>
            <MissionManagement />
          </div>
        )}
  
        {activeTab === "badges" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#6e66f3]">Manage Badges</h3>
            <BadgeManagement />
          </div>
        )}
        
        {activeTab === "aproval" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#6e66f3]">Pendings</h3>
            <EvidenceVerification />
            <RevenueAdmin/>
            <ClientAprove/>
          </div>
        )}


      </div>
    </div>
  );
}

export default AdminDashboard;
