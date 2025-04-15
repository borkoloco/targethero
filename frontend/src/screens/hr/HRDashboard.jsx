import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RecentEvents from "../../components/common/RecentEvents";

function HRDashboard() {
  const { token } = useSelector((state) => state.auth);
  const [userStats, setUserStats] = useState({ totalUsers: 0, avgSalary: 0 });
  const [salaryData, setSalaryData] = useState([]);
  const [error] = useState("");

  useEffect(() => {
    // Mocked
    const mockStats = {
      summary: {
        totalUsers: 18,
        avgSalary: 4200,
      },
      salaryDistribution: [
        { range: "< $2000", count: 2 },
        { range: "$2000 - $2999", count: 4 },
        { range: "$3000 - $3999", count: 6 },
        { range: "$4000 - $4999", count: 3 },
        { range: "$5000+", count: 3 },
      ],
    };

    setUserStats(mockStats.summary);
    setSalaryData(mockStats.salaryDistribution);
  }, [token]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#6e66f3]">HR Dashboard</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-xl">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Summary</h4>
          <ul className="space-y-1 text-gray-700">
            <li>Total Users: {userStats.totalUsers}</li>
            <li>Average Salary: ${userStats.avgSalary}</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-xl">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Salary Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6e66f3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <RecentEvents />
    </div>
  );
}

export default HRDashboard;
