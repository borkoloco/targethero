import VacationRequests from "./VacationRequests";
import ApprovedVacationRequests from "./ApprovedVacationRequests";

function VacationSection() {
  return (
    <div className="space-y-8">
      <VacationRequests />
      <ApprovedVacationRequests />
    </div>
  );
}

export default VacationSection;
