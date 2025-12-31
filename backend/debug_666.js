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

    // Check join_requests specifically for the number ending in 6666666666
    console.log("\n--- Checking join_requests for *6666666666 ---");
    const joinRes = await client.query(`
      SELECT id, mobile_number, user_id, full_name 
      FROM public.join_requests 
      WHERE mobile_number LIKE '%6666666666'
    `);
    console.table(joinRes.rows);

    // Check auth.users
    console.log("\n--- Checking auth.users for *6666666666 ---");
    const authRes = await client.query(`
      SELECT id, phone, created_at 
      FROM auth.users 
      WHERE phone LIKE '%6666666666'
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

      // Debugging the MATCH logic manually
      const phone = authRes.rows[0].phone;
      const mobile =
        joinRes.rows.length > 0 ? joinRes.rows[0].mobile_number : "N/A";

      console.log(`\n--- Match Debug ---`);
      console.log(`Auth Phone: '${phone}' (Length: ${phone.length})`);
      console.log(`Join Mobile: '${mobile}' (Length: ${mobile.length})`);
      console.log(`Right 10 Auth: '${phone.slice(-10)}'`);
      console.log(`Right 10 Join: '${mobile.slice(-10)}'`);
      console.log(`Match? ${phone.slice(-10) === mobile.slice(-10)}`);
    }
  } catch (err) {
    console.error("Debug failed:", err);
  } finally {
    await client.end();
  }
}

debugSpecific();
