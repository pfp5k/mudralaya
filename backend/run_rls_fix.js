const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Connection string from previous scripts
const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runRlsFix() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const schemaPath = path.join(
      __dirname,
      "..",
      "supabase",
      "fix_insert_policy.sql"
    );
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing fix_insert_policy.sql...");
    await client.query(sql);

    console.log("RLS Fix completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runRlsFix();
