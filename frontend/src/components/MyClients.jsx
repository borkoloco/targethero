import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function MyClients() {
  const { token } = useSelector((state) => state.auth);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    status: "prospect",
    notes: "",
  });
  const [editClientId, setEditClientId] = useState(null);

  const fetchMyClients = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/clients/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editClientId) {
        await axios.put(
          `http://localhost:4000/api/clients/${editClientId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:4000/api/clients", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        name: "",
        contactEmail: "",
        contactPhone: "",
        status: "prospect",
        notes: "",
      });
      setEditClientId(null);
      fetchMyClients();
    } catch (err) {
      console.error(err);
      setError("Error creating/updating client");
    }
  };

  const handleEdit = (client) => {
    setEditClientId(client.id);
    setFormData({
      name: client.name,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      status: client.status,
      notes: client.notes,
    });
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`http://localhost:4000/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyClients();
    } catch (err) {
      console.error(err);
      setError("Error deleting client");
    }
  };

  if (loading) return <p>Loading my clients...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="text-xl font-bold mb-4">My Clients</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-1 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Phone:</label>
          <input
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {editClientId ? "Update Client" : "Add Client"}
        </button>
      </form>

      {clients.length === 0 ? (
        <p>No clients assigned yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="border p-2">{client.id}</td>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.contactEmail}</td>
                <td className="border p-2">{client.contactPhone}</td>
                <td className="border p-2">{client.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyClients;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// function MyClients() {
//   const { token } = useSelector((state) => state.auth);
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchMyClients = async () => {
//     try {
//       const response = await axios.get("http://localhost:4000/api/clients/my", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setClients(response.data);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Error fetching clients");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyClients();
//   }, []);

//   if (loading) return <p>Loading my clients...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="mt-4 border p-4 rounded">
//       <h3 className="text-xl font-bold mb-4">My Clients</h3>
//       {clients.length === 0 ? (
//         <p>No clients assigned yet.</p>
//       ) : (
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Phone</th>
//               <th className="border p-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {clients.map((client) => (
//               <tr key={client.id}>
//                 <td className="border p-2">{client.id}</td>
//                 <td className="border p-2">{client.name}</td>
//                 <td className="border p-2">{client.contactEmail}</td>
//                 <td className="border p-2">{client.contactPhone}</td>
//                 <td className="border p-2">{client.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default MyClients;
