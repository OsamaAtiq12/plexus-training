import { sql } from "../db.js";

export async function ensureConfigLayoutsTable() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS config_layouts (
      id SERIAL PRIMARY KEY,
      dashboard_id INTEGER NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
      layout JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function getConfigLayoutByDashboardId(dashboardId) {
  if (!sql) return null;
  const rows = await sql`
    SELECT * FROM config_layouts WHERE dashboard_id = ${dashboardId} LIMIT 1
  `;
  if (!rows[0]) return null;
  // Parse layout JSON before returning
  return {
    ...rows[0],
    layout: typeof rows[0].layout === "string" ? JSON.parse(rows[0].layout) : rows[0].layout
  };
}

export async function upsertConfigLayout(dashboardId, layout) {
  if (!sql) return null;
  const layoutStr = typeof layout === "string" ? layout : JSON.stringify(layout);
  // Try update first
  const updated = await sql`
    UPDATE config_layouts
    SET layout = ${layoutStr}, updated_at = NOW()
    WHERE dashboard_id = ${dashboardId}
    RETURNING *;
  `;
  if (updated.length > 0) {
    return {
      ...updated[0],
      layout: typeof updated[0].layout === "string" ? JSON.parse(updated[0].layout) : updated[0].layout
    };
  }
  // If not found, insert
  const inserted = await sql`
    INSERT INTO config_layouts (dashboard_id, layout)
    VALUES (${dashboardId}, ${layoutStr})
    RETURNING *;
  `;
  return {
    ...inserted[0],
    layout: typeof inserted[0].layout === "string" ? JSON.parse(inserted[0].layout) : inserted[0].layout
  };
}
