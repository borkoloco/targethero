import PropTypes from "prop-types";

function Pagination({ totalItems, pageSize, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const goTo = (page) => onPageChange(Math.max(1, Math.min(totalPages, page)));

  return (
    <nav className="flex justify-center mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => goTo(i + 1)}
          className={`px-2 py-1 border rounded ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  pageSize: 10,
};

export default Pagination;
