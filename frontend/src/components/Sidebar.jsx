import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="bg-gray-700 text-white transition-all duration-300 w-16 hover:w-64 overflow-hidden">
      <nav className="flex flex-col">
        <SidebarItem to="/" icon="🏠" label="Dashboard" />
        {user?.role === "admin" ? (
          <>
            <SidebarItem to="/admin" icon="🛠️" label="Admin Dashboard" />
          </>
        ) : (
        <>
          <SidebarItem to="/user" icon="👤" label="User Dashboard" />
          <SidebarItem to="/badges" icon="🎖️" label = "Insignias"/>

        </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
