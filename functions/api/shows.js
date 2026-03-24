export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM shows ORDER BY date ASC"
    ).all();
    return Response.json({ shows: results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { date, venue, city, details } = await request.json();

    if (!date || !venue || !city) {
      return Response.json({ error: "date, venue, and city are required" }, { status: 400 });
    }

    const result = await env.DB.prepare(
      "INSERT INTO shows (date, venue, city, details, status) VALUES (?, ?, ?, ?, ?)"
    ).bind(date, venue, city, details || "", "upcoming").run();

    return Response.json({ success: true, id: result.meta.last_row_id }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    await env.DB.prepare("DELETE FROM shows WHERE id = ?").bind(id).run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}