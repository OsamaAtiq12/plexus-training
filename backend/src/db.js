import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Neon database will not be available.");
}

export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;
