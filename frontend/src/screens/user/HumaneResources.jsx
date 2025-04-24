import PayReceiptList from "../../components/user/PayReceiptList";
import VacationRequestList from "../../components/user/VacationRequestList";
import RoomReservationList from "../../components/user/RoomReservationList"

function HumaneResources() {
  return (
    <div className="space-y-8">
      <VacationRequestList />
      <RoomReservationList/>
      <PayReceiptList />
    </div>
  );
}

export default HumaneResources;
