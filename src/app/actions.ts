"use server";

export type ReportRequestState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestReport(
  _prev: ReportRequestState,
  formData: FormData,
): Promise<ReportRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  const server = String(formData.get("server") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid work email." };
  }

  // TODO: persist to Supabase / InsForge once the store is wired up.
  console.log("[report-request]", { email, server, at: new Date().toISOString() });

  return {
    status: "ok",
    message: "You're on the list. We'll send your selection-share snapshot.",
  };
}
