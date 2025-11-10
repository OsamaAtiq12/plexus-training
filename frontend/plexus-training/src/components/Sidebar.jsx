import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { logout } from "../api";

export default function Sidebar({ dashboards = [], activeDashboard, onSelectDashboard }) {
  const [showDashboards, setShowDashboards] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch {}
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  return (
    <aside className="h-screen w-72 bg-black text-white flex flex-col border-r border-slate-800 shadow-lg">
      <div className="p-6 text-2xl font-bold tracking-tight border-b border-slate-800">Plexus</div>
      <nav className="flex-1 p-4 space-y-2">
        <button
       className="w-full flex items-center justify-between px-4 py-2 rounded bg-black hover:bg-neutral-800 transition font-semibold text-white border border-neutral-800 shadow"
          onClick={() => setShowDashboards((v) => !v)}
        >
          <span>Dashboards</span>
          <span className="ml-2">{showDashboards ? "▾" : "▸"}</span>
        </button>
        {showDashboards && (
          <div className="ml-2 mt-1 space-y-1">
            {dashboards.length === 0 && (
              <div className="text-xs text-slate-400 px-2">No dashboards</div>
            )}
            {dashboards.map((d) => (
              <button
                key={d.id}
className={`w-full text-left px-3 py-1 rounded font-medium bg-black text-white`}
                onClick={() => {
                  onSelectDashboard?.(d.id);
                  navigate(`/dashboard/${d.id}`);
                }}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
        <Link
          to="/add-dashboard"
          className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white  font-medium flex items-center gap-2 ${location.pathname === "/add-dashboard" ? "ring-2 ring-indigo-400" : ""}`}
        >
          <span className="inline-block w-5 h-5" aria-hidden="true">
            {/* Plus Square Icon */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><path strokeWidth="2" d="M12 8v8m-4-4h8"/></svg>
          </span>
          Add Dashboard
        </Link>
        <Link
          to="/add-widget"
          className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white  font-medium flex items-center gap-2 ${location.pathname === "/add-widget" ? "ring-2 ring-indigo-400" : ""}`}
        >
          <span className="inline-block w-5 h-5" aria-hidden="true">
            {/* Widget Icon */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="7" height="7" rx="1" strokeWidth="2"/><rect x="13" y="4" width="7" height="7" rx="1" strokeWidth="2"/><rect x="4" y="13" width="7" height="7" rx="1" strokeWidth="2"/><rect x="13" y="13" width="7" height="7" rx="1" strokeWidth="2"/></svg>
          </span>
          Add Widget
        </Link>
        <Link
          to="/dashboard-editor"
          className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white font-medium flex items-center gap-2 ${location.pathname === "/dashboard-editor" ? "ring-2 ring-indigo-400" : ""}`}
        >
          <span className="inline-block w-5 h-5" aria-hidden="true">
            {/* Pencil Ruler Icon */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5.232 11.232a2 2 0 010-2.828L9 13z"/></svg>
          </span>
          Dashboard Editor
        </Link>
        <Link
          to="/widgets"
          className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white font-medium flex items-center gap-2 ${location.pathname === "/widgets" ? "ring-2 ring-indigo-400" : ""}`}
        >
          <span className="inline-block w-5 h-5" aria-hidden="true">
            {/* Grid Icon */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>
          </span>
          Widgets
        </Link>
        {/* <Link to="/analytics" className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white font-medium ${location.pathname === "/analytics" ? "bg-neutral-800" : ""}`}>Analytics</Link>
        <Link to="/settings" className={`block px-4 py-2 rounded hover:bg-neutral-800 transition text-white  font-medium ${location.pathname === "/settings" ? "bg-neutral-800" : ""}`}>Settings</Link> */}
       
      </nav>
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        <div className="text-xs text-slate-400">&copy; 2025 Plexus</div>
        <Button
          
          className="w-full mt-2 flex items-center gap-2 justify-center bg-black text-white"
          onClick={handleLogout}
        >
          <span className="inline-block w-5 h-5" aria-hidden="true">
            {/* Logout Icon */}
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
          </span>
          Logout
        </Button>
      </div>
    </aside>
  );
}
