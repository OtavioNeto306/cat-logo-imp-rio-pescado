import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseData() {
  console.log('🔍 Testando conexão e dados do Supabase...\n');

  try {
    // Testar conexão
    console.log('1. Testando conexão...');
    const { data: session } = await supabase.auth.getSession();
    console.log('✅ Conexão estabelecida com sucesso\n');

    // Testar busca de categorias
    console.log('2. Buscando categorias...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError);
    } else {
      console.log(`✅ ${categories.length} categorias encontradas:`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.code})`);
      });
    }

    // Testar busca de produtos
    console.log('\n3. Buscando produtos...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('❌ Erro ao buscar produtos:', productsError);
    } else {
      console.log(`✅ ${products.length} produtos encontrados:`);
      products.forEach(prod => {
        console.log(`   - ${prod.name} (${prod.code}) - R$ ${prod.price}`);
      });
    }

    console.log('\n🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testSupabaseData();