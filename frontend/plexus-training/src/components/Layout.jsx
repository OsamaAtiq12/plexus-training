import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDashboards } from "../api";

/**
 * Layout component that wraps the sidebar and main content.
 * Renders nested routes via <Outlet />.
 */
export default function Layout() {
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const token = localStorage.getItem("auth_token");
        const data = await getDashboards(token);
        setDashboards(data || []);
        if (data && data.length > 0) {
          setActiveDashboard(data[0].id);
        }
      } catch (err) {
        setDashboards([]);
      }
    }
    fetchDashboards();
  }, []);

  function handleSelectDashboard(id) {
    setActiveDashboard(id);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <Sidebar
        dashboards={dashboards}
        activeDashboard={activeDashboard}
        onSelectDashboard={handleSelectDashboard}
        className="fixed left-0 top-0 h-screen w-64 z-20"
      />
      <main className=" flex-1 p-8 h-screen overflow-y-auto">
        <Outlet context={{ activeDashboard }} />
      </main>
    </div>
  );
}
