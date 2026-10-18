"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

export type PartnerRequestState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set(["buyer", "seller", "marketplace", "other"]);

export async function requestPartner(
  _prev: PartnerRequestState,
  formData: FormData,
): Promise<PartnerRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid work email." };
  }
  if (!ROLES.has(role)) {
    return { status: "error", message: "Pick what best describes you." };
  }

  if (supabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("early_access")
      .insert({ email: email.toLowerCase(), company: company || null, role });
    if (error) {
      console.error("[early-access] insert failed", error.message);
      return { status: "error", message: "Something went wrong. Please try again." };
    }
  } else {
    console.log("[early-access] Supabase not configured", { email, company, role });
  }

  return {
    status: "ok",
    message: "Thanks. We'll be in touch about early access.",
  };
}
