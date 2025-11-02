import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addPriceField() {
  try {
    console.log('🔧 Adicionando campo price à tabela products...');
    
    // Tentar adicionar a coluna price
    const { data, error } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00;'
    });
    
    if (error) {
      console.log('⚠️ Erro ao adicionar coluna (pode ser normal se já existir):', error.message);
    } else {
      console.log('✅ Comando executado com sucesso!');
    }
    
    // Atualizar produtos com preços
    console.log('💰 Atualizando produtos com preços...');
    
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
    
    // Verificar se funcionou
    console.log('🔍 Verificando resultado...');
    const { data: products, error: selectError } = await supabase
      .from('products')
      .select('code, name, price')
      .limit(2);
      
    if (selectError) {
      console.error('❌ Erro ao verificar:', selectError);
    } else {
      console.log('📋 Produtos com preços:');
      products.forEach(p => {
        console.log(`   - ${p.name} (${p.code}): R$ ${p.price || 'N/A'}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

addPriceField();