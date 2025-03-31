import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchPurchases } from "../redux/slices/purchasesSlice";
import {
  fetchUserProfile,
  fetchAvailablePoints,
} from "../redux/slices/usersSlice";

const API_BASE = import.meta.env.VITE_API_URL;

function PurchaseForm({ itemName, cost, onPurchase }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/api/trades/purchase`,
        { item: itemName, cost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Purchase successful!");
      dispatch(fetchPurchases());
      dispatch(fetchUserProfile());
      dispatch(fetchAvailablePoints());
      if (onPurchase) onPurchase();
    } catch (error) {
      toast.error(error.response?.data?.error || "Purchase failed");
    }
  };

  return (
    <button
      onClick={handleSubmit}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition"
    >
      Buy for {cost} pts
    </button>
  );
}

PurchaseForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemName: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  onPurchase: PropTypes.func,
};

PurchaseForm.defaultProps = {
  onPurchase: null,
};

export default PurchaseForm;
