import {
  createDashboard,
  loadDashboards,
  getWidgetsForDashboard,
  deleteDashboard,
} from "../services/dashboardsService.js";

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

/**
 * Controller to delete a dashboard by id.
 */
export async function deleteDashboardController(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Dashboard id is required." });
    const deleted = await deleteDashboard(id);
    if (!deleted) return res.status(404).json({ error: "Dashboard not found." });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete dashboard." });
  }
}
