import { useEffect, useState } from "react";
import axios from "axios";      
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";

function RevenueApproval() {
    const { token } = useSelector((state) => state.auth);
    const [pendingRevenues, setPendingRevenues] = useState([]);
  
    useEffect(() => {
      const fetchPendingRevenues = async () => {
        try {
          const response = await axios.get(
            import.meta.env.VITE_API_URL + "/api/revenue/pending",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPendingRevenues(response.data);
        } catch (err) {
          console.error("Error fetching pending revenues:", err);
        }
      };
  
      fetchPendingRevenues();
    }, [token]);

    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString("es-ES");
      };
  
    const approveRevenue = async (id) => {
      try {
        await axios.put(
          import.meta.env.VITE_API_URL + `/api/revenue/${id}/approved`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingRevenues(pendingRevenues.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Error approving revenue:", err);
      }
    };
    const declineRevenue = (id) => {
        setPendingRevenues(pendingRevenues.filter((r) => r.id !== id));
      };
  
    return (
      <div className="mt-4 border p-4 rounded">
        <h3 className="text-xl font-bold mb-4">Pending Revenues</h3>
        {pendingRevenues.length === 0 ? (
          <p>No pending revenues.</p>
        ) : (
          <ScrollableTable>
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRevenues.map((record) => (
                <tr key={record.id}>
                  <td className="border p-2">{formatDate(record.date)}</td>
                  <td className="border p-2">${record.amount}</td>
                  <td className="border p-2">{record.type}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => approveRevenue(record.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => declineRevenue(record.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Decline
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

export default RevenueApproval;