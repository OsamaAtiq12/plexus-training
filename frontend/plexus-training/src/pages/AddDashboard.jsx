import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { getWidgets, createDashboard } from "../api";
import MultiSelectDropdown from "../components/ui/MultiSelectDropdown";

export default function AddDashboard() {
  const [name, setName] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWidgets() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("You must be logged in to create a dashboard.");
          setLoading(false);
          return;
        }
        const data = await getWidgets(token);
        setWidgets(data);
      } catch (err) {
        setError("Failed to load widgets.");
      } finally {
        setLoading(false);
      }
    }
    fetchWidgets();
  }, []);

  // No longer needed: handleWidgetChange

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim() || selectedWidgets.length === 0) {
      setError("Dashboard name and at least one widget are required.");
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }
      await createDashboard({ name, widgets: selectedWidgets }, token);
      setSuccess("Dashboard created successfully!");
      setName("");
      setSelectedWidgets([]);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Failed to create dashboard.");
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full bg-card p-8 rounded-xl shadow border mt-16">
        <h2 className="text-2xl font-bold mb-4">Create New Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full border rounded px-3 py-2 mb-4 bg-background"
            placeholder="Dashboard name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Select Widgets</label>
          {loading ? (
            <div className="mb-4 text-gray-500">Loading widgets...</div>
          ) : (
            <MultiSelectDropdown
              options={widgets.map(w => ({
                label: (w.title || w.name || w.widgetname) + (w.id ? ` (ID: ${w.id})` : ""),
                value: w.id
              }))}
              value={selectedWidgets}
              onChange={setSelectedWidgets}
              placeholder="Select widgets to add"
              className="mb-4"
            />
          )}
          {error && (
            <div className="mb-2 text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2">{error}</div>
          )}
          {success && (
            <div className="mb-2 text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2">{success}</div>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            Create Dashboard
          </Button>
        </form>
      </div>
    </main>
  );
}
