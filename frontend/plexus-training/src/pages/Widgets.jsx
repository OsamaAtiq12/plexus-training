import { useEffect, useState } from "react";
import { getWidgets, updateWidget, deleteWidget } from "../api";
import Heading from "../components/ui/Heading";
import Error from "../components/ui/Error";
import Modal from "../components/ui/modal";
import KpiCard from "../components/widgets/KpiCard";
import ChartWidget from "../components/widgets/ChartWidget";
import TableWidget from "../components/widgets/TableWidget";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Widgets() {
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // "edit" or "delete"
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchWidgets();
  }, []);

  async function fetchWidgets() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in to view widgets.");
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

  function handleWidgetClick(widget) {
    console.log("Selected widget:", widget);
    setSelectedWidget(widget);
    setForm({
      type: widget.type,
      name: widget.name,
      title: widget.title,
      colors: Array.isArray(widget.colors) ? widget.colors.join(", ") : widget.colors || "",
      style: widget.style ? JSON.stringify(widget.style) : "",
      size: widget.size ? JSON.stringify(widget.size) : "",
      widgetName: widget.widgetname || widget.widgetName || "",
    });
    setModalMode("edit");
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setSelectedWidget(null);
    setForm({});
    setModalMode("edit");
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!selectedWidget) return;
    setError("");
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }
      // Parse fields
      const updates = {
        type: form.type,
        name: form.name,
        title: form.title,
        colors: form.colors
          ? form.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : undefined,
        style: form.style ? JSON.parse(form.style) : undefined,
        size: form.size ? JSON.parse(form.size) : undefined,
        widgetName: form.widgetName,
      };
      await updateWidget(selectedWidget.id, updates, token);
      await fetchWidgets();
      handleModalClose();
    } catch (err) {
      setError("Failed to update widget.");
    }
  }

  async function handleDelete() {
    if (!selectedWidget) return;
    setError("");
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }
      await deleteWidget(selectedWidget.id, token);
      await fetchWidgets();
      handleModalClose();
    } catch (err) {
      setError("Failed to delete widget.");
    }
  }

  function renderWidget(widget) {
    const commonProps = {
      onClick: () => handleWidgetClick(widget),
      style: { cursor: "pointer", ...widget.style },
    };
    if (widget.type === "kpi") {
      return <KpiCard key={widget.id} {...widget} {...widget.props} widgetName={widget.widgetname || widget.widgetName} {...commonProps} />;
    }
    if (widget.type === "chart") {
      return <ChartWidget key={widget.id} {...widget} {...widget.props} widgetName={widget.widgetname || widget.widgetName} {...commonProps} />;
    }
    if (widget.type === "table") {
      return <TableWidget key={widget.id} {...widget} {...widget.props} widgetName={widget.widgetname || widget.widgetName} {...commonProps} />;
    }
    return (
      <div key={widget.id} className="p-4 border rounded bg-slate-100 text-slate-700" style={commonProps.style} onClick={commonProps.onClick}>
        Unknown widget type: {widget.type}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1 p-8">
        <Heading className="mb-6">All Widgets</Heading>
        {loading && <div>Loading widgets...</div>}
        {error && <Error message={error} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {widgets.length === 0 ? (
              <div className="col-span-full text-center text-slate-400">No widgets found.</div>
            ) : (
              widgets.map(renderWidget)
            )}
          </div>
        )}

        <Modal open={modalOpen} onClose={handleModalClose} title={modalMode === "edit" ? "Edit Widget" : "Delete Widget"}>
          {modalMode === "edit" && selectedWidget && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block mb-1 text-sm font-medium">Type</label>
                <Input name="type" value={form.type} onChange={handleFormChange} required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <Input name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Title</label>
                <Input name="title" value={form.title} onChange={handleFormChange} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Colors (comma separated)</label>
                <Input name="colors" value={form.colors} onChange={handleFormChange} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Style (JSON)</label>
                <Input name="style" value={form.style} onChange={handleFormChange} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Size (JSON)</label>
                <Input name="size" value={form.size} onChange={handleFormChange} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Widget Name</label>
                <Input name="widgetName" value={form.widgetName} onChange={handleFormChange} />
              </div>
              {error && <Error message={error} />}
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="w-full">Save</Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => setModalMode("delete")}
                >
                  Delete
                </Button>
              </div>
            </form>
          )}
          {modalMode === "delete" && selectedWidget && (
            <div>
              <p className="mb-4">Are you sure you want to delete this widget?</p>
              {error && <Error message={error} />}
              <div className="flex gap-2">
                <Button variant="destructive" className="w-full" onClick={handleDelete}>
                  Confirm Delete
                </Button>
                <Button className="w-full" onClick={() => setModalMode("edit")}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
