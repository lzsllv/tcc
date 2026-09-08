import { createClient } from '@supabase/supabase-js';

export function createBrowserSupabaseClient(environment = import.meta.env) {
  const url = environment.VITE_SUPABASE_URL;
  const publishableKey = environment.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  return createClient(url, publishableKey);
}
