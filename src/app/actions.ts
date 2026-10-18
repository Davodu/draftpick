"use server";

export type PartnerRequestState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set(["merchant", "agent-builder", "other"]);

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

  // TODO: persist to Supabase / InsForge once the store is wired up.
  console.log("[partner-request]", { email, company, role, at: new Date().toISOString() });

  return {
    status: "ok",
    message: "Thanks. We'll be in touch before the holiday dispute season.",
  };
}
