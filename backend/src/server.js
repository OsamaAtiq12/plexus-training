// Debug endpoint to view session data (development only)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import session from "express-session";
import { ensureUsersTable } from "./users.js";
import * as authController from "./controllers/authController.js";
// jwt import not needed here
import { sql } from "./db.js";
import { createWidgetController, getWidgetsController, updateWidgetController, deleteWidgetController } from "./controllers/widgetsController.js";
import {
  createDashboardController,
  getDashboardsController,
  getDashboardWidgetsController,
  deleteDashboardController
} from "./controllers/dashboardsController.js";
import { ensureWidgetsTable } from "./services/widgetsService.js";
import { ensureDashboardsTable } from "./services/dashboardsService.js";
import { ensureConfigLayoutsTable } from "./services/configLayoutsService.js";
import { getConfigLayoutController, upsertConfigLayoutController } from "./controllers/configLayoutsController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
    },
  })
);

function generateToken(payload) {
// generateToken now in utils/jwt.js
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.get("/api/debug/session", (req, res) => {
  authController.debugSession(req, res);
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req, res) => {
  authController.signup(req, res);
});

app.post("/api/auth/login", async (req, res) => {
  authController.login(req, res);
});

app.get("/api/auth/me", (req, res) => {
  authController.me(req, res);
});
// Logout endpoint
// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  console.log("Logout request received");
  authController.logout(req, res);
});

app.get("/api/widgets", authMiddleware, getWidgetsController);
app.post("/api/widgets", authMiddleware, createWidgetController);
app.put("/api/widgets/:id", authMiddleware, updateWidgetController);
app.delete("/api/widgets/:id", authMiddleware, deleteWidgetController);

app.get("/api/dashboards", authMiddleware, getDashboardsController);
app.post("/api/dashboards", authMiddleware, createDashboardController);
app.delete("/api/dashboards/:id", authMiddleware, deleteDashboardController);
app.get("/api/dashboards/:id/widgets", authMiddleware, getDashboardWidgetsController);
app.get("/api/dashboards/:id/layout", authMiddleware, getConfigLayoutController);
app.post("/api/dashboards/:id/layout", authMiddleware, upsertConfigLayoutController);

async function start() {
  try {
    if (!sql) {
      console.warn(
        "Neon DATABASE_URL not set; using in-memory/file store is disabled."
      );
    } else {
      await ensureUsersTable();
      await ensureWidgetsTable();
      await ensureDashboardsTable();
      await ensureConfigLayoutsTable();
      console.log("Database ready");
    }
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

start();
