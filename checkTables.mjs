import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function checkTables() {
  try {
    await client.connect();
    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
    );
    console.log("Tables in your database:");
    console.log(res.rows);
  } catch (err) {
    console.error("Error checking tables:", err);
  } finally {
    await client.end();
  }
}

checkTables();
