import { getConfigLayoutByDashboardId, upsertConfigLayout } from "../services/configLayoutsService.js";

// GET /api/dashboards/:id/layout
export async function getConfigLayoutController(req, res) {
  const dashboardId = parseInt(req.params.id, 10);
  if (isNaN(dashboardId)) {
    return res.status(400).json({ message: "Invalid dashboard id" });
  }
  try {
    const config = await getConfigLayoutByDashboardId(dashboardId);
    if (!config) {
      return res.status(404).json({ message: "No layout config found" });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch layout config", error: err.message });
  }
}

// POST /api/dashboards/:id/layout
export async function upsertConfigLayoutController(req, res) {
  const dashboardId = parseInt(req.params.id, 10);
  if (isNaN(dashboardId)) {
    return res.status(400).json({ message: "Invalid dashboard id" });
  }
  const { layout } = req.body;
  if (!layout) {
    return res.status(400).json({ message: "Missing layout in request body" });
  }
  try {
    const updated = await upsertConfigLayout(dashboardId, layout);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to save layout config", error: err.message });
  }
}
