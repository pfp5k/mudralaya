const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Connection string from previous scripts
const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runLinkUpdate() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const schemaPath = path.join(
      __dirname,
      "..",
      "supabase",
      "link_users_to_requests.sql"
    );
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing link_users_to_requests.sql...");
    await client.query(sql);

    console.log("Link & Sync logic applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runLinkUpdate();
