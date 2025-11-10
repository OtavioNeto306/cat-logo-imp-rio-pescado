import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Para conectar ao Supabase, certifique-se de que as seguintes variáveis de ambiente
// estejam definidas no seu arquivo `.env` na raiz do projeto.
//
// Exemplo de como o arquivo `.env` deve se parecer:
//
// # .env (este arquivo deve estar na raiz do seu projeto)
// VITE_SUPABASE_URL="https://sgwazkmeoldmbgfisyrh.supabase.co"
// VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnd2F6a21lb2xkbWJnZmlzeXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjg3NjIsImV4cCI6MjA3NzYwNDc2Mn0.tGVDUDbl2vv1ggWNj_tholl8AZhVWy0esLPDuZkm8Ew"
//
// Importante: No Vite (como indicado pelo prefixo `VITE_`), essas variáveis são acessadas
// através de `import.meta.env`. Certifique-se de que o arquivo `.env` está na raiz
// do seu projeto e que o seu servidor de desenvolvimento (ou build) foi reiniciado
// após a criação ou modificação do arquivo `.env`.

let supabaseInstance: SupabaseClient | null = null;
let supabaseInitError: string | null = null;

try {
  // Fix: Use type assertion to bypass TypeScript's lack of knowledge about import.meta.env
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  // Fix: Use type assertion to bypass TypeScript's lack of knowledge about import.meta.env
  const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL environment variable is required.');
  }
  if (!supabaseAnonKey) {
    throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (error: any) {
  console.error("Failed to initialize Supabase client:", error.message);
  supabaseInitError = "Falha ao inicializar o cliente Supabase: " + error.message;
}

export const supabase = supabaseInstance;
export const supabaseInitializationError = supabaseInitError;