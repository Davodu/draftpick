export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until Supabase env vars are set, so the landing page still works without a backend. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
