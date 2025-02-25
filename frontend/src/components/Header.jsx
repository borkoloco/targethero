import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Gamificación Comercial</h1>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
