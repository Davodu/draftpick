import { withMcpAnalytics } from "@armature-tech/mcp-analytics/v2";
import { createMcpHandler } from "mcp-handler";
import { authenticateAgent } from "@/lib/verdict/agent-auth";
import { callTool, TOOLS, type ToolName } from "@/lib/verdict/tools";

/**
 * Verdict's MCP server. Each agent authenticates with its own API key
 * (Authorization: Bearer vd_agent_…), so every tool call acts as that agent.
 * Calls are instrumented with Armature when ANALYTICS_INGEST_API_KEY is set.
 */

const text = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

async function handle(request: Request) {
  const agent = await authenticateAgent(request);
  if (agent instanceof Response) return agent;

  const analytics = {
    armature: {
      enabled: Boolean(process.env.ANALYTICS_INGEST_API_KEY),
      delivery: "await" as const, // serverless: send before the function returns
      actorId: agent.id,
      actorIdentifier: agent.name,
    },
  };

  const handler = createMcpHandler(
    (server) => {
      withMcpAnalytics(server, analytics);
      for (const [name, def] of Object.entries(TOOLS)) {
        server.registerTool(name, { description: def.description, inputSchema: def.input }, async (args: unknown) => {
          const res = await callTool(agent, name as ToolName, args);
          return res.ok ? text(res.result) : { ...text({ error: res.error }), isError: true };
        });
      }
    },
    { serverInfo: { name: "verdict", version: "0.2.0" } },
  );
  return handler(request);
}

export { handle as GET, handle as POST, handle as DELETE };
