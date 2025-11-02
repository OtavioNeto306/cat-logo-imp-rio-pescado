import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela products...');
    
    // Buscar um produto para ver os campos disponíveis
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return;
    }
    
    if (products && products.length > 0) {
      console.log('📋 Campos disponíveis na tabela products:');
      console.log(Object.keys(products[0]));
      console.log('');
      console.log('📄 Exemplo de produto:');
      console.log(JSON.stringify(products[0], null, 2));
    } else {
      console.log('⚠️ Nenhum produto encontrado');
    }
    
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

checkTableStructure();