import 'dotenv/config'; // Load environment variables at the very top
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Ensure that the DATABASE_URL environment variable is present
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// Initialize Drizzle ORM with the schema
export const db = drizzle(sql, { schema });
