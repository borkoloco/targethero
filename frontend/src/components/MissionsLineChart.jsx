import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MissionsLineChart({ dataLabels, dataPoints }) {
  const data = {
    labels: dataLabels,
    datasets: [
      {
        label: "Mission Completions",
        data: dataPoints,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}

MissionsLineChart.propTypes = {
  dataLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MissionsLineChart;
