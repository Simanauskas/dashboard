// /log route for the auth.simas.fit Worker (Simanauskas/garmin-auth-worker).
// OPTIONAL: the logger can dispatch straight to GitHub with a fine-grained
// token instead. This route lets the phone hold a LOG_TOKEN rather than a
// GitHub token, same pattern as /body + BODY_TOKEN.
//
// Install:
//   1. Paste receiveLog() into src/worker.js and route it in fetch():
//        if (url.pathname === "/log") return receiveLog(request, env)
//   2. npx wrangler secret put LOG_TOKEN      (64 hex chars, e.g. `openssl rand -hex 32`)
//   3. npx wrangler deploy --dry-run, then npx wrangler deploy
//      (check the output still lists the cron, the TOKENS KV binding and the
//       auth.simas.fit custom domain — gotcha #10 in the simas-fit-update skill)
//   4. In the logger: Settings → "auth.simas.fit" → paste LOG_TOKEN → Test
//      (an empty body with a good token answers 400, which Test reports as accepted).

const LOG_CORS = {
  "Access-Control-Allow-Origin": "https://simas.fit",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
}

async function receiveLog(request, env) {
  const json = (status, body) => new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json", ...LOG_CORS },
  })
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: LOG_CORS })
  if (request.method !== "POST") return json(405, { error: "POST only" })

  const auth = request.headers.get("Authorization") || ""
  if (!env.LOG_TOKEN || auth !== `Bearer ${env.LOG_TOKEN}`) return json(401, { error: "bad token" })

  let body
  try { body = await request.json() } catch { return json(400, { error: "not JSON" }) }
  const action = ["save", "undo", "rematch"].includes(body.action) ? body.action : null
  const id = String(body.id || "")
  if (!action || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]{1,48}$/.test(id)) return json(400, { error: "need action and id" })
  const session = typeof body.session === "string" ? body.session : ""
  if (action === "save" && (!session || session.length > 60000)) return json(400, { error: "session missing or too large" })
  const activity_id = /^\d*$/.test(String(body.activity_id || "")) ? String(body.activity_id || "") : ""

  const r = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/log-session.yml/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "garmin-auth-worker",
    },
    body: JSON.stringify({ ref: "main", inputs: { action, id, session, activity_id } }),
  })
  if (r.status !== 204) return json(502, { error: `GitHub ${r.status}`, detail: (await r.text()).slice(0, 200) })
  return json(202, { status: "triggered", id })
}
