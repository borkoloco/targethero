import PropTypes from "prop-types";

function ScrollableTable({ children, maxHeight = "max-h-96" }) {
  return (
    <div className={`${maxHeight} overflow-y-auto`}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

ScrollableTable.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
};

export default ScrollableTable;
