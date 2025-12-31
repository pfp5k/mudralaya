const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function runRpcMigration() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    const sqlPath = path.join(
      __dirname,
      "..",
      "supabase",
      "wallet_stats_rpc.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executing RPC migration...");
    await client.query(sql);

    console.log("RPC function created successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runRpcMigration();
