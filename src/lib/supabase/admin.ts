import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role client that bypasses row-level security. Only for server code
 * that has already authorized the caller (an operator session or an agent API key).
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!SUPABASE_URL || !key) {
    throw new Error("SUPABASE_SECRET_KEY is not set. Add it to .env.local (server-only).");
  }
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
