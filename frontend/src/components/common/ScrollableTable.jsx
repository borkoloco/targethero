import PropTypes from "prop-types";

function ScrollableTable({ children, maxHeight = "300px" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow overflow-hidden border border-gray-200  overflow-y-auto`}
      style={{ maxHeight }}
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
