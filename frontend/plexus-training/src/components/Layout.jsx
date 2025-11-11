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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

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

  useEffect(() => {
    // Toggle dark class on <html>
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  function handleSelectDashboard(id) {
    setActiveDashboard(id);
    setSidebarOpen(false); // close sidebar on mobile after selection
  }

  function handleDarkModeToggle() {
    setDarkMode((v) => !v);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded bg-white shadow md:hidden"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        {/* Hamburger icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Dark mode toggle (all screens, top right) */}
      <button
        className="fixed top-4 right-4 z-40 p-2 rounded bg-white shadow dark:bg-slate-900"
        aria-label="Toggle dark mode"
        onClick={handleDarkModeToggle}
      >
        {darkMode ? (
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path
              strokeWidth="2"
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path
              strokeWidth="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </svg>
        )}
      </button>
      <Sidebar
        dashboards={dashboards}
        activeDashboard={activeDashboard}
        onSelectDashboard={handleSelectDashboard}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="fixed left-0 top-0 h-screen w-64 z-20"
      />
      <main className="flex-1 p-8 overflow-y-auto ml-0 ">
        <Outlet context={{ activeDashboard }} />
      </main>
    </div>
  );
}
