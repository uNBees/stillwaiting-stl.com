const ADMIN_PASSWORD = "stillwaiting2026";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}

function checkAuth(request) {
  const auth = request.headers.get("Authorization");
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  return null;
}

// GET - list all shows (public, no auth needed)
async function handleGet(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM shows ORDER BY date ASC"
  ).all();
  return jsonResponse({ shows: results });
}

// POST - add a show (auth required)
async function handlePost(request, env) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { date, venue, city, details, status } = body;

  if (!date || !venue || !city) {
    return jsonResponse({ error: "date, venue, and city are required" }, 400);
  }

  const result = await env.DB.prepare(
    "INSERT INTO shows (date, venue, city, details, status) VALUES (?, ?, ?, ?, ?)"
  ).bind(date, venue, city, details || "", status || "upcoming").run();

  return jsonResponse({ success: true, id: result.meta.last_row_id }, 201);
}

// DELETE - remove a show (auth required)
async function handleDelete(request, env) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return jsonResponse({ error: "id is required" }, 400);
  }

  await env.DB.prepare("DELETE FROM shows WHERE id = ?").bind(id).run();
  return jsonResponse({ success: true });
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  try {
    if (method === "GET") return await handleGet(env);
    if (method === "POST") return await handlePost(request, env);
    if (method === "DELETE") return await handleDelete(request, env);
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}