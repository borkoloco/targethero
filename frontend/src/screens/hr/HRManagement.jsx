import { useState } from "react";
import PayReceiptSection from "../../components/hr/PayReceiptSection";
import VacationSection from "../../components/hr/VacationSection";

function HRManagement() {
  const [activeTab, setActiveTab] = useState("pay-receipts");

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <h2 className="text-3xl font-extrabold text-[#6e66f3] mb-6 drop-shadow">
        Staff Management
      </h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("pay-receipts")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "pay-receipts"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          Pay Receipts
        </button>
        <button
          onClick={() => setActiveTab("vacations")}
          className={`px-4 py-2 rounded-xl shadow-md transition duration-300 ${
            activeTab === "vacations"
              ? "bg-[#fc875e] text-white"
              : "bg-white text-[#6e66f3] hover:bg-[#ede9fe]"
          }`}
        >
          Vacations
        </button>
      </div>

      {activeTab === "pay-receipts" && <PayReceiptSection />}
      {activeTab === "vacations" && <VacationSection />}
    </div>
  );
}

export default HRManagement;
