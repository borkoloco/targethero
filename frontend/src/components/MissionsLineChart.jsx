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
        borderColor: "#6e66f3",
        backgroundColor: "rgba(110,102,243,0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-center text-[#6e66f3] mb-4 drop-shadow">
        Mission Completion Trends
      </h3>
      <Line data={data} />
    </div>
  );
}

MissionsLineChart.propTypes = {
  dataLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MissionsLineChart;
