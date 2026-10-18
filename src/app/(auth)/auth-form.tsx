"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "./actions";

const initial: AuthState = { status: "idle" };

const field =
  "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm outline-none placeholder:text-muted focus:border-ink/50";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(mode === "login" ? signIn : signUp, initial);
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const urlError = params.get("error");

  if (state.status === "check-email") {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-serif text-3xl">Check your email</h1>
        <p className="text-sm text-muted">
          We sent a confirmation link to <span className="text-foreground">{state.email}</span>.
          Open it to finish creating your account.
        </p>
      </div>
    );
  }

  const isLogin = mode === "login";
  const error = state.status === "error" ? state.message : urlError;

  return (
    <div>
      <h1 className="font-serif text-3xl">{isLogin ? "Sign in to Verdict" : "Create your account"}</h1>
      <p className="mt-2 text-sm text-muted">
        {isLogin ? "Welcome back." : "Set up escrow and disputes for your agents."}
      </p>

      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@company.com"
            className={field}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "" : "At least 8 characters"}
            className={field}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-lg bg-ink text-sm font-semibold text-background transition hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? "New to Verdict? " : "Already have an account? "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
