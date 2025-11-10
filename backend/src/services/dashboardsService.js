import { sql } from "../db.js";

/**
 * Ensure the dashboards table exists in Neon DB.
 */
export async function ensureDashboardsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS dashboards (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      widgets INTEGER[] -- Array of widget ids
    );
  `;
}

/**
 * Create a new dashboard.
 * @param {object} dashboard - { name, widgets }
 * @returns {object} The created dashboard.
 */
export async function createDashboard(dashboard) {
  const { name, widgets } = dashboard;
  const [row] = await sql`
    INSERT INTO dashboards (name, widgets)
    VALUES (${name}, ${widgets || []})
    RETURNING *;
  `;
  return row;
}

/**
 * Get all dashboards.
 * @returns {Array} List of dashboards.
 */
export async function loadDashboards() {
  const rows = await sql`SELECT * FROM dashboards ORDER BY id ASC;`;
  // For each dashboard, fetch its widgets as objects
  const widgetsMap = {};
  // Preload all widgets to avoid N+1 queries
  const allWidgets = await sql`SELECT * FROM widgets ORDER BY id ASC;`;
  function parseWidgetFields(widget) {
    return {
      ...widget,
      style: widget.style && typeof widget.style === "string" ? JSON.parse(widget.style) : widget.style,
      colors: widget.colors && typeof widget.colors === "string" ? JSON.parse(widget.colors) : widget.colors,
      size: widget.size && typeof widget.size === "string" ? JSON.parse(widget.size) : widget.size,
    };
  }
  for (const widget of allWidgets) {
    widgetsMap[widget.id] = parseWidgetFields(widget);
  }
  // Attach widgets as objects to each dashboard
  return rows.map(d => ({
    ...d,
    widgets: Array.isArray(d.widgets)
      ? d.widgets.map(id => widgetsMap[id]).filter(Boolean)
      : [],
  }));
}

/**
 * Get all widgets for a specific dashboard.
 * @param {number} dashboardId - Dashboard id.
 * @returns {Array} List of widgets for the dashboard.
 */
export async function getWidgetsForDashboard(dashboardId) {
  const [dashboard] = await sql`SELECT * FROM dashboards WHERE id = ${dashboardId};`;
  if (!dashboard || !dashboard.widgets || dashboard.widgets.length === 0) return [];
  const widgetIds = dashboard.widgets;
  const widgets = await sql`SELECT * FROM widgets WHERE id = ANY(${widgetIds});`;
  return widgets;
}

/**
 * Delete a dashboard by id.
 * @param {number} id - Dashboard id.
 * @returns {object} The deleted dashboard.
 */
export async function deleteDashboard(id) {
  const [row] = await sql`
    DELETE FROM dashboards WHERE id = ${id} RETURNING *;
  `;
  return row;
}
