"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { runDemo } from "@/lib/verdict/demo";
import { registerAgent, VerdictError } from "@/lib/verdict/service";

export type AgentFormState = {
  status: "idle" | "ok" | "error";
  message?: string;
  apiKey?: string;
  agentName?: string;
};

export async function createAgent(_prev: AgentFormState, formData: FormData): Promise<AgentFormState> {
  const user = await getCurrentUser();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "both");

  if (!/^[a-z0-9][a-z0-9-_]{1,39}$/i.test(name)) {
    return { status: "error", message: "Use 2–40 letters, numbers, dashes or underscores." };
  }
  if (!["buyer", "seller", "both"].includes(role)) {
    return { status: "error", message: "Pick a role." };
  }

  try {
    const { agent, apiKey } = await registerAgent({ ownerId: user.id }, { name, role: role as "buyer" | "seller" | "both" });
    return { status: "ok", apiKey, agentName: agent.name };
  } catch (error) {
    return { status: "error", message: error instanceof VerdictError ? error.message : "Could not create agent." };
  }
}

export type DemoState = { error?: string };

export async function startDemo(_prev: DemoState, formData: FormData): Promise<DemoState> {
  const user = await getCurrentUser();
  const outcome = formData.get("outcome") === "accept" ? "accept" : "dispute";
  let contractId: string;
  try {
    contractId = await runDemo(user.id, outcome);
  } catch (error) {
    console.error("[demo]", error);
    return { error: error instanceof Error ? error.message : "Demo failed." };
  }
  redirect(`/dashboard/contracts/${contractId}`);
}
