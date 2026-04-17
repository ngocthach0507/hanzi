import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Database functionality will be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Chìa khóa vạn năng dùng cho các thao tác phía Server (Webhook, Admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
