import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type CurrentUser = { id: string; email: string };

/** Data access layer entry point: the signed-in user, or a redirect to /login. */
export async function getCurrentUser(): Promise<CurrentUser> {
  // Session checks compare token expiry to the clock, so they must run per request.
  await connection();
  if (!supabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) redirect("/login");

  return { id: claims.sub, email: String(claims.email ?? "") };
}
