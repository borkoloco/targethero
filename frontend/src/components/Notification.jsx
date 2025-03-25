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
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {notification.message}
    </div>
  );
}

export default Notification;
