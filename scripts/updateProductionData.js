#!/usr/bin/env node

/**
 * Script para atualizar dados de produção
 * 
 * Este script lê um arquivo JSON exportado do admin e atualiza o arquivo catalogData.ts
 * 
 * Uso:
 * node scripts/updateProductionData.js caminho/para/dados-exportados.json
 */

const fs = require('fs');
const path = require('path');

function updateProductionData(jsonFilePath) {
  try {
    // Verificar se o arquivo JSON existe
    if (!fs.existsSync(jsonFilePath)) {
      console.error('❌ Arquivo não encontrado:', jsonFilePath);
      process.exit(1);
    }

    // Ler e parsear o arquivo JSON
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // Validar estrutura dos dados
    if (!jsonData.products || !jsonData.categories) {
      console.error('❌ Arquivo JSON inválido. Deve conter "products" e "categories"');
      process.exit(1);
    }

    // Gerar o conteúdo do arquivo TypeScript
    const tsContent = `// Arquivo de dados estáticos para produção
// Este arquivo foi atualizado automaticamente em ${new Date().toISOString()}
// Para atualizar: exporte os dados do admin e execute: npm run update-production-data

import { Product, Category } from '../types';

export const productionData = {
  products: ${JSON.stringify(jsonData.products, null, 4)} as Product[],
  
  categories: ${JSON.stringify(jsonData.categories, null, 4)} as Category[]
};

// Função para verificar se há dados em produção
export const hasProductionData = (): boolean => {
  return productionData.products.length > 0 && productionData.categories.length > 0;
};

// Função para obter dados de produção
export const getProductionData = () => {
  return {
    products: productionData.products,
    categories: productionData.categories
  };
};`;

    // Caminho do arquivo de destino
    const outputPath = path.join(__dirname, '..', 'data', 'catalogData.ts');
    
    // Escrever o arquivo
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log('✅ Dados de produção atualizados com sucesso!');
    console.log(`📁 Arquivo: ${outputPath}`);
    console.log(`📊 Produtos: ${jsonData.products.length}`);
    console.log(`📂 Categorias: ${jsonData.categories.length}`);
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('1. Commit as mudanças: git add . && git commit -m "Atualizar dados de produção"');
    console.log('2. Push para o repositório: git push');
    console.log('3. A Vercel fará o deploy automaticamente');

  } catch (error) {
    console.error('❌ Erro ao processar arquivo:', error.message);
    process.exit(1);
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('📋 Uso: node scripts/updateProductionData.js <caminho-para-json>');
  console.log('');
  console.log('Exemplo:');
  console.log('  node scripts/updateProductionData.js ./dados-exportados.json');
  process.exit(1);
}

updateProductionData(args[0]);