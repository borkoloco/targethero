import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="bg-[#6e66f3] text-white transition-all duration-300 w-16 hover:w-64 overflow-hidden group shadow-lg">
      <nav className="flex flex-col">
        {/* Ítem de Dashboard común */}
        <SidebarItem to="/" icon="🏠" label="Dashboard" />

        {/* Mostrar opciones basadas en el rol del usuario */}
        {user?.role === "admin" ? (
          <>
            {/* SideBar para administradores */}
            <SidebarItem to="/admin" icon="🛠️" label="Admin Dashboard" />
            <SidebarItem to="/reports/admin" icon="📊" label="Reports" />
          </>
        ) : (
          <>
            {/* SideBar para usuarios */}
            <SidebarItem to="/user" icon="👤" label="User Dashboard" />
            <SidebarItem to="/reports/user" icon="📈" label="My Reports" />
          </>
        )}
      </nav>
    </aside>
  );
}



export default Sidebar;
