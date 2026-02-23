export async function onRequestPost({ env, request, params }) {
  const token = request.headers.get("X-Admin-Token");
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params.id;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const status = (body.status || "").trim(); // "open" or "done"
  if (status !== "open" && status !== "done") {
    return new Response("Invalid status", { status: 400 });
  }

  const nowMs = Date.now();
  const completed_at = status === "done" ? nowMs : null;

  await env.DB.prepare(
    `UPDATE requests
     SET status = ?,
         completed_at = ?
     WHERE id = ?`
  ).bind(status, completed_at, id).run();

  return Response.json({ ok: true });
}