import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Only create the client if real credentials are provided
let supabase = null;
if (supabaseUrl && !supabaseUrl.includes("YOUR_SUPABASE") && supabaseKey && !supabaseKey.includes("YOUR_SUPABASE")) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("⚠️  Supabase credentials not configured — Supabase features will be disabled.");
}

export { supabase };
