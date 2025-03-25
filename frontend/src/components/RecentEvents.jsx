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
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
      {events.length === 0 ? (
        <p>No recent events.</p>
      ) : (
        <ScrollableTable maxHeight="300px">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="border p-2 capitalize">{event.type}</td>
                <td className="border p-2">{event.description}</td>
                <td className="border p-2">
                  {new Date(event.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      )}
    </div>
  );
}

export default RecentEvents;
