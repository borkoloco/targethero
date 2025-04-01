import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchMarketItems } from "../redux/slices/marketItemsSlice";
import MarketItemForm from "./MarketItemForm";
import ModalWrapper from "./ModalWrapper";
import SortableTableHeader from "./SortableTableHeader";
import ScrollableTable from "./ScrollableTable";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL;

function MarketManagement() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.marketItems);
  const { token } = useSelector((state) => state.auth);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [report, setReport] = useState([]);
  const [reportError, setReportError] = useState(null);

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketItems());
  }, [dispatch, status]);

  useEffect(() => {
    async function fetchReport() {
      try {
        const { data } = await axios.get(`${API_BASE}/api/market-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(data);
      } catch (err) {
        setReportError(err.response?.data?.error || "Error fetching report");
      }
    }
    if (token) fetchReport();
  }, [token]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField],
      vb = b[sortField];
    return typeof va === "number"
      ? sortDirection === "asc"
        ? va - vb
        : vb - va
      : sortDirection === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  const sortedReport = [...report].sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField],
      vb = b[sortField];
    return typeof va === "number"
      ? sortDirection === "asc"
        ? va - vb
        : vb - va
      : sortDirection === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  const openModal = (item = null) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_BASE}/api/market/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      dispatch(fetchMarketItems());
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-[#6e66f3] drop-shadow mb-6">
        Market Management
      </h2>

      <div className="flex justify-end mb-4">
        <button
          className="bg-[#fc875e] hover:bg-[#fc875e] text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-md"
          onClick={() => openModal()}
        >
         + Add New Market Item
        </button>
      </div>

      {isModalOpen && (
        <ModalWrapper
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={editItem ? "Edit Item" : "New Item"}
        >
          <MarketItemForm
            item={editItem}
            onClose={() => {
              setModalOpen(false);
              dispatch(fetchMarketItems());
            }}
          />
        </ModalWrapper>
      )}

      <h2 className="text-xl font-bold mb-2 text-[#6e66f3] ">Market Items List</h2>
      {error && (
        <p className="text-red-500 mb-4">Error loading items: {error}</p>
      )}

      <ScrollableTable>
        <thead className="bg-[#fc875e] sticky top-0 z-10">
          <tr className="text-white">
            <SortableTableHeader
              label="ID"
              field="id"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Name"
              field="name"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Required Points"
              field="requiredPoints"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.requiredPoints}</td>
              <td className="border p-2">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => openModal(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>

      <h3 className="text-xl font-bold mt-10 mb-2 text-[#6e66f3]">User Market Report</h3>
      {reportError && (
        <p className="text-red-500 mb-4">Error loading report: {reportError}</p>
      )}

      <ScrollableTable>
        <thead className="bg-[#fc875e] sticky top-0 z-10">
          <tr className="text-white">
            <SortableTableHeader
              label="ID"
              field="id"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Name"
              field="name"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Total Points"
              field="totalPoints"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <SortableTableHeader
              label="Available Points"
              field="availablePoints"
              {...{ sortField, sortDirection, onSortChange: toggleSort }}
            />
            <th className="border p-2">Purchased Items</th>
          </tr>
        </thead>
        <tbody>
          {sortedReport.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 transition">
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.totalPoints}</td>
              <td className="border p-2">{u.availablePoints}</td>
              <td className="border p-2">
                {u.trades.length
                  ? u.trades.map((t) => `${t.item} (${t.points})`).join(", ")
                  : "None"}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </div>
  );
}

export default MarketManagement;
