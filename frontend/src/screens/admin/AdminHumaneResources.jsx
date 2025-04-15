import PayReceiptsAdminReview from "../../components/admin/PayReceiptsAdminReview";
import VacationRequestsAdmin from "../../components/admin/VacationRequestsAdmin";

function AdminHumaneResources() {
  return (
    <div className="space-y-6">
      <PayReceiptsAdminReview />
      <VacationRequestsAdmin />
    </div>
  );
}

export default AdminHumaneResources;
