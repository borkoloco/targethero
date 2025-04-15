import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

const API = import.meta.env.VITE_API_URL;

function BadgeRulesList() {
  const [rules, setRules] = useState([]);
  const [badges, setBadges] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    conditionType: "missions_completed",
    conditionValue: "",
    threshold: 1,
    badgeId: "",
  });
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchRules();
    fetchBadges();
  }, []);

  const fetchRules = async () => {
    const res = await axios.get(`${API}/api/badge-rules`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRules(res.data);
  };

  const fetchBadges = async () => {
    const res = await axios.get(`${API}/api/badges`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBadges(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/api/badge-rules`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFormOpen(false);
    fetchRules();
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
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#6e66f3]">Badge Rules</h2>
        <button
          onClick={() => setFormOpen(true)}
          className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded-xl transition"
        >
          Create Rule
        </button>
      </div>

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
              <td className="border p-2 capitalize">
                {rule.conditionType.replace("_", " ")}
              </td>
              <td className="border p-2">{rule.conditionValue || "-"}</td>
              <td className="border p-2">{rule.threshold}</td>
              <td className="border p-2">{rule.badge?.name}</td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <ModalWrapper
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Create Badge Rule"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="conditionType"
            value={formData.conditionType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="missions_completed">Missions Completed</option>
            <option value="total_revenue">Total Revenue</option>
            <option value="total_points">Total Points</option>
            <option value="clients_obtained">Clients Obtained</option>
            <option value="evidence_required">Evidence Required</option>
          </select>

          {(formData.conditionType === "missions_completed" ||
            formData.conditionType === "evidence_required") && (
            <input
              name="conditionValue"
              value={formData.conditionValue}
              onChange={handleChange}
              placeholder="Mission type or mission ID"
              className="w-full border p-2 rounded"
            />
          )}

          <input
            name="threshold"
            type="number"
            value={formData.threshold}
            onChange={handleChange}
            placeholder="Threshold"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="badgeId"
            value={formData.badgeId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Badge</option>
            {badges.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
          >
            Save Rule
          </button>
        </form>
      </ModalWrapper>
    </div>
  );
}

export default BadgeRulesList;
