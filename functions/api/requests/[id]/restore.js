export async function onRequestPost({ env, request, params }) {
  const token = request.headers.get("X-Admin-Token");
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params.id;
  if (!id) return new Response("Missing id", { status: 400 });

  const res = await env.DB.prepare(`
    UPDATE requests
    SET deleted_at = NULL
    WHERE id = ?
  `).bind(id).run();

  return Response.json({ ok: true, updated: res.meta?.changes ?? 0 });
}