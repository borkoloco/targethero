/*

// components/user/PayReceiptList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";
import SignaturePadModal from "../common/SignaturePadModal";

function PayReceiptList() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/my-receipts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load pay receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReceipts = [...receipts].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleOpenSignModal = (receipt) => {
    setSelectedReceipt(receipt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setModalOpen(false);
  };

  const handleSign = async (signatureDataUrl) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${
          selectedReceipt.id
        }/sign`,
        { signature: signatureDataUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReceipts();
    } catch (err) {
      console.error("Failed to sign receipt", err);
    }
  };

  if (loading) return <p>Loading pay receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 font-sans">
      <h3 className="text-xl font-bold text-[#6e66f3] mb-4">My Pay Receipts</h3>

      {receipts.length === 0 ? (
        <p className="text-gray-600">No pay receipts available.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#fc875e] text-white">
            <tr>
              <SortableTableHeader
                label="Month"
                field="month"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReceipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-2">{receipt.month}</td>
                <td className="border p-2">
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                </td>
                <td className="border p-2 capitalize">
                  {receipt.signatureStatus === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {receipt.signatureStatus === "awaiting_approval" && (
                    <span className="text-yellow-600">Awaiting approval</span>
                  )}
                  {receipt.signatureStatus === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                  {receipt.signatureStatus === "unsigned" && (
                    <span className="text-gray-500">Unsigned</span>
                  )}
                </td>
                <td className="border p-2">
                  {receipt.signatureStatus === "unsigned" ? (
                    <button
                      onClick={() => handleOpenSignModal(receipt)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Sign
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Signed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <SignaturePadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSign={handleSign}
      />
    </div>
  );
}

export default PayReceiptList;



// components/user/PayReceiptList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";
import SignaturePadModal from "../common/SignaturePadModal";

function PayReceiptList() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/my-receipts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load pay receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReceipts = [...receipts].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleOpenSignModal = (receipt) => {
    setSelectedReceipt(receipt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReceipt(null);
    setModalOpen(false);
  };

  const handleSign = async (signatureDataUrl) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${selectedReceipt.id}/sign`,
        { signature: signatureDataUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReceipts();
    } catch (err) {
      console.error("Failed to sign receipt", err);
    }
  };

  if (loading) return <p>Loading pay receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 font-sans">
      <h3 className="text-xl font-bold text-[#6e66f3] mb-4">My Pay Receipts</h3>

      {receipts.length === 0 ? (
        <p className="text-gray-600">No pay receipts available.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#fc875e] text-white">
            <tr>
              <SortableTableHeader
                label="Month"
                field="month"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReceipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-2">{receipt.month}</td>
                <td className="border p-2">
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                </td>
                <td className="border p-2 capitalize">
                  {receipt.signatureStatus === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {receipt.signatureStatus === "awaiting_approval" && (
                    <span className="text-yellow-600">Awaiting approval</span>
                  )}
                  {receipt.signatureStatus === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                  {receipt.signatureStatus === "unsigned" && (
                    <span className="text-gray-500">Unsigned</span>
                  )}
                </td>
                <td className="border p-2">
                  {receipt.signatureStatus === "unsigned" ? (
                    <button
                      onClick={() => handleOpenSignModal(receipt)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Sign
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Signed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <SignaturePadModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSign={handleSign}
      />
    </div>
  );
}

export default PayReceiptList;




// PATCH /api/pay-receipts/:id/approve
router.patch(
    "/:id/approve",
    protect,
    roleMiddleware(["hr"]),
    payReceiptController.approveSignedReceipt
  );
  
  router.patch(
    "/:id/reject",
    protect,
    roleMiddleware(["hr"]),
    payReceiptController.rejectSignedReceipt
  );

  


  const approveSignedReceipt = async (req, res) => {
    const receipt = await PayReceipt.findByPk(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    receipt.signatureStatus = "approved";
    await receipt.save();
    res.json(receipt);
  };
  
  const rejectSignedReceipt = async (req, res) => {
    const receipt = await PayReceipt.findByPk(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    receipt.signatureStatus = "rejected";
    await receipt.save();
    res.json(receipt);
  };
  
  module.exports = {
    approveSignedReceipt,
    rejectSignedReceipt,
    // other methods...
  };

  

  // components/hr/PayReceiptsSent.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";

function PayReceiptsSent() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSentReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/sent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load sent receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentReceipts();
  }, [token]);

  const handleDecision = async (id, decision) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${id}/${decision}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSentReceipts(); // Refresh
    } catch (err) {
      console.error("Error updating receipt status", err);
    }
  };

  const pending = receipts.filter(r => r.signatureStatus === "awaiting_approval");

  if (loading) return <p>Loading receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md font-sans mt-8">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">Signed Receipts Awaiting Approval</h3>

      {pending.length === 0 ? (
        <p className="text-gray-500">No receipts awaiting approval.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#6e66f3] text-white">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Receipt</th>
              <th className="p-2 border">Signature</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-2">{receipt.employee?.name}</td>
                <td className="border p-2">{receipt.month}</td>
                <td className="border p-2">
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="border p-2">
                  <img
                    src={receipt.signatureImage}
                    alt="Signature"
                    className="h-12"
                  />
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(receipt.id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(receipt.id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default PayReceiptsSent;


// Controller
const approveSignatureByHr = async (req, res) => {
    try {
      const receipt = await PayReceipt.findByPk(req.params.id);
      if (!receipt) return res.status(404).json({ error: "Not found" });
  
      if (receipt.signatureStatus !== "awaiting_approval") {
        return res
          .status(400)
          .json({ error: "Only receipts awaiting approval can be processed." });
      }
  
      receipt.signatureStatus = "hr_approved";
      await receipt.save();
      res.json(receipt);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  

  // In payReceiptRoutes.js
router.put(
    "/:id/approve-signature",
    protect,
    roleMiddleware(["hr"]),
    payReceiptController.approveSignatureByHr
  );

  


  import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";

function PayReceiptsSent() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/sent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch {
      setError("Failed to load sent receipts.");
    } finally {
      setLoading(false);
    }
  };

  const approveSignature = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${id}/approve-signature`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReceipts();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  if (loading) return <p>Loading pay receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">Pay Receipts Sent</h3>
      <ScrollableTable maxHeight="300px">
        <thead className="bg-[#fc875e] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Receipt</th>
            <th className="p-2 border">Signature Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.id}>
              <td className="border p-2">{receipt.employee?.name}</td>
              <td className="border p-2">{receipt.month}</td>
              <td className="border p-2">
                <a
                  href={receipt.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="border p-2 capitalize">
                {receipt.signatureStatus.replace("_", " ")}
              </td>
              <td className="border p-2">
                {receipt.signatureStatus === "awaiting_approval" ? (
                  <button
                    onClick={() => approveSignature(receipt.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">No action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default PayReceiptsSent;




// components/admin/PayReceiptsReview.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";

function PayReceiptsReview() {
  const { token } = useSelector((state) => state.auth);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingSignatures = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/pending-approval`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReceipts(res.data);
    } catch (err) {
      setError("Failed to load pending receipts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSignatures();
  }, [token]);

  const handleDecision = async (id, action) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/pay-receipts/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPendingSignatures();
    } catch (err) {
      console.error("Error updating signature status", err);
    }
  };

  if (loading) return <p>Loading pending receipts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl mt-6 font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Pending Pay Receipt Signatures
      </h3>

      {receipts.length === 0 ? (
        <p className="text-gray-500">No receipts pending approval.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="bg-[#6e66f3] text-white">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Document</th>
              <th className="p-2 border">Signature</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td className="border p-2">{receipt.employee?.name}</td>
                <td className="border p-2">{receipt.month}</td>
                <td className="border p-2">
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                </td>
                <td className="border p-2">
                  <img
                    src={receipt.signature}
                    alt="signature"
                    className="h-12 w-auto border rounded"
                  />
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleDecision(receipt.id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(receipt.id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default PayReceiptsReview;



// --- Frontend: components/admin/VacationRequestsReview.jsx ---
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";

function VacationRequestsReview() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingHRApproved = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vacations/hr-approved`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch {
      setError("Failed to fetch vacation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHRApproved();
  }, [token]);

  const handleDecision = async (id, action) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vacations/${id}/final-${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingHRApproved();
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

  if (loading) return <p>Loading vacation requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!requests.length)
    return <p className="text-gray-500">No vacation requests pending final approval.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Final Vacation Request Review
      </h3>
      <ScrollableTable maxHeight="300px">
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border p-2">{req.user?.name}</td>
              <td className="border p-2">{req.startDate}</td>
              <td className="border p-2">{req.endDate}</td>
              <td className="border p-2">{req.reason}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleDecision(req.id, "approve")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req.id, "reject")}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default VacationRequestsReview;

// --- Backend ---

// controllers/vacationController.js
const getHRApprovedRequests = async (req, res) => {
  try {
    const requests = await VacationRequest.findAll({
      where: { status: "hr_approved" },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalApproveRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "admin_approved";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalRejectRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "admin_rejected";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHRApprovedRequests,
  finalApproveRequest,
  finalRejectRequest,
};

// routes/vacationRoutes.js
router.get(
  "/hr-approved",
  protect,
  roleMiddleware(["admin"]),
  vacationController.getHRApprovedRequests
);

router.put(
  "/:id/final-approve",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalApproveRequest
);

router.put(
  "/:id/final-reject",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalRejectRequest
);



}// --- Frontend: components/admin/VacationRequestsReview.jsx ---
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ScrollableTable from "../common/ScrollableTable";

function VacationRequestsReview() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingHRApproved = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vacations/hr-approved`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch {
      setError("Failed to fetch vacation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHRApproved();
  }, [token]);

  const handleDecision = async (id, action) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vacations/${id}/final-${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPendingHRApproved();
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

  if (loading) return <p>Loading vacation requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!requests.length)
    return <p className="text-gray-500">No vacation requests pending final approval.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Final Vacation Request Review
      </h3>
      <ScrollableTable maxHeight="300px">
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border p-2">{req.user?.name}</td>
              <td className="border p-2">{req.startDate}</td>
              <td className="border p-2">{req.endDate}</td>
              <td className="border p-2">{req.reason}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleDecision(req.id, "approve")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req.id, "reject")}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default VacationRequestsReview;

// --- Backend ---

// controllers/vacationController.js
const getHRApprovedRequests = async (req, res) => {
  try {
    const requests = await VacationRequest.findAll({
      where: { status: "hr_approved" },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalApproveRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "admin_approved";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalRejectRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "admin_rejected";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHRApprovedRequests,
  finalApproveRequest,
  finalRejectRequest,
};

// routes/vacationRoutes.js
router.get(
  "/hr-approved",
  protect,
  roleMiddleware(["admin"]),
  vacationController.getHRApprovedRequests
);

router.put(
  "/:id/final-approve",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalApproveRequest
);

router.put(
  "/:id/final-reject",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalRejectRequest
);



// --- Frontend: components/admin/VacationRequestsReview.jsx ---
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollableTable from "../common/ScrollableTable";
import {
  fetchAllVacationRequests,
  updateVacationStatus,
} from "../../redux/slices/vacationSlice";

function VacationRequestsReview() {
  const { token } = useSelector((state) => state.auth);
  const { allRequests, loading, error } = useSelector(
    (state) => state.vacations
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(fetchAllVacationRequests(token));
  }, [dispatch, token]);

  const handleDecision = (id, action) => {
    dispatch(updateVacationStatus({ id, action, token }));
  };

  const pendingFinal = allRequests.filter((r) => r.status === "hr_approved");

  if (loading) return <p>Loading vacation requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!pendingFinal.length)
    return <p className="text-gray-500">No vacation requests pending final approval.</p>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <h3 className="text-2xl font-bold text-[#6e66f3] mb-4">
        Final Vacation Request Review
      </h3>
      <ScrollableTable maxHeight="300px">
        <thead className="bg-[#6e66f3] text-white">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingFinal.map((req) => (
            <tr key={req.id}>
              <td className="border p-2">{req.user?.name}</td>
              <td className="border p-2">{req.startDate}</td>
              <td className="border p-2">{req.endDate}</td>
              <td className="border p-2">{req.reason}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleDecision(req.id, "approved")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req.id, "rejected")}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default VacationRequestsReview;

// --- Backend: vacationController.js ---
const getHRApprovedRequests = async (req, res) => {
  try {
    const requests = await VacationRequest.findAll({
      where: { status: "hr_approved" },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalApproveRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "approved";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalRejectRequest = async (req, res) => {
  try {
    const request = await VacationRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    request.status = "rejected";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHRApprovedRequests,
  finalApproveRequest,
  finalRejectRequest,
};

// --- Backend: routes/vacationRoutes.js ---
router.get(
  "/hr-approved",
  protect,
  roleMiddleware(["admin"]),
  vacationController.getHRApprovedRequests
);

router.put(
  "/:id/final-approve",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalApproveRequest
);

router.put(
  "/:id/final-reject",
  protect,
  roleMiddleware(["admin"]),
  vacationController.finalRejectRequest
);



import { Link } from "react-router-dom";
import { BriefcaseIcon, FileTextIcon } from "lucide-react";

function Sidebar() {
  return (
    <div className="space-y-6">
  

      <div>
        <h4 className="text-sm font-bold text-gray-500 px-4">Human Resources</h4>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              to="/hr/final-vacation-requests"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              Vacation Requests
            </Link>
          </li>
          <li>
            <Link
              to="/hr/pay-receipts-sent"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <FileTextIcon className="w-4 h-4 mr-2" />
              Pay Receipts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;



import VacationRequestsReview from "../components/admin/VacationRequestsReview";
import PayReceiptsSent from "../components/hr/PayReceiptsSent";

<Route path="/hr/final-vacation-requests" element={<VacationRequestsReview />} />
<Route path="/hr/pay-receipts-sent" element={<PayReceiptsSent />} />



const { user } = useSelector((state) => state.auth);
if (user?.profile !== "admin") return null;

*/



// redux/slices/vacationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchMyVacationRequests = createAsyncThunk(
  "vacation/fetchMyRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/my-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchApprovedVacationRequests = createAsyncThunk(
  "vacation/fetchApprovedRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/approved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchAllVacationRequests = createAsyncThunk(
  "vacation/fetchAllRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const updateVacationStatus = createAsyncThunk(
  "vacation/updateStatus",
  async ({ id, action, token }, { dispatch }) => {
    await axios.put(
      `${API}/api/vacations/${id}/${action}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchApprovedVacationRequests(token));
    dispatch(fetchAllVacationRequests(token));
    return id;
  }
);

const vacationSlice = createSlice({
  name: "vacation",
  initialState: {
    myRequests: [],
    approvedRequests: [],
    allRequests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyVacationRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      .addCase(fetchApprovedVacationRequests.fulfilled, (state, action) => {
        state.approvedRequests = action.payload;
      })
      .addCase(fetchAllVacationRequests.fulfilled, (state, action) => {
        state.allRequests = action.payload;
      });
  },
});

export default vacationSlice.reducer;

// components/hr/VacationSection.jsx
import { useState } from "react";
import VacationRequests from "./VacationRequests";
import ApprovedVacationRequests from "./ApprovedVacationRequests";
import ModalWrapper from "../common/ModalWrapper";

function VacationSection() {
  const [modal, setModal] = useState(null);

  return (
    <>
      <div className="space-y-8">
        <VacationRequests onOpen={() => setModal("pending")} />
        <ApprovedVacationRequests onOpen={() => setModal("approved")} />
      </div>

      <ModalWrapper
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal === "pending" ? "Pending Requests" : "Approved Requests"}
      >
        {modal === "pending" ? <VacationRequests /> : <ApprovedVacationRequests />}
      </ModalWrapper>
    </>
  );
}

export default VacationSection;



// redux/slices/vacationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchMyVacationRequests = createAsyncThunk(
  "vacation/fetchMyRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/my-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchApprovedVacationRequests = createAsyncThunk(
  "vacation/fetchApprovedRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/approved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchAllVacationRequests = createAsyncThunk(
  "vacation/fetchAllRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const updateVacationStatus = createAsyncThunk(
  "vacation/updateStatus",
  async ({ id, action, token }, { dispatch }) => {
    await axios.put(
      `${API}/api/vacations/${id}/${action}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchApprovedVacationRequests(token));
    dispatch(fetchAllVacationRequests(token));
    return id;
  }
);

const vacationSlice = createSlice({
  name: "vacation",
  initialState: {
    myRequests: [],
    approvedRequests: [],
    allRequests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyVacationRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      .addCase(fetchApprovedVacationRequests.fulfilled, (state, action) => {
        state.approvedRequests = action.payload;
      })
      .addCase(fetchAllVacationRequests.fulfilled, (state, action) => {
        state.allRequests = action.payload;
      });
  },
});

export default vacationSlice.reducer;

// components/hr/VacationSection.jsx
import { useState } from "react";
import VacationRequests from "./VacationRequests";
import ApprovedVacationRequests from "./ApprovedVacationRequests";
import ModalWrapper from "../common/ModalWrapper";

function VacationSection() {
  const [modal, setModal] = useState(null);

  return (
    <>
      <div className="space-y-8">
        <VacationRequests onOpen={() => setModal("pending")} />
        <ApprovedVacationRequests onOpen={() => setModal("approved")} />
      </div>

      <ModalWrapper
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal === "pending" ? "Pending Requests" : "Approved Requests"}
      >
        {modal === "pending" ? <VacationRequests /> : <ApprovedVacationRequests />}
      </ModalWrapper>
    </>
  );
}

export default VacationSection;




