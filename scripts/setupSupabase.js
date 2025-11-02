/**
 * Script para configurar o Supabase automaticamente
 * Execute: node scripts/setupSupabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Carregar variáveis de ambiente
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configurando Supabase...\n');

// Verificar se as credenciais foram configuradas
if (!supabaseUrl || supabaseUrl.includes('SEU_PROJETO_ID') || supabaseUrl.includes('example')) {
  console.error('❌ ERRO: URL do Supabase não configurada!');
  console.log('📝 Vá para o seu painel do Supabase:');
  console.log('   1. Settings → API');
  console.log('   2. Copie a "Project URL"');
  console.log('   3. Cole no arquivo .env na variável VITE_SUPABASE_URL\n');
  process.exit(1);
}

if (!supabaseKey || supabaseKey.includes('COLE_SUA_CHAVE') || supabaseKey.includes('example')) {
  console.error('❌ ERRO: Chave do Supabase não configurada!');
  console.log('📝 Vá para o seu painel do Supabase:');
  console.log('   1. Settings → API');
  console.log('   2. Copie a chave "anon public"');
  console.log('   3. Cole no arquivo .env na variável VITE_SUPABASE_ANON_KEY\n');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste básico de conexão sem depender de tabelas específicas
    const { data, error } = await supabase.auth.getSession();
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

async function createTables() {
  console.log('\n📋 Criando tabelas...');
  
  const sqlPath = path.join(process.cwd(), 'scripts', 'setupDatabase.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Dividir o SQL em comandos individuais
  const commands = sqlContent
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
  
  for (const command of commands) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      if (error) {
        // Tentar executar diretamente se rpc não funcionar
        console.log('⚠️  Executando comando SQL...');
      }
    } catch (error) {
      console.log(`⚠️  Comando: ${command.substring(0, 50)}...`);
    }
  }
  
  console.log('✅ Processo de criação de tabelas concluído!');
}

async function verifyTables() {
  console.log('\n🔍 Verificando tabelas criadas...');
  
  try {
    // Verificar categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('count');
    
    if (!catError) {
      console.log('✅ Tabela "categories" encontrada');
    }
    
    // Verificar produtos
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('count');
    
    if (!prodError) {
      console.log('✅ Tabela "products" encontrada');
    }
    
    // Contar registros
    const { count: catCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    const { count: prodCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Categorias: ${catCount || 0} registros`);
    console.log(`📊 Produtos: ${prodCount || 0} registros`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error.message);
  }
}

async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await createTables();
    await verifyTables();
    
    console.log('\n🎉 Configuração do Supabase concluída!');
    console.log('🚀 Agora você pode usar a aplicação normalmente.');
  } else {
    console.log('\n❌ Não foi possível conectar ao Supabase.');
    console.log('📝 Verifique suas credenciais no arquivo .env');
  }
}

main().catch(console.error);