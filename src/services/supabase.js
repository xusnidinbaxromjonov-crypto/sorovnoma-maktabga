import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yyceovemfuaunlhvthps.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5ymuMfVZJMEZNZxGDEIQrg_LXo1Ft2r';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
