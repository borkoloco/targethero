import { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD:frontend/src/screens/MainDashboard.jsx
import ProgressBar from "../components/Graphs/ProgressBar";
import MissionsLineChart from "../components/Graphs/MissionsLineChart";
import MissionTypesDoughnut from "../components/Graphs/MissionTypesDoughnut";
import MissionsList from "../components/Missions/MissionsList";
import Ranking from "../components/Users/Ranking";
import RecentEvents from "../components/Main/RecentEvents";
=======
import ProgressBar from "../../components/common/ProgressBar";
import MissionsLineChart from "../../components/common/MissionsLineChart";
import MissionTypesDoughnut from "../../components/common/MissionTypesDoughnut";
import MissionsList from "../../components/common/MissionsList";
import Ranking from "../../components/common/Ranking";
import RecentEvents from "../../components/common/RecentEvents";
import BadgeRulesOverview from "../../components/admin/BadgeRulesOverview";
>>>>>>> d78a76c85fc6a3b61591cd248d296dbf2019b4c9:frontend/src/screens/common/MainDashboard.jsx

function MainDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/dashboard/metrics"
        );
        setMetrics(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Error fetching dashboard metrics"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const lineChartDataLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const lineChartDataPoints = [5, 10, 7, 12];
  const doughnutLabels = [
    "Diaria",
    "Aleatoria",
    "Mensual",
    "Trimestral",
    "Bonus",
  ];
  const doughnutDataValues = [15, 20, 10, 5, 3];

  return (
    <div className="min-h-screen bg-[#f4edf3] p-8 font-sans">
      <h2 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide drop-shadow-lg">
        Global{" "}
        <span className="bg-[#6e66f3] text-white px-3 py-1 rounded-lg shadow-md">
          Dashboard
        </span>
      </h2>
      <br />

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <p className="text-lg font-semibold text-gray-700">
          Total Mission Completion Rate:{" "}
          <span className="text-[#fc875e]">
            {metrics.missionCompletionRate.toFixed(1)}%
          </span>
        </p>
        <p className="text-lg font-semibold text-gray-700 mt-2">
          Avg. Completions per Mission:{" "}
          <span className="text-[#6e66f3]">
            {metrics.averageCompletionsPerMission.toFixed(2)}
          </span>
        </p>
        <ProgressBar
          progress={metrics.billingProgress}
          label="Billing Progress"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <MissionsLineChart
            dataLabels={lineChartDataLabels}
            dataPoints={lineChartDataPoints}
          />
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <MissionTypesDoughnut
            labels={doughnutLabels}
            dataValues={doughnutDataValues}
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <MissionsList />
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <BadgeRulesOverview />
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <Ranking />
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <RecentEvents />
      </div>
    </div>
  );
}

export default MainDashboard;
