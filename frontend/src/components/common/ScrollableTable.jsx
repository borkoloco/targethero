import PropTypes from "prop-types";

function ScrollableTable({ children, maxHeight = "max-h-96" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow overflow-hidden border border-gray-200 ${maxHeight} overflow-y-auto`}
    >
      <table className="w-full text-sm text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

ScrollableTable.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
};

export default ScrollableTable;
