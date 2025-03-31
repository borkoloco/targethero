import { useEffect, useState } from "react";
import BulkImportForm from "./BulkImportForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from "../redux/slices/badgesSlice";
import ModalWrapper from "./ModalWrapper";
import ScrollableTable from "./ScrollableTable";
import SortableTableHeader from "./SortableTableHeader";

function Badges() {
  const dispatch = useDispatch();
  const { list: badges, status, error } = useSelector((state) => state.badges);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    name: "",
    type: "monthly",
    emoji: "🏆",
    description: "",
    file: null,
  });

  const emojiOptions = [
    "🏆",
    "🚀",
    "🎯",
    "💡",
    "🧠",
    "👑",
    "🔥",
    "🦸‍♂️",
    "🛠️",
    "📈",
    "🌟",
    "📚",
    "🎖️",
    "🥇",
    "🧩",
  ];

  useEffect(() => {
    dispatch(fetchBadges());
  }, [dispatch]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedBadges = [...badges].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "monthly",
      emoji: "🏆",
      description: "",
      file: null,
    });
    setEditingBadge(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBadge) {
        if (formData.file) {
          const form = new FormData();
          form.append("name", formData.name);
          form.append("type", formData.type);
          form.append("description", formData.description);
          form.append("logo", formData.file);
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/badges/upload/${
              editingBadge.id
            }`,
            {
              method: "PUT",
              body: form,
            }
          );
        } else {
          await dispatch(
            updateBadge({
              id: editingBadge.id,
              formData: {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                logoUrl: formData.emoji,
              },
            })
          );
        }
      } else {
        await dispatch(
          createBadge({
            name: formData.name,
            type: formData.type,
            description: formData.description,
            logoUrl: formData.emoji,
          })
        );
      }
      setIsModalOpen(false);
      resetForm();
      dispatch(fetchBadges());
    } catch (err) {
      console.error("Error saving badge:", err);
    }
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      type: badge.type,
      emoji: badge.logoUrl,
      description: badge.description,
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this badge?")) {
      dispatch(deleteBadge(id));
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-[#6e66f3]">All Badges</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <BulkImportForm type="badges" />
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded-xl transition duration-200"
          >
            Create Badge
          </button>
        </div>
      </div>

      <ScrollableTable>
        <thead className="bg-[#fc875e]  sticky top-0 z-10 text-[#6e66f3]">
          <tr className="text-white">
            <SortableTableHeader
              label="Name"
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <SortableTableHeader
              label="Type"
              field="type"
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
            <th className="border p-2">Logo</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Loading badges...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-red-500">
                Error: {error}
              </td>
            </tr>
          ) : badges.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No badges to show.
              </td>
            </tr>
          ) : (
            sortedBadges.map((badge) => (
              <tr key={badge.id}>
                <td className="border p-2">{badge.name}</td>
                <td className="border p-2">{badge.type}</td>
                <td className="border p-2 text-center">
                  {badge.logoUrl?.startsWith("http") ||
                  badge.logoUrl?.startsWith("/uploads") ? (
                    <img
                      src={
                        badge.logoUrl.startsWith("http")
                          ? badge.logoUrl
                          : import.meta.env.VITE_API_URL + badge.logoUrl
                      }
                      alt={badge.name}
                      className="w-10 h-10 mx-auto object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{badge.logoUrl}</span>
                  )}
                </td>
                <td className="border p-2">{badge.description}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(badge)}
                    className="bg-[#6e66f3] hover:bg-[#5a55d1] text-white px-3 py-1 rounded-xl text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(badge.id)}
                    className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-3 py-1 rounded-xl text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ScrollableTable>

      <ModalWrapper
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={editingBadge ? "Edit Badge" : "Create Badge"}
>
  <form onSubmit={handleSubmit} className="space-y-4 flex flex-col md:flex-row md:space-y-0 md:space-x-6">
    <div className="flex-1 space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Type</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
          className="border p-2 w-full rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Upload PNG (optional)</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files[0] })
          }
          className="w-full"
        />
      </div>
    </div>

    <div className="flex-1 space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Choose an Emoji</label>
        <div className="grid grid-cols-5 gap-2">
          {emojiOptions.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={`text-3xl p-2 border rounded hover:bg-gray-200 ${
                formData.emoji === emoji ? "bg-blue-100 border-blue-400" : ""
              }`}
              onClick={() => setFormData({ ...formData, emoji })}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-[#6e66f3] hover:bg-[#574ed1] text-white px-4 py-2 rounded w-full transition"
      >
        {editingBadge ? "Update Badge" : "Save Badge"}
      </button>
    </div>
  </form>
</ModalWrapper>

    </div>
  );
}

export default Badges;
