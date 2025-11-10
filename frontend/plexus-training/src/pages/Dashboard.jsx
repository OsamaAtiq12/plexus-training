import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { clearToken, getToken } from "../auth";
import { getMe, getDashboards, getDashboardWidgets, getDashboardLayout, logout } from "../api";
import KpiCard from "../components/widgets/KpiCard";
import TableWidget from "../components/widgets/TableWidget";
import ChartWidget from "../components/widgets/ChartWidget";
import { dummyKpiCardsData } from "../lib/utils";
import { useParams } from "react-router-dom";

export function DashboardWrapper() {
  // Use dashboardId from route params for dynamic routing
  const { dashboardId } = useParams();
  return <Dashboard activeDashboard={dashboardId ? Number(dashboardId) : undefined} />;
}

export default function Dashboard({ activeDashboard: propActiveDashboard }) {
  // Use prop if provided, else fallback to context (for compatibility)
  const context = useOutletContext && useOutletContext();
  const activeDashboard = propActiveDashboard ?? (context && context.activeDashboard);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [dashboards, setDashboards] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    getMe(token)
      .then((res) => setUser(res.user))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const token = getToken();
        const data = await getDashboards(token);
        setDashboards(data || []);
      } catch (err) {
        setDashboards([]);
        setError("Failed to load dashboards");
      }
    }
    fetchDashboards();
  }, []);

  useEffect(() => {
    async function fetchLayoutAndWidgets() {
      if (!activeDashboard) {
        setWidgets([]);
        setLayout([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = getToken();
        // Fetch layout (order of widget IDs)
        let layoutConfig = [];
        try {
          const layoutRes = await getDashboardLayout(activeDashboard, token);
          if (layoutRes && Array.isArray(layoutRes.layout)) {
            layoutConfig = layoutRes.layout;
          }
        } catch (e) {
          // If layout not found, fallback to widget order
        }
        // Fetch all widgets for the dashboard
        const data = await getDashboardWidgets(activeDashboard, token);
        setWidgets(data || []);
        setLayout(layoutConfig);
      } catch (err) {
        setWidgets([]);
        setLayout([]);
        setError("Failed to load dashboard or widgets");
      } finally {
        setLoading(false);
      }
    }
    fetchLayoutAndWidgets();
  }, [activeDashboard]);

 

  return (
    <div className="flex  bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {(() => {
                const current = dashboards.find((d) => d.id === activeDashboard);
                return current ? `${current.name} dashboard` : "Dashboard";
              })()}
            </h2>
            <p className="text-muted-foreground mt-1">
              Welcome back{user ? `, ${user.name}` : ""}.
            </p>
          </div>
          
        </div>
        
        {/* Removed tab UI for dashboard name */}
        {loading ? (
          <div>Loading widgets...</div>
        ) : (
          <div className="rounded-lg shadow p-6 h-full flex flex-col">
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                gridAutoRows: "minmax(220px, auto)",
                minHeight: 200,
              }}
            >
              {(
                layout.length > 0
                  ? (
                      typeof layout[0] === "object" && layout[0].type
                        ? layout // array of widget objects (new format)
                        : layout
                            .map((id) => widgets.find((w) => w.id === id))
                            .filter(Boolean)
                    )
                  : widgets
              ).map((w, i) => (
                <div key={w.id}>
                  {w.type === "kpi" && (
                    <KpiCard
                      {...dummyKpiCardsData[i % dummyKpiCardsData.length]}
                      {...(w.props ? { style: w.props.style, size: w.props.size } : {})}
                    />
                  )}
                  {w.type === "chart" && (
                    <ChartWidget
                      {...(w.props ? w.props : w)}
                      size={
                        w.props && w.props.size
                          ? w.props.size
                          : { width: 600, height: 300 }
                      }
                      style={{
                        minWidth: 600,
                        minHeight: 300,
                        maxWidth: 600,
                        maxHeight: 300,
                        ...(w.props && w.props.style ? w.props.style : {}),
                      }}
                    />
                  )}
                  {w.type === "table" && <TableWidget {...(w.props ? w.props : w)} />}
                </div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="mt-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
