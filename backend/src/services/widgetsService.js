import { sql } from "../db.js";

/**
 * Ensure the widgets table exists in Neon DB.
 */
export async function ensureWidgetsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS widgets (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT,
      colors JSONB,
      style JSONB,
      size JSONB,
      widgetName TEXT
    );
  `;
}

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
 * Load all widgets from the database.
 */
export async function loadWidgets() {
  const rows = await sql`SELECT * FROM widgets ORDER BY id ASC;`;
  return rows;
}

/**
 * Add a new widget to the database.
 * @param {object} widget - The widget object to add.
 * @returns {object} The created widget (with id).
 */
export async function createWidget(widget) {
  const { type, name, title, colors, style, size, widgetName } = widget;
  const [row] = await sql`
    INSERT INTO widgets (type, name, title, colors, style, size, widgetName)
    VALUES (
      ${type},
      ${name},
      ${title || null},
      ${colors ? JSON.stringify(colors) : null},
      ${style ? JSON.stringify(style) : null},
      ${size ? JSON.stringify(size) : null},
      ${widgetName || null}
    )
    RETURNING *;
  `;
  return row;
}

/**
 * Update a widget by id.
 * @param {number} id - Widget id.
 * @param {object} updates - Updated widget fields.
 * @returns {object} The updated widget.
 */
export async function updateWidget(id, updates) {
  const { type, name, title, colors, style, size, widgetName } = updates;
  const [row] = await sql`
    UPDATE widgets
    SET
      type = ${type},
      name = ${name},
      title = ${title || null},
      colors = ${colors ? JSON.stringify(colors) : null},
      style = ${style ? JSON.stringify(style) : null},
      size = ${size ? JSON.stringify(size) : null},
      widgetName = ${widgetName || null}
    WHERE id = ${id}
    RETURNING *;
  `;
  return row;
}

/**
 * Delete a widget by id.
 * @param {number} id - Widget id.
 * @returns {object} The deleted widget.
 */
export async function deleteWidget(id) {
  const [row] = await sql`
    DELETE FROM widgets WHERE id = ${id} RETURNING *;
  `;
  return row;
}

/**
 * Get all widgets for a specific dashboard.
 * @param {number} dashboardId - Dashboard id.
 * @returns {Array} List of widgets for the dashboard.
 */
export async function getWidgetsForDashboard(dashboardId) {
  // Get the dashboard and its widget ids
  const [dashboard] = await sql`SELECT * FROM dashboards WHERE id = ${dashboardId};`;
  if (!dashboard || !dashboard.widgets || dashboard.widgets.length === 0) return [];
  // Query widgets by id array
  const widgetIds = dashboard.widgets;
  // Use ANY to match array of ids
  const widgets = await sql`SELECT * FROM widgets WHERE id = ANY(${widgetIds});`;
  return widgets;
}
