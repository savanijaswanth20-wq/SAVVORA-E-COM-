import { createBrowserClient } from "@supabase/ssr";

let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (clientInstance) return clientInstance;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ufryyhjpmlyrltvmrqur.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_l_x_SJ9iX26k8BcMFG3ZPQ_YZ3h9SP5";

  clientInstance = createBrowserClient(supabaseUrl, supabaseKey);
  return clientInstance;
};



