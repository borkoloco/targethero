import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ScrollableTable from "./ScrollableTable";

function ClientApproval() {
  const { token } = useSelector((state) => state.auth);
  const [pendingClients, setPendingClients] = useState([]);

  useEffect(() => {
    const fetchPendingClients = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/api/clients/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingClients(response.data);
      } catch (err) {
        console.error("Error fetching pending clients:", err);
      }
    };

    fetchPendingClients();
  }, [token]);

  const approveClient = async (id) => {
    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/api/clients/${id}/approved`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingClients(pendingClients.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error approving client:", err);
    }
  };
  
  const declineClient = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/clients/${id}/declined`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingClients(pendingClients.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error declining client:", err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">Clientes Pendientes</h3>
      {pendingClients.length === 0 ? (
        <p>No hay clientes pendientes.</p>
      ) : (
        <ScrollableTable>
          <thead>
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Fecha de registro</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingClients.map((client) => (
              <tr key={client.id}>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">
                  {new Date(client.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => approveClient(client.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => declineClient(client.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Rechazar
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

export default ClientApproval;
