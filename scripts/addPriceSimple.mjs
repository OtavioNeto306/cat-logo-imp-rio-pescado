import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addPriceSimple() {
  try {
    console.log('🔧 Tentando adicionar campo price...');
    
    // Tentar usar uma query SQL simples
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro de conexão:', error);
      return;
    }
    
    console.log('✅ Conexão OK');
    
    // Como não podemos executar DDL diretamente, vamos mostrar as instruções
    console.log('');
    console.log('📋 INSTRUÇÕES PARA ADICIONAR CAMPO PRICE:');
    console.log('');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Vá para o projeto "imperio_pescado"');
    console.log('3. Clique em "SQL Editor" no menu lateral');
    console.log('4. Execute este comando:');
    console.log('');
    console.log('   ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;');
    console.log('');
    console.log('5. Depois execute estes comandos para atualizar os preços:');
    console.log('');
    console.log("   UPDATE products SET price = 45.90 WHERE code = 'CAM001';");
    console.log("   UPDATE products SET price = 32.50 WHERE code = 'PEI001';");
    console.log("   UPDATE products SET price = 28.90 WHERE code = 'CAR001';");
    console.log("   UPDATE products SET price = 38.00 WHERE code = 'PEI002';");
    console.log('');
    console.log('6. Verifique com:');
    console.log('');
    console.log('   SELECT code, name, price FROM products;');
    console.log('');
    console.log('🎯 Após executar, a aplicação mostrará os preços automaticamente!');
    
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

addPriceSimple();