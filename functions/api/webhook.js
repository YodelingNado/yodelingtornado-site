export async function onRequestPost({ request, env }) {
  const secret = request.headers.get("X-Form-Secret");
  if (!secret || secret !== env.FORM_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const title = (body.title || "").trim();
  const notes = (body.notes || "").trim();

  if (!title) {
    return new Response("Missing title", { status: 400 });
  }

  const nowMs = Date.now();
  const d = new Date(nowMs);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const requested_date = `${dd}/${mm}/${yyyy}`;

  const id =
    (crypto.randomUUID ? crypto.randomUUID() : `${nowMs}-${Math.random()}`)
      .toString();

  await env.DB.prepare(
    `INSERT INTO requests (id, title, notes, requested_at, requested_date, status, completed_at)
     VALUES (?, ?, ?, ?, ?, 'open', NULL)`
  ).bind(id, title, notes, nowMs, requested_date).run();

  return new Response(JSON.stringify({ ok: true, id }), {
  headers: { "Content-Type": "application/json" },
  });;
}