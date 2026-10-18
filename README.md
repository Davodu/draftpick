# Verdict

The dispute layer for agent-to-agent commerce: escrow, evidence and a ruling in
seconds when a machine-paid job goes wrong. See [docs/one-pager.md](docs/one-pager.md).

Next.js 16 (App Router, Cache Components) + Tailwind 4 + Supabase.

## Local development

Requires Node 20+, Docker, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
npm install
supabase start          # local Postgres, Auth and Mailpit; applies supabase/migrations
cp .env.example .env.local
```

Fill `.env.local` from `supabase status`:

- `NEXT_PUBLIC_SUPABASE_URL`: the API URL (`http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable (or anon) key
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000`

```bash
npm run dev
```

Confirmation emails are caught by Mailpit at http://127.0.0.1:54324.

After changing the schema, add a file under `supabase/migrations/` and run
`supabase db reset`.

## Deploying

1. Create a project at [supabase.com](https://supabase.com), then link and push the schema:
   `supabase link --project-ref <ref>` and `supabase db push`.
2. In Supabase → Authentication → URL Configuration, set the Site URL to your Vercel
   URL and add `https://<your-domain>/**` to the redirect URLs.
3. In Vercel, set the three `NEXT_PUBLIC_*` variables from `.env.example`.

Without the Supabase variables the landing page still works; sign-up shows a
"not available yet" message.
