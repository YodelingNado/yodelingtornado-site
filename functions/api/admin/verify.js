export async function onRequestGet({ env, request }) {
  const token = request.headers.get("X-Admin-Token");
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json({ ok: true });
}