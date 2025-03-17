import { useEffect, useState } from "react";
import axios from "axios";
import ProgressBar from "../components/ProgressBar";
import MissionsLineChart from "../components/MissionsLineChart";
import MissionTypesDoughnut from "../components/MissionTypesDoughnut";
import MissionsList from "../components/MissionsList";
import Ranking from "../components/Ranking";

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

  // Dummy data for charts; replace with real data from metrics if available.
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Global Dashboard</h2>
      {/* Metrics Section */}
      <div className="mb-4">
        <p className="font-semibold">
          Total Mission Completion Rate:{" "}
          {metrics.missionCompletionRate.toFixed(1)}%
        </p>
        <ProgressBar
          progress={metrics.billingProgress}
          label="Billing Progress"
        />
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <MissionsLineChart
            dataLabels={lineChartDataLabels}
            dataPoints={lineChartDataPoints}
          />
        </div>
        <div className="border p-4 rounded">
          <MissionTypesDoughnut
            labels={doughnutLabels}
            dataValues={doughnutDataValues}
          />
        </div>
      </div>
      {/* Missions List Section */}
      <MissionsList />
      {/* Ranking Section */}
      <div className="mt-4 border p-4 rounded">
        <Ranking />
      </div>
      {/* Latest Activity Section */}
      <div className="mt-4 border p-4 rounded">
        <h3 className="font-semibold mb-2">Latest Activity</h3>
        <p>No new notifications.</p>
      </div>
    </div>
  );
}

export default MainDashboard;
