import dotenv from "dotenv";
import path from "path";

// Force dotenv to load from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found. Check your .env file path and name.");
}

export const DATABASE_URL = process.env.DATABASE_URL!;
