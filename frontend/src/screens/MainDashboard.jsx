function MainDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Main Dashboard</h2>
    </div>
  );
}

export default MainDashboard;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProgressBar from "../components/ProgressBar";
// import MissionsLineChart from "../components/MissionsLineChart";
// import MissionTypesDoughnut from "../components/MissionTypesDoughnut";

// function MainDashboard() {
//   const [metrics, setMetrics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/dashboard/metrics"
//         );
//         setMetrics(response.data);
//       } catch (err) {
//         setError(
//           err.response?.data?.error || "Error fetching dashboard metrics"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMetrics();
//   }, []);

//   if (loading) return <p>Loading dashboard...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   // For demonstration, we will create dummy data for the line and doughnut charts.
//   // In a real scenario, you would aggregate these values on the backend.
//   const lineChartDataLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
//   const lineChartDataPoints = [5, 10, 7, 12]; // Example completions per week

//   const doughnutLabels = [
//     "Diaria",
//     "Aleatoria",
//     "Mensual",
//     "Trimestral",
//     "Bonus",
//   ];
//   const doughnutDataValues = [15, 20, 10, 5, 3]; // Example distribution counts

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
//       {/* Key metrics */}
//       <div className="mb-4">
//         <p className="font-semibold">
//           Total Mission Completion Rate:{" "}
//           {metrics.missionCompletionRate.toFixed(1)}%
//         </p>
//         <ProgressBar
//           progress={metrics.billingProgress}
//           label="Billing Progress"
//         />
//       </div>
//       {/* Charts */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border p-4 rounded">
//           <MissionsLineChart
//             dataLabels={lineChartDataLabels}
//             dataPoints={lineChartDataPoints}
//           />
//         </div>
//         <div className="border p-4 rounded">
//           <MissionTypesDoughnut
//             labels={doughnutLabels}
//             dataValues={doughnutDataValues}
//           />
//         </div>
//       </div>
//       {/* Notifications or latest activity section */}
//       <div className="mt-4 border p-4 rounded">
//         <h3 className="font-semibold mb-2">Latest Activity</h3>
//         <p>No new notifications.</p>
//       </div>
//     </div>
//   );
// }

// export default MainDashboard;
