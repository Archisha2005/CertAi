import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // <-- ensures .env is loaded before accessing DATABASE_URL

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing — please set it in your .env file");
}

export default defineConfig({
  out: "./migrations", // or "./drizzle" if you prefer
  schema: "./shared/schema.ts", // correct path
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
