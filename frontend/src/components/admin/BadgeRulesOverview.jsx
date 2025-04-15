import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function BadgeRulesOverview() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/badge-rules",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRules(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching badge rules");
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  if (loading) return <p>Loading badge rules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Badge Rules Overview
      </h3>
      {rules.length === 0 ? (
        <p>No badge rules defined yet.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-[#fc875e] text-white">
            <tr>
              <th className="p-2 border">Badge</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Value</th>
              <th className="p-2 border">Expires</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-100">
                <td className="border p-2">{rule.badge?.name}</td>
                <td className="border p-2 capitalize">{rule.condition}</td>
                <td className="border p-2">{rule.value}</td>
                <td className="border p-2 capitalize">{rule.badge?.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BadgeRulesOverview;
