import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Carregar variáveis de ambiente
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertInitialData() {
  console.log('📋 Inserindo dados iniciais...\n');

  // Inserir categorias
  const categories = [
    { code: 'peixes', slug: 'peixes', name: 'Peixes', image_url: 'https://picsum.photos/300/200?random=10', is_active: true },
    { code: 'crustaceos', slug: 'crustaceos', name: 'Crustáceos', image_url: 'https://picsum.photos/300/200?random=11', is_active: true },
    { code: 'moluscos', slug: 'moluscos', name: 'Moluscos', image_url: 'https://picsum.photos/300/200?random=12', is_active: true },
    { code: 'conservas', slug: 'conservas', name: 'Conservas', image_url: 'https://picsum.photos/300/200?random=13', is_active: true }
  ];

  console.log('🏷️  Inserindo categorias...');
  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert(category, { onConflict: 'code' });
    
    if (error) {
      console.error(`❌ Erro ao inserir categoria ${category.name}:`, error.message);
    } else {
      console.log(`✅ Categoria "${category.name}" inserida`);
    }
  }

  // Inserir produtos
  const products = [
    {
      code: 'CAM001',
      slug: 'camarao-rosa',
      name: 'Camarão Rosa',
      category_code: 'crustaceos',
      image_url: 'https://picsum.photos/400/300?random=1',
      description: 'Camarão rosa fresco, ideal para pratos especiais',
      images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
      is_active: true
    },
    {
      code: 'PEI001',
      slug: 'peixe-salmao',
      name: 'Salmão Fresco',
      category_code: 'peixes',
      image_url: 'https://picsum.photos/400/300?random=3',
      description: 'Salmão fresco de alta qualidade',
      images: ['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=4'],
      is_active: true
    },
    {
      code: 'CAR001',
      slug: 'caranguejo',
      name: 'Caranguejo',
      category_code: 'crustaceos',
      image_url: 'https://picsum.photos/400/300?random=5',
      description: 'Caranguejo fresco do litoral',
      images: ['https://picsum.photos/400/300?random=5', 'https://picsum.photos/400/300?random=6'],
      is_active: true
    },
    {
      code: 'PEI002',
      slug: 'robalo',
      name: 'Robalo',
      category_code: 'peixes',
      image_url: 'https://picsum.photos/400/300?random=7',
      description: 'Robalo fresco, excelente para grelhados',
      images: ['https://picsum.photos/400/300?random=7', 'https://picsum.photos/400/300?random=8'],
      is_active: true
    }
  ];

  console.log('\n🐟 Inserindo produtos...');
  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'code' });
    
    if (error) {
      console.error(`❌ Erro ao inserir produto ${product.name}:`, error.message);
    } else {
      console.log(`✅ Produto "${product.name}" inserido`);
    }
  }

  // Verificar contagem final
  const { count: catCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  const { count: prodCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log('\n📊 Dados inseridos com sucesso!');
  console.log(`📊 Categorias: ${catCount} registros`);
  console.log(`📊 Produtos: ${prodCount} registros`);
  console.log('\n🎉 Dados iniciais configurados!');
}

insertInitialData().catch(console.error);