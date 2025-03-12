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
          <SidebarItem to="/evidence" icon="🔍" label="Evidece Dashboard" /> 
        </>
      ) : (
          <SidebarItem to="/user" icon="👤" label="User Dashboard" />
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
