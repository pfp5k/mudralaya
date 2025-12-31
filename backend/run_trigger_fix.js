const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Connection string from previous scripts
const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runTriggerFix() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const schemaPath = path.join(
      __dirname,
      "..",
      "supabase",
      "ensure_auth_trigger.sql"
    );
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing ensure_auth_trigger.sql...");
    await client.query(sql);

    console.log("Trigger fix applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runTriggerFix();
