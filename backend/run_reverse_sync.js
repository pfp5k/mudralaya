const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runReverseSync() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const schemaPath = path.join(
      __dirname,
      "..",
      "supabase",
      "reverse_sync_trigger.sql"
    );
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing reverse_sync_trigger.sql...");
    await client.query(sql);

    console.log("Reverse Sync Trigger applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runReverseSync();
