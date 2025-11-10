import { createWidget, loadWidgets, updateWidget, deleteWidget, createDashboard, loadDashboards, getWidgetsForDashboard } from "../services/widgetsService.js";

/**
 * Controller to handle creating a new widget.
 * Expects widget data in req.body.
 */
export async function createWidgetController(req, res) {
  try {
    const widget = req.body;
    if (!widget || !widget.type || !widget.name) {
      return res.status(400).json({ error: "Widget type and name are required." });
    }
    const newWidget = await createWidget(widget);
    res.status(201).json(newWidget);
  } catch (err) {
    res.status(500).json({ error: "Failed to create widget." });
  }
}

/**
 * Controller to get all widgets.
 */
export async function getWidgetsController(req, res) {
  try {
    const widgets = await loadWidgets();
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to load widgets." });
  }
}

/**
 * Controller to update a widget by id.
 */
export async function updateWidgetController(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (!id) return res.status(400).json({ error: "Widget id is required." });
    const updated = await updateWidget(id, updates);
    if (!updated) return res.status(404).json({ error: "Widget not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update widget." });
  }
}

/**
 * Controller to delete a widget by id.
 */
export async function deleteWidgetController(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Widget id is required." });
    const deleted = await deleteWidget(id);
    if (!deleted) return res.status(404).json({ error: "Widget not found." });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete widget." });
  }
}

/**
 * Controller to create a new dashboard.
 * Expects { name, widgets } in req.body.
 */
export async function createDashboardController(req, res) {
  try {
    const { name, widgets } = req.body;
    if (!name) return res.status(400).json({ error: "Dashboard name is required." });
    const dashboard = await createDashboard({ name, widgets });
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to create dashboard." });
  }
}

/**
 * Controller to get all dashboards.
 */
export async function getDashboardsController(req, res) {
  try {
    const dashboards = await loadDashboards();
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboards." });
  }
}

/**
 * Controller to get widgets for a specific dashboard.
 */
export async function getDashboardWidgetsController(req, res) {
  try {
    const dashboardId = req.params.id;
    if (!dashboardId) {
      return res.status(400).json({ error: "Dashboard id is required." });
    }
    const widgets = await getWidgetsForDashboard(dashboardId);
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to load widgets for dashboard." });
  }
}
