# 🚀 Deploy e Gerenciamento de Dados - Império Pescado

## 📋 Visão Geral

Este projeto utiliza uma abordagem híbrida para gerenciamento de dados:
- **Desenvolvimento Local**: `localStorage` para facilitar testes e desenvolvimento
- **Produção**: Arquivos estáticos versionados no Git para deploy na Vercel

## 🔄 Fluxo de Trabalho

### 1. Desenvolvimento Local
- Use o painel administrativo (`/admin`) para gerenciar produtos e categorias
- Os dados são salvos automaticamente no `localStorage` do navegador
- Funciona perfeitamente para desenvolvimento e testes

### 2. Preparação para Produção

#### Exportar Dados
1. Acesse o painel administrativo (`/admin`)
2. Clique em **"📥 Exportar Dados"**
3. Um arquivo JSON será baixado com todos os seus dados

#### Atualizar Dados de Produção
```bash
# Método 1: Script automático (recomendado)
npm run update-production-data caminho/para/dados-exportados.json

# Método 2: Manual
# Substitua o conteúdo do arquivo data/catalogData.ts
```

#### Commit e Deploy
```bash
git add .
git commit -m "Atualizar catálogo de produtos"
git push
```

A Vercel fará o deploy automaticamente! 🎉

## 📁 Estrutura de Dados

### Arquivos Importantes
- `data/catalogData.ts` - Dados estáticos para produção
- `data/products.ts` - Dados iniciais/exemplo
- `utils/dataManager.ts` - Utilitários para import/export
- `hooks/useProducts.ts` - Lógica de gerenciamento de dados

### Prioridade de Carregamento
1. **localStorage** (se existir)
2. **Dados de produção** (`catalogData.ts`)
3. **Dados iniciais** (`products.ts`)

## 🛠️ Funcionalidades do Admin

### Gerenciamento de Dados
- **📥 Exportar Dados**: Baixa backup completo em JSON
- **📤 Importar Dados**: Carrega dados de arquivo JSON
- **🗑️ Limpar Tudo**: Remove todos os dados do localStorage

### Gerenciamento de Produtos
- ✅ Adicionar/editar/excluir produtos
- 🔄 Ativar/desativar produtos
- 🖼️ Gerenciar múltiplas imagens
- 📝 Descrições e categorização

### Gerenciamento de Categorias
- ✅ Adicionar/editar/excluir categorias
- 🔄 Ativar/desativar categorias
- 🔗 Produtos são automaticamente desativados quando categoria é desativada

## 🌐 Deploy na Vercel

### Configuração Inicial
1. Conecte seu repositório GitHub à Vercel
2. Configure o projeto como **Vite/React**
3. Deploy automático a cada push na branch principal

### Vantagens desta Abordagem
- ✅ **100% Gratuito** - Sem custos de banco de dados
- ⚡ **Ultra Rápido** - Dados estáticos carregam instantaneamente
- 🔄 **Versionado** - Histórico completo no Git
- 🛡️ **Confiável** - Sem dependências externas
- 📱 **Offline-First** - Funciona mesmo sem internet

## 🔧 Solução de Problemas

### Site "Desconfigurado" em Aba Anônima
**Problema**: Em modo incógnito, o site mostra apenas dados iniciais.
**Causa**: `localStorage` é isolado em abas anônimas.
**Solução**: Normal! Em produção, os dados vêm do arquivo estático.

### Dados Não Aparecem Após Deploy
1. Verifique se executou `npm run update-production-data`
2. Confirme que o arquivo `data/catalogData.ts` foi commitado
3. Verifique se o deploy da Vercel foi bem-sucedido

### Backup e Recuperação
- **Backup**: Use "Exportar Dados" regularmente
- **Recuperação**: Use "Importar Dados" com arquivo de backup
- **Histórico**: Todos os commits no Git servem como backup

## 📊 Monitoramento

### Verificar Dados em Produção
```javascript
// No console do navegador (produção)
console.log('Dados carregados:', localStorage.getItem('imperio_pescado_products'));
```

### Logs de Debug
O sistema registra automaticamente:
- Fonte dos dados carregados
- Erros de parsing
- Operações de import/export

## 🎯 Próximos Passos (Opcional)

Se o projeto crescer, considere migrar para:
- **Vercel KV** (Redis) - Para dados dinâmicos
- **Supabase** - Para funcionalidades avançadas
- **Headless CMS** - Para editores não-técnicos

Mas para um catálogo simples, a solução atual é perfeita! 🎉