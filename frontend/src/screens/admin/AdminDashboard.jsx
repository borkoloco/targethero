import { useState } from "react";
<<<<<<< HEAD:frontend/src/screens/AdminDashboard.jsx
import UserManagement from "../components/Users/UserManagement";
import MissionManagement from "../components/Missions/MissionManagement";
import UserListWithClients from "../components/Users/UserListWithClients";
import EvidenceVerification from "../components/Evidence/EvidenceVerification";
import BadgeManagement from "../components/Badges/BadgeManagement";
import MarketManagement from "../components//Marketplace/MarketManagement";
import RevenueOverview from "../components/Revenue/RevenueOverview";
=======
import UserManagement from "./UserManagement";
import MissionManagement from "./MissionManagement";
import UserListWithClients from "../../components/admin/UserListWithClients";
import EvidenceVerification from "../../components/admin/EvidenceVerification";
import BadgeManagement from "./BadgeManagement";
import MarketManagement from "./MarketManagement";
import RevenueOverview from "../../components/admin/RevenueOverview";
>>>>>>> d78a76c85fc6a3b61591cd248d296dbf2019b4c9:frontend/src/screens/admin/AdminDashboard.jsx

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-[#f4edf3] p-6 font-sans">
      <h1 className="text-4xl font-extrabold text-[#6e66f3] uppercase tracking-wide mb-6 drop-shadow-lg">
        Admin{" "}
        <span className="bg-[#fc875e] text-white px-3 py-1 rounded-lg shadow-md">
          Dashboard
        </span>
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "users"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("missions")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "missions"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          Mission Management
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "badges"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          Badge Management
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "market"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          Market Management
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === "users" && (
          <>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <UserManagement />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <UserListWithClients />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <RevenueOverview />
            </div>
          </>
        )}

        {activeTab === "missions" && (
          <>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <MissionManagement />
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <EvidenceVerification />
            </div>
          </>
        )}

        {activeTab === "badges" && (
          <div className="p-6 bg-white rounded-2xl shadow-xl">
            <BadgeManagement />
          </div>
        )}

        {activeTab === "market" && (
          <div className="p-6 bg-white rounded-2xl shadow-xl">
            <MarketManagement />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
