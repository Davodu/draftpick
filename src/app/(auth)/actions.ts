"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type AuthState = {
  status: "idle" | "error" | "check-email";
  message?: string;
  email?: string;
};

const NOT_CONFIGURED: AuthState = {
  status: "error",
  message: "Sign-up isn't available yet. Please try again soon.",
};

/** Only allow same-site relative redirects. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const { email, password } = readCredentials(formData);

  if (!email || password.length < 8) {
    return { status: "error", message: "Use a valid email and a password of 8+ characters.", email };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=/dashboard` },
  });

  if (error) return { status: "error", message: error.message, email };

  // Email confirmation off: Supabase returns a session straight away.
  if (data.session) redirect("/dashboard");

  return { status: "check-email", email };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const { email, password } = readCredentials(formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message =
      error.code === "email_not_confirmed"
        ? "Confirm your email first. Check your inbox for the link."
        : "Wrong email or password.";
    return { status: "error", message, email };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (supabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
