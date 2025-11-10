import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Heading from "../components/ui/Heading";
import Error from "../components/ui/Error";
import { createWidget } from "../api";

const widgetTypes = [
  { value: "kpi", label: "KPI Card" },
  { value: "chart", label: "Chart" },
  { value: "table", label: "Table" },
];

export default function AddWidget() {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [colors, setColors] = useState("");
  const [style, setStyle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!type || !name.trim()) {
      setError("Type and name are required.");
      return;
    }
    let parsedColors = colors
      ? colors.split(",").map(c => c.trim()).filter(Boolean)
      : undefined;
    if (parsedColors && parsedColors.length === 1) parsedColors = parsedColors[0];
    let parsedStyle = {};
    try {
      parsedStyle = style ? JSON.parse(style) : undefined;
    } catch {
      setError("Style must be a valid JSON object.");
      return;
    }
    const widgetData = {
      type,
      name,
      title,
      colors: parsedColors,
      style: parsedStyle,
      widgetName: name,
    };
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in to add a widget.");
        setLoading(false);
        return;
      }
      await createWidget(widgetData, token);
      setSuccess("Widget created successfully!");
      setType("");
      setName("");
      setTitle("");
      setColors("");
      setStyle("");
    } catch (err) {
      if (
        err.message === "Missing token" ||
        err.message === "Invalid or expired token"
      ) {
        setError("Authentication required. Please log in.");
      } else {
        setError("Failed to create widget.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full bg-card p-8 rounded-xl shadow border mt-16">
        <Heading className="mb-4">Add Widget</Heading>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Widget Type</label>
          <select
            className="w-full border rounded px-3 py-2 mb-4 bg-background"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select widget type
            </option>
            {widgetTypes.map(w => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
          <label className="block mb-2 font-medium">Widget Name</label>
          <Input
            className="mb-4"
            placeholder="Widget name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Title</label>
          <Input
            className="mb-4"
            placeholder="Widget title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className="block mb-2 font-medium">
            Colors (comma separated)
          </label>
          <Input
            className="mb-4"
            placeholder="#6366f1, #f87171"
            value={colors}
            onChange={e => setColors(e.target.value)}
          />
          <label className="block mb-2 font-medium">
            Style (JSON object)
          </label>
          <Input
            className="mb-4"
            placeholder='e.g. {"border":"2px solid #6366f1"}'
            value={style}
            onChange={e => setStyle(e.target.value)}
          />
          
          {error && <Error message={error} />}
          {success && (
            <div className="mb-4 text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2">
              {success}
            </div>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Widget"}
          </Button>
        </form>
      </div>
    </main>
  );
}
