const { Client } = require("pg");
const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";
const client = new Client({ connectionString });
client
  .connect()
  .then(() => {
    console.log("Connected successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed", err);
    process.exit(1);
  });
