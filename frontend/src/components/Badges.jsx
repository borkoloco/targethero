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

function Badges() {
  const dispatch = useDispatch();
  const { list: badges, status, error } = useSelector((state) => state.badges);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold">All Badges</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <BulkImportForm type="badges" />
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Badge
          </button>
        </div>
      </div>

      {status === "loading" ? (
        <p>Loading badges...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Logo</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((badge) => (
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
                      className="w-8 h-8 mx-auto object-contain"
                    />
                  ) : (
                    <span className="text-2xl">{badge.logoUrl}</span>
                  )}
                </td>
                <td className="border p-2">{badge.description}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(badge)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this badge?")
                      ) {
                        handleDelete(badge.id);
                      }
                    }}
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

      <ModalWrapper isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">
          {editingBadge ? "Edit Badge" : "Create Badge"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
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
            <label className="block mb-1">Type</label>
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
            <label className="block mb-1">Choose an Emoji</label>
            <div className="grid grid-cols-5 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className={`text-3xl p-2 border rounded hover:bg-gray-200 ${
                    formData.emoji === emoji
                      ? "bg-blue-100 border-blue-400"
                      : ""
                  }`}
                  onClick={() => setFormData({ ...formData, emoji })}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1">Upload PNG (optional)</label>
            <input
              type="file"
              accept="image/png"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
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
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            {editingBadge ? "Update Badge" : "Save Badge"}
          </button>
        </form>
      </ModalWrapper>
    </div>
  );
}

export default Badges;
