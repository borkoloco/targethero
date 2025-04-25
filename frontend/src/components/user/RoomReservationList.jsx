import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReservations,
} from "../../redux/slices/roomReservationSlice";
import ModalWrapper from "../common/ModalWrapper";
import RoomReservationForm from "./RoomReservationForm";
import ScrollableTable from "../common/ScrollableTable";
import SortableTableHeader from "../common/SortableTableHeader";

function RoomReservationList() {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector(
    (state) => state.roomReservation
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl font-sans">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-[#6e66f3]">Room Reservations</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded"
        >
          + New Reservation
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">No room reservations yet.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="sticky top-0 bg-[#fc875e] z-10 text-white">
            <tr>
              <SortableTableHeader
                label="Room"
                field="roomNumber"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Check-in"
                field="start_time"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <SortableTableHeader
                label="Check-out"
                field="end_time"
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={toggleSort}
              />
              <th className="p-2 border">User</th>
              
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{reservation.roomNumber}</td>
                <td className="border p-2">
                  {new Date(reservation.start_time).toLocaleString()}
                </td>
                <td className="border p-2">
                  {new Date(reservation.end_time).toLocaleString()}
                </td>
                <td className="border p-2">{reservation.userId}</td>
                <td className="border p-2 capitalize">{reservation.status}</td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Room Reservation"
      >
        <RoomReservationForm
          onSuccess={() => {
            setIsModalOpen(false);
            dispatch(fetchReservations());
          }}
        />
      </ModalWrapper>
    </div>
  );
}

export default RoomReservationList;
