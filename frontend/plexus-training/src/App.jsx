import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard, { DashboardWrapper } from "./pages/Dashboard";
import AddDashboard from "./pages/AddDashboard";
import AddWidget from "./pages/AddWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import DashboardEditor from "./pages/DashboardEditor";
import Widgets from "./pages/Widgets";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/dashboard/:dashboardId" element={<DashboardWrapper />} />
          <Route path="/add-dashboard" element={<AddDashboard />} />
          <Route path="/add-widget" element={<AddWidget />} />
          <Route path="/dashboard-editor" element={<DashboardEditor />} />
          <Route path="/dashboard-editor/:dashboardId" element={<DashboardEditor />} />
          <Route path="/widgets" element={<Widgets />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
