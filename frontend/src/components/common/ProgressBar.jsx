import PropTypes from "prop-types";

function ProgressBar({ progress, label }) {
  return (
    <div className="my-4">
      <p className="mb-2 font-semibold text-[#6e66f3] drop-shadow">
        {label}: <span className="text-[#fc875e]">{progress.toFixed(1)}%</span>
      </p>
      <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
        <div
          className="bg-gradient-to-r from-[#6e66f3] to-[#fc875e] h-4 rounded-full transition-all duration-500 ease-out"
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
