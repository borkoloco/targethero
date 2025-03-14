import { useState } from "react";
import UploadEvidence from "../components/EvidenceConfirmation";
function EvidenceDashboard() {
    const [activeTab, setActiveTab] = useState("evidence");
  
    return (
      <div>
        <UploadEvidence />
      </div>
      
      
    );
  }
  
  export default EvidenceDashboard;