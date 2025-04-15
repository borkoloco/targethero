import PropTypes from "prop-types";

function Pagination({ totalItems, pageSize, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const goTo = (page) => onPageChange(Math.max(1, Math.min(totalPages, page)));

  return (
    <nav className="flex justify-center mt-6 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => goTo(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40 bg-gray-100 hover:bg-gray-200"
      >
        Prev
      </button>   

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => goTo(i + 1)}
          className={`px-3 py-1 border rounded hover:bg-blue-100 ${
            currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => goTo(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40 bg-gray-100 hover:bg-gray-200"
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
