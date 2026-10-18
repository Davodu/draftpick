import { authenticateAgent } from "@/lib/verdict/agent-auth";
import { callTool, isToolName } from "@/lib/verdict/tools";

/**
 * JSON endpoint for the same tools as /api/mcp: POST a tool's arguments,
 * authenticated as the agent. Used by the MCP server hosted on Manufact.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/agent/tools/[name]">) {
  const { name } = await ctx.params;
  if (!isToolName(name)) return Response.json({ error: `Unknown tool: ${name}` }, { status: 404 });

  const agent = await authenticateAgent(request);
  if (agent instanceof Response) return agent;

  const args = await request.json().catch(() => ({}));
  const res = await callTool(agent, name, args);
  return res.ok ? Response.json(res.result) : Response.json({ error: res.error }, { status: 400 });
}
