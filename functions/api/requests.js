export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const includeDone = url.searchParams.get("includeDone") === "1";

  const nowMs = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const cutoffDone = nowMs - sevenDaysMs;

  let sql = `
    SELECT id, title, notes, requested_at, requested_date, status, completed_at
    FROM requests
    WHERE deleted_at IS NULL
  `;
  let binds = [];

  if (!includeDone) {
    sql += `
      AND (
        status != 'done'
        OR (status = 'done' AND (completed_at IS NULL OR completed_at >= ?))
      )
    `;
    binds.push(cutoffDone);
  }

  sql += ` ORDER BY requested_at DESC LIMIT 200`;

  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return Response.json({ ok: true, results });
}