import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";

import MainDashboard from "./screens/MainDashboard";
import AdminDashboard from "./screens/AdminDashboard";
import UserDashboard from "./screens/UserDashboard";
import BadgeDashboard from "./screens/BadgesDashboard"
import MissionsList from "./components/MissionsList";
import Ranking from "./components/Ranking";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);

  return ( 
    <Router>
      <Routes>
        {user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<MainDashboard />} />
            <Route path="missions" element={<MissionsList />} />
            <Route path="ranking" element={<Ranking />} />

            {user.role === "admin" ? (
              <Route path="admin" element={<AdminDashboard />} />
            ) : (
              <Route path="user" element={<UserDashboard />}/>,
                
              <Route path="badges" element={<BadgeDashboard />} />
            
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
