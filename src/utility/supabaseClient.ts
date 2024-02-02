import { createClient } from "@refinedev/supabase";

export const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_API_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
