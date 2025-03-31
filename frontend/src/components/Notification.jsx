import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearNotification } from "../redux/slices/usersSlice";

function Notification() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.users.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-4 py-2 rounded-xl shadow-lg transition-opacity duration-300 text-white ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {notification.message}
    </div>
  );
}

export default Notification;
