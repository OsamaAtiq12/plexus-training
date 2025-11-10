import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SweetAlert from "../components/ui/SweetAlert";
import { Button } from "../components/ui/button";
import KpiCard from "../components/widgets/KpiCard";
import ChartWidget from "../components/widgets/ChartWidget";
import TableWidget from "../components/widgets/TableWidget";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getDashboards, getWidgets, getDashboardLayout, saveDashboardLayout } from "../api";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { dummyKpiCardsData } from "../lib/utils";

// Custom styles for resize handle and widget highlight
const baseResizableHandleStyle = {
  position: "absolute",
  width: 20,
  height: 20,
  right: 0,
  bottom: 0,
  background: "linear-gradient(135deg, #3b82f6 60%, #fff0 60%)",
  borderRadius: "0 0 6px 0",
  cursor: "se-resize",
  zIndex: 10,
  boxShadow: "0 0 2px #3b82f6",
  transform: "translate(-100%, -100%)"
};
const widgetContainerStyle = {
  position: "relative",
  transition: "box-shadow 0.2s, border 0.2s"
};



function DraggableWidget({ id, index, moveWidget, children }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "WIDGET",
    hover(item) {
      if (item.index === index) return;
      moveWidget(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      {children}
    </div>
  );
}

// FIX: Move all hooks to the top level, outside of conditionals

export default function DashboardEditor() {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Widget selection state (MOVED HERE)
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState("");

  // Fetch available widgets from the API (MOVED HERE)
  useEffect(() => {
    async function fetchWidgets() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        const widgets = await getWidgets(token);
        setAvailableWidgets(widgets || []);
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchWidgets();
  }, []);

  // Always define widgets and selectedType state, but initialize based on dashboardId and dashboards
  // We'll update widgets when dashboards or dashboardId changes
  const [widgets, setWidgets] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const widgetsInitializedRef = useRef({});

  // Initialize widgets from dashboard only on first load or dashboard switch
  useEffect(() => {
    async function fetchLayoutConfig() {
      if (!dashboardId) return;
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      try {
        // Fetch all widgets for the dashboard
        let dashboardWidgets = [];
        try {
          // Try to get widgets from dashboards state if available
          const dashboard = dashboards.find((d) => String(d.id) === String(dashboardId));
          if (dashboard && Array.isArray(dashboard.widgets)) {
            dashboardWidgets = dashboard.widgets;
          }
        } catch (e) {}
        // If not found in dashboards, fetch from API
        if (!dashboardWidgets.length) {
          try {
            dashboardWidgets = await getWidgets(token);
          } catch (e) {}
        }
        const config = await getDashboardLayout(dashboardId, token);
        if (config && Array.isArray(config.layout)) {
          // If layout is an array of widget objects, use as-is. If array of IDs, map to widget objects.
          let ordered;
          if (config.layout.length > 0 && typeof config.layout[0] === "object" && config.layout[0].type) {
            ordered = config.layout;
          } else {
            ordered = config.layout
              .map((id) => dashboardWidgets.find((w) => String(w.id) === String(id)))
              .filter(Boolean);
          }
          setWidgets(ordered);
          widgetsInitializedRef.current[dashboardId] = true;
          return;
        }
      } catch (err) {
        // If not found, fallback to dashboard widgets
      }
      // Fallback: use dashboard widgets
      if (dashboards.length > 0) {
        const dashboard = dashboards.find((d) => String(d.id) === String(dashboardId));
        if (
          dashboard &&
          !widgetsInitializedRef.current[dashboardId]
        ) {
          setWidgets(dashboard.widgets ? dashboard.widgets : []);
          widgetsInitializedRef.current[dashboardId] = true;
        }
      }
    }
    fetchLayoutConfig();
  }, [dashboardId, dashboards]);

  // Reset widgetsInitializedRef when dashboardId changes
  useEffect(() => {
    if (dashboardId) {
      widgetsInitializedRef.current = { [dashboardId]: false };
    }
  }, [dashboardId]);

  useEffect(() => {
    async function fetchDashboards() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("You must be logged in to view dashboards.");
          setLoading(false);
          return;
        }
        const data = await getDashboards(token);
        setDashboards(data || []);
      } catch (err) {
        setError("Failed to load dashboards.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboards();
  }, []);

  function addWidget() {
    if (!selectedWidgetId) return;
    const widgetTemplate = availableWidgets.find(w => String(w.id) === String(selectedWidgetId));
    if (!widgetTemplate) return;
    const id = widgets.length ? Math.max(...widgets.map(w => w.id)) + 1 : 1;
    // Clone the widget template, assign a new id, and copy its type/props
    setWidgets([
      ...widgets,
      {
        id,
        type: widgetTemplate.type,
        props: { ...widgetTemplate.props }
      }
    ]);
    setSelectedWidgetId("");
  }

  function moveWidget(from, to) {
    setWidgets((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(from, 1);
      updated.splice(to, 0, removed);
      return updated;
    });
  }

  async function saveLayout() {
    if (!dashboardId) return;
    const token = localStorage.getItem("auth_token");
    if (!token) {
      SweetAlert({
        type: "warning",
        title: "Not logged in",
        text: "You must be logged in to save layouts."
      });
      return;
    }
    try {
      // Save the full widget objects (id, type, props) as the layout
      await saveDashboardLayout(dashboardId, widgets, token);
      SweetAlert({
        type: "success",
        title: "Success",
        text: "Layout and widgets saved!"
      });
    } catch (err) {
      SweetAlert({
        type: "error",
        title: "Save Failed",
        text: "Failed to save layout: " + (err.message || "Unknown error")
      });
    }
  }

// Track which widget is selected for dragging/resizing
const [selectedWidgetIndex, setSelectedWidgetIndex] = useState(null);

  // If editing a specific dashboard
  if (dashboardId) {
    const dashboard = dashboards.find((d) => String(d.id) === String(dashboardId));
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
          <main
            className="flex-1 p-8"
            onClick={() => setSelectedWidgetIndex(null)}
          >
            <Button variant="secondary" className="mb-4" onClick={() => navigate("/dashboard-editor")}>
              Back to Dashboards
            </Button>
            <h2 className="text-2xl font-bold mb-4">{dashboard?.name || "Dashboard"} Editor</h2>
            <div className="flex items-center gap-4 mb-6">
              <select
                className="border rounded px-3 py-2 bg-background"
                value={selectedWidgetId}
                onChange={e => setSelectedWidgetId(e.target.value)}
              >
                <option value="">Add widget...</option>
                {availableWidgets.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.type})
                  </option>
                ))}
              </select>
              <Button onClick={addWidget}>Add Widget</Button>
              <Button variant="secondary" onClick={saveLayout}>Save Layout</Button>
            </div>
            {/* Handle position controls for selected widget (rendered only once, outside the widget loop) */}
            {selectedWidgetIndex !== null && widgets[selectedWidgetIndex] && (
              <div className="mb-4 flex items-center gap-2">
                <span className="font-medium">Resizer Position (Selected Widget Only):</span>
                <label>
                  Right:
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={
                      (widgets[selectedWidgetIndex].props &&
                        widgets[selectedWidgetIndex].props.handlePosition &&
                        typeof widgets[selectedWidgetIndex].props.handlePosition.right === "number")
                        ? widgets[selectedWidgetIndex].props.handlePosition.right
                        : 0
                    }
                    onChange={e => {
                      const value = parseInt(e.target.value, 10) || 0;
                      setWidgets(prev => {
                        // Only update the selected widget, leave others unchanged
                        return prev.map((widget, idx) =>
                          idx === selectedWidgetIndex
                            ? {
                                ...widget,
                                props: {
                                  ...widget.props,
                                  handlePosition: {
                                    ...((widget.props && widget.props.handlePosition) || {}),
                                    right: value
                                  }
                                }
                              }
                            : widget
                        );
                      });
                    }}
                    className="border rounded px-2 py-1 w-20 mx-1"
                  />
                </label>
                <label>
                  Bottom:
                  <input
                    type="number"
                    min={0}
                    max={800}
                    value={
                      (widgets[selectedWidgetIndex].props &&
                        widgets[selectedWidgetIndex].props.handlePosition &&
                        typeof widgets[selectedWidgetIndex].props.handlePosition.bottom === "number")
                        ? widgets[selectedWidgetIndex].props.handlePosition.bottom
                        : 0
                    }
                    onChange={e => {
                      const value = parseInt(e.target.value, 10) || 0;
                      setWidgets(prev => {
                        // Only update the selected widget, leave others unchanged
                        return prev.map((widget, idx) =>
                          idx === selectedWidgetIndex
                            ? {
                                ...widget,
                                props: {
                                  ...widget.props,
                                  handlePosition: {
                                    ...((widget.props && widget.props.handlePosition) || {}),
                                    bottom: value
                                  }
                                }
                              }
                            : widget
                        );
                      });
                    }}
                    className="border rounded px-2 py-1 w-20 mx-1"
                  />
                </label>
              </div>
            )}
            <div
              className="grid gap-6"
              style={{
                minHeight: 200,
                gridTemplateColumns: "repeat(3, 1fr)", // 3 columns, adjust as needed
                gridAutoRows: "minmax(220px, auto)"    // fixed min height for consistency
              }}
              onClick={e => e.stopPropagation()}
            >
              {widgets.map((w, i) => {
                const defaultSize = w.type === "chart"
                  ? { width: 600, height: 300 }
                  : { width: 300, height: 200 };
                const size = w.props && w.props.size
                  ? w.props.size
                  : defaultSize;

                const onResize = (e, { size: newSize }) => {
                  setWidgets(prev =>
                    prev.map((widget, idx) =>
                      idx === i
                        ? {
                            ...widget,
                            props: {
                              ...widget.props,
                              size: { width: newSize.width, height: newSize.height }
                            }
                          }
                        : widget
                    )
                  );
                };

                const isSelected = selectedWidgetIndex === i;

                const widgetContent = (
                  <div
                    style={{
                      ...widgetContainerStyle,
                      width: size.width,
                      height: size.height,
                      border: isSelected ? "2px solid #3b82f6" : "2px solid transparent",
                      boxShadow: isSelected ? "0 0 0 2px #3b82f6" : undefined,
                      cursor: "pointer"
                    }}
                    className="group"
                    onClick={() => setSelectedWidgetIndex(i)}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none transition-all"
                      style={{
                        border: "2px solid transparent",
                        borderColor: undefined,
                        boxShadow: undefined
                      }}
                    />
                    {w.type === "kpi" && (
                      <KpiCard
                        {...dummyKpiCardsData[i % dummyKpiCardsData.length]}
                        {...(w.props ? { style: w.props.style, size } : { size })}
                      />
                    )}
                    {w.type === "chart" && <ChartWidget {...w.props} size={size} />}
                    {w.type === "table" && <TableWidget {...w.props} size={size} />}
                  </div>
                );

                return (
                  <div key={w.id}>
                    <DraggableWidget id={w.id} index={i} moveWidget={moveWidget}>
                      {isSelected ? (
                        <Resizable
                          width={size.width}
                          height={size.height}
                          onResize={onResize}
                          minConstraints={[150, 100]}
                          maxConstraints={[1000, 800]}
                        >
                          <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            {widgetContent}
                          </div>
                        </Resizable>
                      ) : (
                        <div
                          style={{
                            ...widgetContainerStyle,
                            width: size.width,
                            height: size.height,
                            border: "2px solid transparent",
                            cursor: "pointer"
                          }}
                          className="group"
                          onClick={e => { e.stopPropagation(); setSelectedWidgetIndex(i); }}
                        >
                          {w.type === "kpi" && (
                            <KpiCard
                              {...dummyKpiCardsData[i % dummyKpiCardsData.length]}
                              {...(w.props ? { style: w.props.style, size } : { size })}
                            />
                          )}
                          {w.type === "chart" && <ChartWidget {...w.props} size={size} />}
                          {w.type === "table" && <TableWidget {...w.props} size={size} />}
                        </div>
                      )}
                    </DraggableWidget>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </DndProvider>
    );
  }

  // If no dashboardId, show dashboards table
  return (
    <div className="flex bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboards</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div className="mb-4 text-gray-500">Loading dashboards...</div>
        ) : (
          <table className="min-w-full bg-white dark:bg-slate-900 rounded shadow border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Widgets</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.map((dashboard) => {
                // List actual widgets (name/type) for this dashboard
                const widgetList = (() => {
                  if (!dashboard.widgets || dashboard.widgets.length === 0) return "No widgets";
                  return (
                    <ul className="list-disc pl-4">
                      {dashboard.widgets.map(w =>
                        <li key={w.id}>
                          {w.name ? `${w.name} (${w.type})` : w.type}
                        </li>
                      )}
                    </ul>
                  );
                })();
                return (
                  <tr
                    key={dashboard.id}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <td className="px-4 py-2">{dashboard.id}</td>
                    <td className="px-4 py-2">{dashboard.name}</td>
                    <td className="px-4 py-2">{widgetList}</td>
                    <td className="px-4 py-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/dashboard-editor/${dashboard.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="ml-2"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete dashboard "${dashboard.name}"? This cannot be undone.`
                            )
                          ) {
                            try {
                              const token = localStorage.getItem("auth_token");
                              await import("../api").then(api =>
                                api.deleteDashboard(dashboard.id, token)
                              );
                              setDashboards(dashboards =>
                                dashboards.filter(d => d.id !== dashboard.id)
                              );
                            } catch (err) {
                              setError("Failed to delete dashboard.");
                            }
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
