import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const API_BASE = import.meta.env.VITE_API_URL;

function MarketItemForm({ item, onClose }) {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requiredPoints: "",
    imageUrl: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        requiredPoints: item.requiredPoints,
        imageUrl: item.imageUrl || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageURL = formData.imageUrl;

      if (file) {
        const uploadData = new FormData();
        uploadData.append("evidence", file);

        const uploadRes = await axios.post(
          `${API_BASE}/api/market/market-image`,
          uploadData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imageURL = uploadRes.data.secure_url;
      }

      const payload = {
        ...formData,
        requiredPoints: parseInt(formData.requiredPoints, 10),
        imageUrl: imageURL,
      };

      if (item) {
        await axios.put(`${API_BASE}/api/market/${item.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Market item updated successfully!");
      } else {
        await axios.post(`${API_BASE}/api/market`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Market item added successfully!");
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save market item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-2xl shadow-md"
    >
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name:
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Description:
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Required Points:
        </label>
        <input
          type="number"
          name="requiredPoints"
          value={formData.requiredPoints}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Upload Image (optional):
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Or Enter Image URL:
        </label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-200"
      >
        {loading
          ? "Saving..."
          : item
          ? "Update Market Item"
          : "Add Market Item"}
      </button>
    </form>
  );
}

MarketItemForm.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default MarketItemForm;
