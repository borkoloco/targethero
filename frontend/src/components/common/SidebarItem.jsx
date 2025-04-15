import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function SidebarItem({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`group flex items-center space-x-4 p-3 rounded-xl transition duration-200 ${
        isActive ? "bg-[#5d57db]" : "hover:bg-[#5d57db]"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="whitespace-nowrap text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">
        {label}
      </span>
    </Link>
  );
}

SidebarItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export default SidebarItem;
