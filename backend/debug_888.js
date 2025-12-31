const { Client } = require("pg");

const connectionString =
  "postgresql://postgres:Mudralaya.Fintech@db.mhsizqmhqngcaztresmh.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function debugSpecific() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    // Check join_requests specifically for the user ending in 8888888888
    console.log("\n--- Checking join_requests for *8888888888 ---");
    const joinRes = await client.query(`
      SELECT id, mobile_number, user_id, full_name, email_id
      FROM public.join_requests 
      WHERE mobile_number LIKE '%8888888888'
    `);
    console.log("Join Requests Found:", JSON.stringify(joinRes.rows, null, 2));

    // Check auth.users
    console.log("\n--- Checking auth.users for *8888888888 ---");
    const authRes = await client.query(`
      SELECT id, phone, created_at 
      FROM auth.users 
      WHERE phone LIKE '%8888888888' OR raw_user_meta_data->>'phone' LIKE '%8888888888'
    `);
    if (authRes.rows.length === 0) {
      console.log("No auth user found for *8888888888");
    } else {
      console.log("Auth User Found:", JSON.stringify(authRes.rows, null, 2));
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
      console.log("Public User Found:", JSON.stringify(pubRes.rows, null, 2));
    }
  } catch (err) {
    console.error("Debug failed:", err);
  } finally {
    await client.end();
  }
}

debugSpecific();
