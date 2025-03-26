import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RealTimeUpdater from "../socket/RealTimeUpdater";
import Notification from "./Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <Notification />
      <RealTimeUpdater />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {};

export default Layout;
