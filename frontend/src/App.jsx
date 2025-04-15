import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
import Layout from "./components/WebBasics/Layout";
import MainDashboard from "./screens/MainDashboard";
import AdminDashboard from "./screens/AdminDashboard";
import UserDashboard from "./screens/UserDashboard";
import MissionsList from "./components//Missions/MissionsList";
import UserReports from "./screens/UserReports";
import AdminReports from "./screens/AdminReports";
import Ranking from "./components/Users/Ranking";
import MarketManagement from "./components/Marketplace/MarketManagement";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Marketplace from "./components/Marketplace/Marketplace";
=======
import Layout from "./components/common/Layout";
import MainDashboard from "./screens/common/MainDashboard";
import AdminDashboard from "./screens/admin/AdminDashboard";
import UserDashboard from "./screens/user/UserDashboard";
import HRDashboard from "./screens/hr/HRDashboard";
import HRReports from "./screens/hr/HRReports";
import MissionsList from "./components/common/MissionsList";
import UserReports from "./screens/user/UserReports";
import AdminReports from "./screens/admin/AdminReports";
import Ranking from "./components/common/Ranking";
import MarketManagement from "./screens/admin/MarketManagement";
import HRManagement from "./screens/hr/HRManagement";
import Login from "./screens/common/Login";
import Register from "./screens/common/Register";
import Marketplace from "./screens/user/Marketplace";
>>>>>>> d78a76c85fc6a3b61591cd248d296dbf2019b4c9
import { useSelector } from "react-redux";
import HRNotifications from "./screens/hr/HRNotifications";
import HumaneResources from "./screens/user/HumaneResources";
import AdminHumaneResources from "./screens/admin/AdminHumaneResources";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<MainDashboard />} />
            <Route path="missions" element={<MissionsList />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="humane-resources" element={<HumaneResources />} />

            <Route path="ranking" element={<Ranking />} />
            {user.role === "admin" ? (
              <>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/market" element={<MarketManagement />} />
                <Route path="reports/admin" element={<AdminReports />} />
                <Route
                  path="admin/humane-resources"
                  element={<AdminHumaneResources />}
                />
              </>
            ) : user.role === "hr" ? (
              <>
                <Route path="hr" element={<HRDashboard />} />
                <Route path="reports/hr" element={<HRReports />} />
                <Route path="hr-management" element={<HRManagement />} />
                <Route path="notifications" element={<HRNotifications />} />
              </>
            ) : (
              <>
                <Route path="user" element={<UserDashboard />} />
                <Route path="reports/user" element={<UserReports />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
