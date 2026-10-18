import { createHash, randomBytes } from "node:crypto";

const PREFIX = "vd_agent_";

export function generateApiKey() {
  return PREFIX + randomBytes(24).toString("base64url");
}

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export function looksLikeApiKey(key: string) {
  return key.startsWith(PREFIX) && key.length > PREFIX.length + 20;
}
