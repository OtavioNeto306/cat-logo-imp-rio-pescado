import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function recreateProductsTable() {
  try {
    console.log('🔧 Recriando tabela products com campo price...');
    
    // Primeiro, salvar os dados existentes
    console.log('💾 Salvando dados existentes...');
    const { data: existingProducts, error: selectError } = await supabase
      .from('products')
      .select('*');
      
    if (selectError) {
      console.error('❌ Erro ao buscar produtos existentes:', selectError);
      return;
    }
    
    console.log(`📋 ${existingProducts.length} produtos encontrados para backup`);
    
    // Dropar a tabela existente
    console.log('🗑️ Removendo tabela existente...');
    const { error: dropError } = await supabase.rpc('exec', {
      sql: 'DROP TABLE IF EXISTS products CASCADE;'
    });
    
    if (dropError) {
      console.error('❌ Erro ao dropar tabela:', dropError);
      return;
    }
    
    // Recriar a tabela com o campo price
    console.log('🏗️ Criando nova tabela...');
    const createTableSQL = `
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category_code VARCHAR(50) NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0.00,
        images JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY (category_code) REFERENCES categories(code) ON DELETE CASCADE
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec', {
      sql: createTableSQL
    });
    
    if (createError) {
      console.error('❌ Erro ao criar tabela:', createError);
      return;
    }
    
    // Criar índices
    console.log('📊 Criando índices...');
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_code);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    `;
    
    const { error: indexError } = await supabase.rpc('exec', {
      sql: indexSQL
    });
    
    if (indexError) {
      console.log('⚠️ Aviso ao criar índices:', indexError.message);
    }
    
    // Recriar políticas RLS
    console.log('🔒 Configurando políticas de segurança...');
    const rlsSQL = `
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Permitir leitura pública de produtos" ON products
        FOR SELECT USING (true);
      
      CREATE POLICY "Permitir inserção autenticada de produtos" ON products
        FOR INSERT WITH CHECK (true);
      
      CREATE POLICY "Permitir atualização autenticada de produtos" ON products
        FOR UPDATE USING (true);
      
      CREATE POLICY "Permitir exclusão autenticada de produtos" ON products
        FOR DELETE USING (true);
    `;
    
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: rlsSQL
    });
    
    if (rlsError) {
      console.log('⚠️ Aviso ao configurar RLS:', rlsError.message);
    }
    
    // Inserir dados com preços
    console.log('📝 Inserindo produtos com preços...');
    const productsWithPrices = [
      {
        code: 'CAM001',
        slug: 'camarao-rosa',
        name: 'Camarão Rosa',
        category_code: 'crustaceos',
        image_url: 'https://picsum.photos/400/300?random=1',
        description: 'Camarão rosa fresco, ideal para pratos especiais',
        price: 45.90,
        images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2']
      },
      {
        code: 'PEI001',
        slug: 'salmao-fresco',
        name: 'Salmão Fresco',
        category_code: 'peixes',
        image_url: 'https://picsum.photos/400/300?random=3',
        description: 'Salmão fresco do Chile, rico em ômega 3',
        price: 32.50,
        images: ['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4']
      },
      {
        code: 'CAR001',
        slug: 'caranguejo',
        name: 'Caranguejo',
        category_code: 'crustaceos',
        image_url: 'https://picsum.photos/400/300?random=5',
        description: 'Caranguejo fresco da região',
        price: 28.90,
        images: ['https://picsum.photos/400/300?random=5']
      },
      {
        code: 'PEI002',
        slug: 'robalo',
        name: 'Robalo',
        category_code: 'peixes',
        image_url: 'https://picsum.photos/400/300?random=6',
        description: 'Robalo fresco, peixe nobre',
        price: 38.00,
        images: ['https://picsum.photos/400/300?random=6', 'https://picsum.photos/400/300?random=7']
      }
    ];
    
    for (const product of productsWithPrices) {
      const { error: insertError } = await supabase
        .from('products')
        .insert(product);
        
      if (insertError) {
        console.error(`❌ Erro ao inserir ${product.code}:`, insertError);
      } else {
        console.log(`✅ ${product.name} inserido com preço R$ ${product.price}`);
      }
    }
    
    // Verificar resultado
    console.log('🔍 Verificando resultado final...');
    const { data: finalProducts, error: finalError } = await supabase
      .from('products')
      .select('code, name, price');
      
    if (finalError) {
      console.error('❌ Erro na verificação final:', finalError);
    } else {
      console.log('🎉 Produtos criados com sucesso:');
      finalProducts.forEach(p => {
        console.log(`   - ${p.name} (${p.code}): R$ ${p.price}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

recreateProductsTable();