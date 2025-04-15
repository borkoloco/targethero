import {
  Home,
  Wrench,
  BarChart2,
  User,
  LineChart,
  ShoppingCart,
  Bell,
  Users,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="bg-[#6e66f3] text-white w-20 hover:w-64 transition-all duration-300 overflow-hidden shadow-lg min-h-screen font-sans group">
      <nav className="flex flex-col p-4 space-y-2">
        {user?.role === "admin" && (
          <>
            <SidebarItem to="/" icon={<Home size={22} />} label="Dashboard" />
            <SidebarItem
              to="/admin"
              icon={<Wrench size={22} />}
              label="Admin Dashboard"
            />
            <SidebarItem
              to="/reports/admin"
              icon={<BarChart2 size={22} />}
              label="Reports"
            />
            <SidebarItem
              to="/admin/humane-resources"
              icon={<FileText size={22} />}
              label="Humane Resources"
            />
          </>
        )}

        {user?.role === "user" && (
          <>
            <SidebarItem to="/" icon={<Home size={22} />} label="Dashboard" />
            <SidebarItem
              to="/user"
              icon={<User size={22} />}
              label="User Dashboard"
            />
            <SidebarItem
              to="/reports/user"
              icon={<LineChart size={22} />}
              label="My Reports"
            />
            <SidebarItem
              to="/marketplace"
              icon={<ShoppingCart size={22} />}
              label="Marketplace"
            />
            <SidebarItem
              to="/humane-resources"
              icon={<FileText size={22} />}
              label="Humane Resources"
            />
          </>
        )}

        {user?.role === "hr" && (
          <>
            <SidebarItem
              to="/hr"
              icon={<Home size={22} />}
              label="HR Dashboard"
            />

            <SidebarItem
              to="/hr-management"
              icon={<Users size={22} />}
              label="HR Management"
            />
            <SidebarItem
              to="/notifications"
              icon={<Bell size={22} />}
              label="Notifications"
            />
            <SidebarItem
              to="/reports/hr"
              icon={<BarChart2 size={22} />}
              label="Reports"
            />
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
