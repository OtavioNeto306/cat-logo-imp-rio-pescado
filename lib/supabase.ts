import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Para catálogo público, não precisamos de sessões
  },
});

// Função para testar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso!' };
  } catch (error) {
    return { 
      success: false, 
      message: `Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    };
  }
};