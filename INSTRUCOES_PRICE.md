# Instruções para Adicionar Campo Price

## Problema Identificado
A tabela `products` no Supabase não possui o campo `price`, causando valores `undefined` na aplicação.

## Solução Manual (Recomendada)

### Passo 1: Acessar o Supabase
1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto "imperio_pescado"

### Passo 2: Adicionar Campo Price
1. No menu lateral, clique em **"Table Editor"**
2. Selecione a tabela **"products"**
3. Clique no botão **"+ Add Column"** (ou ícone de +)
4. Configure a nova coluna:
   - **Name**: `price`
   - **Type**: `numeric` ou `decimal`
   - **Default Value**: `0.00`
   - **Precision**: `10,2` (se disponível)
   - Marque **"Is Nullable"** como `false`

### Passo 3: Atualizar Produtos com Preços
Após adicionar a coluna, execute este SQL no **SQL Editor**:

```sql
UPDATE products SET price = 45.90 WHERE code = 'CAM001';
UPDATE products SET price = 32.50 WHERE code = 'PEI001';
UPDATE products SET price = 28.90 WHERE code = 'CAR001';
UPDATE products SET price = 38.00 WHERE code = 'PEI002';
```

### Passo 4: Verificar
Execute este SQL para verificar:

```sql
SELECT code, name, price FROM products;
```

## Solução Alternativa (Se a manual não funcionar)

Se não conseguir adicionar pelo Table Editor, use o **SQL Editor**:

```sql
-- Adicionar coluna price
ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;

-- Atualizar produtos com preços
UPDATE products SET price = 45.90 WHERE code = 'CAM001';
UPDATE products SET price = 32.50 WHERE code = 'PEI001';
UPDATE products SET price = 28.90 WHERE code = 'CAR001';
UPDATE products SET price = 38.00 WHERE code = 'PEI002';

-- Verificar resultado
SELECT code, name, price FROM products;
```

## Após Adicionar o Campo

1. A aplicação deve automaticamente mostrar os preços
2. Teste a aplicação em http://localhost:3000
3. Verifique se os produtos mostram os preços corretamente

## Status Atual
- ✅ Código TypeScript atualizado com campo `price`
- ✅ Hook `useProducts` configurado para usar `price`
- ❌ Campo `price` não existe na tabela do banco
- ⏳ Aguardando adição manual do campo