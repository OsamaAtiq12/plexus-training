import bcrypt from "bcryptjs";
import { sql } from "./db.js";

export async function ensureUsersTable() {
  if (!sql) return;
  // create users table if not exists; using text id generated in app
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;
}

export async function findUserByEmail(email) {
  if (!sql) return null;
  const rows = await sql`
    SELECT id, name, email, password_hash FROM users WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  if (!rows || rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
  };
}

export async function createUser({ name, email, password }) {
  if (!sql) throw new Error("Database not configured");
  const id = String(Date.now());
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (${id}, ${name}, ${email}, ${passwordHash})
    RETURNING id, name, email
  `;
  const row = rows[0];
  return { id: row.id, name: row.name, email: row.email, passwordHash };
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
