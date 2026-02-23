export async function onRequestGet({ env, request }) {
const url = new URL(request.url);
const includeDone = url.searchParams.get("includeDone") === "1";
const includeDeleted = url.searchParams.get("includeDeleted") === "1";

// Build conditions
const where = [];
const params = [];

if (!includeDeleted) where.push("deleted_at IS NULL");

// Your existing “hide completed older than 7 days unless includeDone=1”
if (!includeDone) {
  where.push("(status != 'done' OR completed_at IS NULL OR completed_at >= ?)");
  params.push(Date.now() - 7 * 24 * 60 * 60 * 1000);
}

const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

const { results } = await env.DB.prepare(`
  SELECT id, title, notes, requested_at, requested_date, status, completed_at, deleted_at
  FROM requests
  ${whereSql}
  ORDER BY requested_at DESC
  LIMIT 200
`).bind(...params).all();

return Response.json({ ok: true, results });
}