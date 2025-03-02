import PropTypes from "prop-types";

function ProgressBar({ progress, label }) {
  return (
    <div className="my-4">
      <p className="mb-1 font-semibold">
        {label}: {progress.toFixed(1)}%
      </p>
      <div className="w-full bg-gray-300 rounded h-4">
        <div
          className="bg-blue-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default ProgressBar;
