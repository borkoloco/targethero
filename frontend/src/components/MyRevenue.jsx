import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function MyRevenue() {
  const { token } = useSelector((state) => state.auth);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/revenue/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRevenue(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching revenue");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [token]);

  if (loading) return <p>Loading revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">My Revenue</h3>
      {revenue.length === 0 ? (
        <p>No revenue records found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {revenue.map((record) => (
              <tr key={record.id}>
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

export default MyRevenue;
