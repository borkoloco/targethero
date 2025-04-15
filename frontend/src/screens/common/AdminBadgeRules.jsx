import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../components/ScrollableTable";
import SortableTableHeader from "../components/SortableTableHeader";

function AdminBadgeRules() {
  const { token } = useSelector((state) => state.auth);
  const [rules, setRules] = useState([]);
  const [badges, setBadges] = useState([]);
  const [formData, setFormData] = useState({
    conditionType: "missions_completed",
    conditionValue: "diaria",
    threshold: 3,
    badgeId: "",
  });
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      const [rulesRes, badgesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/badge-rules`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/badges`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRules(rulesRes.data);
      setBadges(badgesRes.data);
    };

    if (token) fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/badge-rules`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const updatedRules = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/badge-rules`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRules(updatedRules.data);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRules = [...rules].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-8 font-sans">
      <h2 className="text-3xl font-extrabold text-[#6e66f3] mb-6">
        Badge Rules
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          value={formData.conditionType}
          onChange={(e) =>
            setFormData({ ...formData, conditionType: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="missions_completed">Missions Completed</option>
          <option value="total_revenue">Total Revenue</option>
          <option value="total_points">Total Points</option>
          <option value="clients_obtained">Clients Obtained</option>
          <option value="evidence_required">Evidence Submitted</option>
        </select>

        {(formData.conditionType === "missions_completed" ||
          formData.conditionType === "evidence_required") && (
          <input
            type="text"
            placeholder="Condition Value (e.g. diaria or missionId)"
            value={formData.conditionValue}
            onChange={(e) =>
              setFormData({ ...formData, conditionValue: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
        )}

        <input
          type="number"
          placeholder="Threshold"
          value={formData.threshold}
          onChange={(e) =>
            setFormData({ ...formData, threshold: parseInt(e.target.value) })
          }
          className="border p-2 rounded w-full"
          required
        />

        <select
          value={formData.badgeId}
          onChange={(e) =>
            setFormData({ ...formData, badgeId: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Select Badge</option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id}>
              {badge.name} ({badge.type})
            </option>
          ))}
        </select>

        <button className="bg-[#6e66f3] text-white px-4 py-2 rounded w-full">
          Create Rule
        </button>
      </form>

      <ScrollableTable>
        <thead className="sticky top-0 bg-[#fc875e] z-10 text-white">
          <tr>
            <SortableTableHeader
              label="Condition"
              field="conditionType"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Value</th>
            <th className="border p-2">Threshold</th>
            <th className="border p-2">Badge</th>
          </tr>
        </thead>
        <tbody>
          {sortedRules.map((rule) => (
            <tr key={rule.id}>
              <td className="border p-2 font-medium capitalize">
                {rule.conditionType.replace("_", " ")}
              </td>
              <td className="border p-2">{rule.conditionValue || "-"}</td>
              <td className="border p-2">{rule.threshold}</td>
              <td className="border p-2">{rule.badge?.name}</td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default AdminBadgeRules;
