const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // Always send cookies for session persistence
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

export function signup(name, email, password) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: { name, email, password },
  });
}

export function login(email, password) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getMe(token) {
  return apiRequest("/api/auth/me", { token });
}

export function logout() {
  return apiRequest("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

/**
 * Fetch all widgets (requires auth token).
 */
export function getWidgets(token) {
  return apiRequest("/api/widgets", { token });
}

/**
 * Create a new widget (requires auth token).
 * @param {object} widget - Widget data
 * @param {string} token - Auth token
 */
export function createWidget(widget, token) {
  return apiRequest("/api/widgets", {
    method: "POST",
    body: widget,
    token,
  });
}

/**
 * Update a widget by id (requires auth token).
 * @param {number|string} id - Widget id
 * @param {object} updates - Updated widget data
 * @param {string} token - Auth token
 */
export function updateWidget(id, updates, token) {
  return apiRequest(`/api/widgets/${id}`, {
    method: "PUT",
    body: updates,
    token,
  });
}

/**
 * Delete a widget by id (requires auth token).
 * @param {number|string} id - Widget id
 * @param {string} token - Auth token
 */
export function deleteWidget(id, token) {
  return apiRequest(`/api/widgets/${id}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Fetch all dashboards (requires auth token).
 */
export function getDashboards(token) {
  return apiRequest("/api/dashboards", { token });
}

/**
 * Create a new dashboard (requires auth token).
 * @param {object} dashboard - { name, widgets }
 * @param {string} token - Auth token
 */
export function createDashboard(dashboard, token) {
  return apiRequest("/api/dashboards", {
    method: "POST",
    body: dashboard,
    token,
  });
}

/**
 * Fetch widgets for a specific dashboard (requires auth token).
 * @param {number|string} dashboardId
 * @param {string} token
 */
export function getDashboardWidgets(dashboardId, token) {
  return apiRequest(`/api/dashboards/${dashboardId}/widgets`, { token });
}

/**
 * Delete a dashboard by id (requires auth token).
 * @param {number|string} dashboardId
 * @param {string} token
 */
export function deleteDashboard(dashboardId, token) {
  return apiRequest(`/api/dashboards/${dashboardId}`, {
    method: "DELETE",
    token,
  });
}

export function getDashboardLayout(dashboardId, token) {
  return apiRequest(`/api/dashboards/${dashboardId}/layout`, { token });
}

export function saveDashboardLayout(dashboardId, layout, token) {
  return apiRequest(`/api/dashboards/${dashboardId}/layout`, {
    method: "POST",
    body: { layout },
    token,
  });
}
