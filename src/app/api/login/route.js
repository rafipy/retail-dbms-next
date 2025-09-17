import { getConnection } from "@/lib/db"; // <-- We'll use our MySQL connection helper
import bcrypt from "bcrypt"; // <-- To safely compare passwords

// The POST handler is what runs when your form calls fetch("/api/login", { method: "POST" })
export async function POST(req) {
  try {

    // Parse the incoming JSON body
    const { ID, password, role } = await req.json();


    if (!ID || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const conn = await getConnection();

    const [rows] = await conn.execute(
      "SELECT id, password_hash, role FROM users WHERE id = ? AND role = ?",
      [ID, role]
    );

    await conn.end();

    if (rows.length === 0) {
      // No user found with that ID and role
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

    return new Response(
      JSON.stringify({ message: "Login successful", user }),
      { status: 200 } // Successful Login Status
    );
  } catch (err) {
    console.error("Login API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500, // Internal Server Error
    });
  }
}
