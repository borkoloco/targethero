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

  return <Doughnut data={data} />;
}

MissionTypesDoughnut.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataValues: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MissionTypesDoughnut;
