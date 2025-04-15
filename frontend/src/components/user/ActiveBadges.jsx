import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../common/ModalWrapper";
import axios from "axios";

function ActiveBadges() {
  const { user, token } = useSelector((state) => state.auth);
  const [rules, setRules] = useState([]);
  const [submittedEvidence, setSubmittedEvidence] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rulesRes, evidenceRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/badge-rules`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/badge-evidence/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRules(rulesRes.data);
        setSubmittedEvidence(evidenceRes.data);
      } catch (err) {
        console.error("Error loading badge rules or evidence:", err);
      }
    };

    if (user?.id && token) {
      fetchData();
    }
  }, [user?.id, token]);

  const openEvidenceModal = (rule) => {
    setSelectedRule(rule);
    setFile(null);
    setComment("");
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitEvidence = async () => {
    if (!file || !selectedRule) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("evidence", file);
    formData.append("comment", comment);
    formData.append("badgeRuleId", selectedRule.id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/badge-evidence`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmittedEvidence((prev) => [...prev, res.data]);
      setModalOpen(false);
    } catch (err) {
      console.error("Error submitting evidence:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getEvidenceStatusForRule = (ruleId) => {
    const evidence = submittedEvidence.find((ev) => ev.badgeRuleId === ruleId);
    return evidence ? evidence.status : null;
  };

  if (!rules.length) {
    return (
      <p className="text-gray-500">You have no active badge opportunities.</p>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl mt-6">
      <h3 className="text-xl font-bold text-[#6e66f3] mb-4">
        Badge Opportunities
      </h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rules.map((rule) => {
          const status = getEvidenceStatusForRule(rule.id);
          const isPending = status === "pending";
          const isApproved = status === "approved";

          return (
            <div
              key={rule.id}
              className="p-4 border rounded-xl bg-gray-50 text-center shadow-md"
            >
              {rule.badge?.logoUrl?.match(/^https?:\/\//) ||
              rule.badge?.logoUrl?.startsWith("/uploads") ? (
                <img
                  src={
                    rule.badge.logoUrl.startsWith("http")
                      ? rule.badge.logoUrl
                      : import.meta.env.VITE_API_URL + rule.badge.logoUrl
                  }
                  alt={rule.badge.name}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
              ) : (
                <div className="text-4xl mb-2">{rule.badge.logoUrl}</div>
              )}
              <p className="font-bold text-[#6e66f3]">{rule.badge.name}</p>
              <p className="text-sm capitalize mb-2">{rule.badge.type}</p>
              <p className="text-sm text-gray-600 mb-2 italic">
                {rule.description}
              </p>

              {!isApproved && (
                <button
                  onClick={() => openEvidenceModal(rule)}
                  className={`mt-2 px-3 py-1 rounded text-white ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={isPending}
                >
                  {isPending ? "Pending" : "Request"}
                </button>
              )}

              {isApproved && (
                <p className="text-green-600 font-semibold mt-2">
                  ✓ Badge Assigned
                </p>
              )}
            </div>
          );
        })}
      </div>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Evidence"
      >
        <div className="space-y-4">
          <input type="file" onChange={handleFileChange} className="w-full" />
          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={submitEvidence}
            className="w-full bg-green-500 text-white py-2 px-4 rounded"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Evidence"}
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}

export default ActiveBadges;
