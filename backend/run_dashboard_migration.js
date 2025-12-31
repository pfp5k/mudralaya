const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runDashboardSchema() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const sqlPath = path.join(
      __dirname,
      "..",
      "supabase",
      "dashboard_core_schema.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executing dashboard core schema migration...");
    await client.query(sql);

    console.log("Dashboard core tables created and seeded successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runDashboardSchema();
