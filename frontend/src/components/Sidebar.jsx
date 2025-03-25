import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="bg-gray-800 text-white transition-all duration-300 w-16 hover:w-64 overflow-hidden group">
      <nav className="flex flex-col">
        <SidebarItem to="/" icon="🏠" label="Dashboard" />
        {user?.role === "admin" ? (
          <>
            <SidebarItem to="/admin" icon="🛠️" label="Admin Dashboard" />
            <SidebarItem to="/reports/admin" icon="📊" label="Reports" />
          </>
        ) : (
          <>
            <SidebarItem to="/user" icon="👤" label="User Dashboard" />
            <SidebarItem to="/reports/user" icon="📈" label="My Reports" />
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
