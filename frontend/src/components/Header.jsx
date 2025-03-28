import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { persistor } from "../redux/store";

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
  };

  return (
    <header className="bg-[#6e66f3] text-white p-6 flex items-center justify-between shadow-lg font-sans">
      <h1 className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide relative 
      before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-full 
      before:h-1 before:bg-[#fc875e] before:rounded-full before:scale-x-0 before:transition-transform 
      before:duration-300 hover:before:scale-x-100 drop-shadow-lg">
        Level <span className="text-white bg-[#fc875e] px-2 py-1 rounded-lg shadow-md">Up</span>
      </h1>
  
      {user && (
        <div className="flex items-center space-x-6">
          <p className="text-lg">
            Welcome, <span className="font-semibold text-[#fc875e]">{user.name}</span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-[#fc875e] hover:bg-[#f67a4f] text-white px-4 py-2 rounded-xl transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
export default Header;
