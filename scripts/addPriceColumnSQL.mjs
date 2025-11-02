import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function addPriceColumnSQL() {
  try {
    console.log('🔧 Adicionando coluna price via SQL...');
    
    // Primeiro, criar uma função para executar SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_price_column()
      RETURNS void AS $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'products' AND column_name = 'price'
        ) THEN
          ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    console.log('📝 Criando função SQL...');
    const { error: createError } = await supabase.rpc('exec', { sql: createFunctionSQL });
    
    if (createError) {
      console.log('⚠️ Erro ao criar função (pode ser normal):', createError.message);
    }
    
    // Executar a função
    console.log('🔧 Executando função para adicionar coluna...');
    const { error: execError } = await supabase.rpc('add_price_column');
    
    if (execError) {
      console.log('⚠️ Erro ao executar função:', execError.message);
      console.log('');
      console.log('📝 SOLUÇÃO MANUAL:');
      console.log('1. Acesse: https://supabase.com/dashboard');
      console.log('2. Vá para o projeto "imperio_pescado"');
      console.log('3. Clique em "SQL Editor"');
      console.log('4. Execute:');
      console.log('   ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;');
      console.log('');
      return;
    }
    
    console.log('✅ Coluna price adicionada com sucesso!');
    
    // Agora atualizar os produtos com preços
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
    
    console.log('🎉 Processo concluído!');
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

addPriceColumnSQL();