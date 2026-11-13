
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
console.log('URL configurada:', Boolean(supabaseUrl));
console.log('Chave configurada:', Boolean(supabaseKey));

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

