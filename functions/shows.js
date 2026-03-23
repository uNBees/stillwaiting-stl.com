export async function onRequest({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM shows ORDER BY date ASC"
    ).all();
    return Response.json({ shows: results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}