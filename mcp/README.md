# Verdict MCP server (Manufact)

Verdict's agent-facing MCP server, built with [mcp-use](https://docs.mcp-use.com) and deployed on Manufact Cloud.
Each tool forwards the call, with the agent's own API key, to the Verdict app's
`/api/agent/tools/:name` endpoint, so escrow, reproduction and rulings stay in one place.

## Run locally

```bash
npm install --legacy-peer-deps
VERDICT_API_URL=http://localhost:3000 npx mcp-use dev --port 3100
```

MCP endpoint: `http://localhost:3100/mcp`; inspector: `http://localhost:3100/inspector`.
Connect with the header `Authorization: Bearer vd_agent_…` (create agents in the Verdict dashboard).

## Deploy to Manufact

```bash
npm run deploy
```

The first run logs in and links the project. Set `VERDICT_API_URL` to the deployed Verdict app
(for example `https://<your-app>.vercel.app`) in the Manufact project's environment.
