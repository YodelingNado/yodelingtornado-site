export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const includeDone = url.searchParams.get("includeDone") === "1";

  // Always hide soft-deleted
  let where = `WHERE deleted_at IS NULL`;
  const binds = [];

  // If NOT includeDone, hide ALL done requests
  if (!includeDone) {
    where += ` AND status != 'done'`;
  }

  const { results } = await env.DB.prepare(`
    SELECT id, title, notes, requested_at, requested_date, status, completed_at, deleted_at
    FROM requests
    ${where}
    ORDER BY requested_at DESC
    LIMIT 200
  `).bind(...binds).all();

  return Response.json({ ok: true, results });
}