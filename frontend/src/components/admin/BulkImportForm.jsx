import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fetchBadges } from "../../redux/slices/badgesSlice";
import { fetchMissions } from "../../redux/slices/missionsSlice";
import ModalWrapper from "../common/ModalWrapper";
import { toast } from "react-toastify";

function BulkImportForm({ type }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/import/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} imported successfully!`
      );

      if (type === "badges") {
        dispatch(fetchBadges());
      } else if (type === "missions") {
        dispatch(fetchMissions());
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#6e66f3] hover:bg-[#5a55d1] text-white px-4 py-2 rounded-xl text-sm shadow-md transition"
      >
        Import {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>

      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Import ${type}`}
      >
        <div className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />

          {file && (
            <div className="text-sm text-gray-600">
              Selected: <strong>{file.name}</strong>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl w-full disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : `Upload ${type}`}
          </button>
        </div>
      </ModalWrapper>
    </div>
  );
}

BulkImportForm.propTypes = {
  type: PropTypes.oneOf(["missions", "badges"]).isRequired,
};

export default BulkImportForm;
