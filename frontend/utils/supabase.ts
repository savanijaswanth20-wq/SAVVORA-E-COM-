import { createClient } from '@supabase/supabase-js';

const getMetaEnv = (key: string): string => {
  try {
    const meta = import.meta as Record<string, any>;
    return (meta && meta.env && meta.env[key]) || '';
  } catch {
    return '';
  }
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  getMetaEnv('VITE_SUPABASE_URL') ||
  '';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  getMetaEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  '';

export const supabase = createClient(supabaseUrl, supabaseKey);
