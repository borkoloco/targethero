import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function SidebarItem({ to, icon, label }) {
  return (
    <Link to={to} className="group flex items-center p-4 hover:bg-gray-600">
      <span className="text-xl">{icon}</span>

      <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
