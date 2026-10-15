import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL; // supabase url
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY; // publishable key

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);