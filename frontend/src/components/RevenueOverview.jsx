import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function RevenueOverview() {
  const { token } = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRevenueByUser = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/revenue",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching revenue");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueByUser();
  }, [token]);

  if (loading) return <p>Loading revenue overview...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
      {records.length === 0 ? (
        <p>No revenue records found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.user?.name}</td>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border p-2">${record.amount}</td>
                <td className="border p-2">{record.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RevenueOverview;
