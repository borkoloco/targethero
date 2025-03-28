import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/socket";
import ScrollableTable from "./ScrollableTable";

function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/events/recent"
      );
      setEvents(res.data);
    } catch {
      setError("Failed to fetch recent events.");
    }
  };

  useEffect(() => {
    fetchEvents();

    socket.on("newEvent", (event) => {
      setEvents((prev) => [event, ...prev]);
    });

    return () => {
      socket.off("newEvent");
    };
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 rounded-lg bg-white ">
      <h2 className="text-2xl font-bold mb-4 text-black">Recent Events</h2>
      {events.length === 0 ? (
        <p className="text-white">No recent events.</p>
      ) : (
        <div className="overflow-x-auto bg-[#f3f4f6] rounded-lg shadow-md">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-[#6e66f3] rounded-t-lg text-white">
                <tr>
                  <th className="p-3 text-left rounded-tl-lg">Type</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-[#e6e6f7]">
                    <td className="border-b p-3 text-gray-800 capitalize">{event.type}</td>
                    <td className="border-b p-3 text-gray-800">{event.description}</td>
                    <td className="border-b p-3 text-gray-800">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default RecentEvents;
