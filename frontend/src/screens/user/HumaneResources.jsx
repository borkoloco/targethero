import PayReceiptList from "../../components/user/PayReceiptList";
import VacationRequestList from "../../components/user/VacationRequestList";

function HumaneResources() {
  return (
    <div className="space-y-8">
      <VacationRequestList />
      <PayReceiptList />
    </div>
  );
}

export default HumaneResources;
