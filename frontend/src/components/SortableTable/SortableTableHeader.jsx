import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";

function SortableTableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSortChange,
}) {
  const isActive = sortField === field;
  const icon = isActive ? (
    sortDirection === "asc" ? (
      <ChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1" />
    )
  ) : null;

  const handleClick = () => {
    onSortChange(field);
  };

  return (
    <th
      onClick={handleClick}
      className={`p-2 border cursor-pointer select-none transition-colors duration-200 
        ${
          isActive
            
        } 
        rounded-md`}
    >
      <span className="flex items-center justify-start">
        {label}
        {icon}
      </span>
    </th>
  );
}

SortableTableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(["asc", "desc"]),
  onSortChange: PropTypes.func.isRequired,
};

export default SortableTableHeader;
