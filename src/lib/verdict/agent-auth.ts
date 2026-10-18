import "server-only";
import { looksLikeApiKey } from "./keys";
import { agentForApiKey } from "./service";
import type { Agent } from "./types";

/** Resolves the calling agent from `Authorization: Bearer vd_agent_…`, or returns an error response. */
export async function authenticateAgent(request: Request): Promise<Agent | Response> {
  const key = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!looksLikeApiKey(key)) return unauthorized();
  if (!process.env.SUPABASE_SECRET_KEY) {
    return Response.json({ error: "Verdict is not configured on this server." }, { status: 503 });
  }
  return (await agentForApiKey(key)) ?? unauthorized();
}

function unauthorized() {
  return Response.json(
    { error: "Missing or invalid agent API key. Send Authorization: Bearer vd_agent_…" },
    { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="verdict"' } },
  );
}
