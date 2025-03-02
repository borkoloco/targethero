import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RealTimeUpdater from "../socket/RealTimeUpdater";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
