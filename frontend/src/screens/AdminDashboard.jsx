import { useState } from "react";
import UserManagement from "../components/UserManagement";
import MissionManagement from "../components/MissionManagement";
import UserListWithClients from "../components/UserListWithClients";
import EvidenceVerification from "../components/EvidenceVerification";
import BadgeManagement from "../components/BadgeManagement";
import MarketManagement from "../components/MarketManagement";
import RevenueOverview from "../components/RevenueOverview";

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

// import { useState } from "react";
// import UserManagement from "../components/UserManagement";
// import MissionManagement from "../components/MissionManagement";
// import UserListWithClients from "../components/UserListWithClients";
// import EvidenceVerification from "../components/EvidenceVerification";
// import BadgeManagement from "../components/BadgeManagement";
// import MarketManagement from "../components/MarketManagement";
// import RevenueOverview from "../components/RevenueOverview";

// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("users");

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
//       <div className="mb-4 border-b">
//         <button
//           onClick={() => setActiveTab("users")}
//           className={`mr-4 pb-2 ${
//             activeTab === "users"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-600"
//           }`}
//         >
//           User Management
//         </button>
//         <button
//           onClick={() => setActiveTab("missions")}
//           className={`mr-4 pb-2 ${
//             activeTab === "missions"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-600"
//           }`}
//         >
//           Mission Management
//         </button>
//         <button
//           onClick={() => setActiveTab("badges")}
//           className={`mr-4 pb-2 ${
//             activeTab === "badges"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-600"
//           }`}
//         >
//           Badge Management
//         </button>
//         <button
//           onClick={() => setActiveTab("market")}
//           className={`mr-4 pb-2 ${
//             activeTab === "market"
//               ? "border-b-2 border-blue-500 text-blue-500"
//               : "text-gray-600"
//           }`}
//         >
//           Market Management
//         </button>
//       </div>

//       <div>
//         {activeTab === "users" && (
//           <>
//             <UserManagement />
//             <UserListWithClients />
//             <RevenueOverview />
//           </>
//         )}
//         {activeTab === "missions" && (
//           <>
//             <MissionManagement />
//             <EvidenceVerification />
//           </>
//         )}
//         {activeTab === "badges" && <BadgeManagement />}
//         {activeTab === "market" && <MarketManagement />}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
