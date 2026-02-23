export async function onRequestPost({ env, request, params }) {
  const token = request.headers.get("X-Admin-Token");
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params.id;
  if (!id) return new Response("Missing id", { status: 400 });

  const now = Date.now();

  // Soft delete: set deleted_at, leave row intact
  const res = await env.DB.prepare(`
    UPDATE requests
    SET deleted_at = ?
    WHERE id = ?
  `).bind(now, id).run();

  return Response.json({ ok: true, updated: res.meta?.changes ?? 0 });
}