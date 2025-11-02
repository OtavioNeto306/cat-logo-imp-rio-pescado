import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addPriceColumn() {
  try {
    console.log('🔧 Executando script para adicionar campo de preço...');
    
    console.log('📝 INSTRUÇÕES:');
    console.log('1. Acesse o painel do Supabase: https://supabase.com/dashboard');
    console.log('2. Vá para o projeto "imperio_pescado"');
    console.log('3. Clique em "SQL Editor" no menu lateral');
    console.log('4. Execute o seguinte comando SQL:');
    console.log('');
    console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00;');
    console.log('');
    console.log('5. Depois execute este script novamente para atualizar os preços');
    console.log('');
    
    // Tentar verificar se a coluna já existe
    const { data, error } = await supabase
      .from('products')
      .select('price')
      .limit(1);
    
    if (error && error.message.includes('column "price" does not exist')) {
      console.log('❌ Coluna price ainda não existe. Execute o comando SQL acima primeiro.');
      return;
    }
    
    if (error) {
      console.error('❌ Erro ao verificar coluna:', error);
      return;
    }
    
    console.log('✅ Campo price existe! Atualizando produtos com preços...');
    
    // Atualizar produtos existentes com preços de exemplo
    const updates = [
      { code: 'CAM001', price: 45.90 },
      { code: 'PEI001', price: 32.50 },
      { code: 'CAR001', price: 28.90 },
      { code: 'PEI002', price: 38.00 }
    ];
    
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ price: update.price })
        .eq('code', update.code);
        
      if (updateError) {
        console.error(`❌ Erro ao atualizar ${update.code}:`, updateError);
      } else {
        console.log(`✅ ${update.code} atualizado com preço R$ ${update.price}`);
      }
    }
    
    console.log('🎉 Atualização concluída!');
    
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

addPriceColumn();