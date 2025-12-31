const { Client } = require("pg");

const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function debugSync() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    // Check join_requests specifically for the number ending in 2222222222
    console.log("\n--- Checking join_requests ---");
    const joinRes = await client.query(`
      SELECT id, mobile_number, user_id, full_name, email_id 
      FROM public.join_requests 
      WHERE mobile_number LIKE '%2222222222'
    `);
    if (joinRes.rows.length === 0) {
      console.log("No join_request found for *2222222222");
    } else {
      console.table(joinRes.rows);
    }

    // Check auth.users for the same
    console.log("\n--- Checking auth.users ---");
    const authRes = await client.query(`
      SELECT id, phone, created_at 
      FROM auth.users 
      WHERE phone LIKE '%2222222222'
    `);
    console.table(authRes.rows);

    if (authRes.rows.length > 0) {
      const userId = authRes.rows[0].id;
      // Check public.users
      console.log(`\n--- Checking public.users for ID ${userId} ---`);
      const pubRes = await client.query(
        `
            SELECT id, phone, full_name, role 
            FROM public.users 
            WHERE id = $1
        `,
        [userId]
      );
      console.table(pubRes.rows);
    }
  } catch (err) {
    console.error("Debug failed:", err);
  } finally {
    await client.end();
  }
}

debugSync();
