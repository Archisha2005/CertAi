import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_5KVFgruxn9ZX@ep-aged-shadow-ad26mw3h-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sid varchar NOT NULL COLLATE "default",
        sess json NOT NULL,
        expire timestamp(6) NOT NULL,
        CONSTRAINT user_sessions_pkey PRIMARY KEY (sid)
      );
      CREATE INDEX IF NOT EXISTS IDX_user_sessions_expire ON user_sessions (expire);
    `);
    console.log("✅ user_sessions table created successfully (or already exists)");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  } finally {
    await pool.end();
  }
}

createTable();
