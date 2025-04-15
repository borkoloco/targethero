import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(ArcElement, Tooltip, Legend);

function MissionTypesDoughnut({ labels, dataValues }) {
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-center text-[#6e66f3] mb-4 drop-shadow">
        Mission Types
      </h3>
      <Doughnut data={data} />
    </div>
  );
}

MissionTypesDoughnut.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataValues: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MissionTypesDoughnut;
