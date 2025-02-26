import { useState } from "react";
import UserManagement from "../components/UserManagement";
import MissionManagement from "../components/MissionManagement";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 border-b">
        <button
          onClick={() => setActiveTab("users")}
          className={`mr-4 pb-2 ${
            activeTab === "users"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("missions")}
          className={`pb-2 ${
            activeTab === "missions"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          Mission Management
        </button>
      </div>

      <div>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "missions" && <MissionManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;

// function AdminDashboard() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold">Admin Dashboard</h2>
//     </div>
//   );
// }

// export default AdminDashboard;
