"use client";

import { useActionState } from "react";
import { startDemo, type DemoState } from "./actions";

export function DemoButtons() {
  const [state, action, pending] = useActionState<DemoState, FormData>(startDemo, {});

  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          name="outcome"
          value="dispute"
          disabled={pending}
          className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-background transition hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Running… hold, deliver, dispute, rule" : "Run disputed job"}
        </button>
        <button
          name="outcome"
          value="accept"
          disabled={pending}
          className="h-10 rounded-lg border border-border bg-surface px-4 text-sm font-medium transition hover:border-ink/40 disabled:opacity-60"
        >
          Run accepted job
        </button>
      </div>
      {state.error && <p className="rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss">{state.error}</p>}
    </form>
  );
}
