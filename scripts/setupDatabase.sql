-- Script para configurar o banco de dados no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_categories_code ON categories(code);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_code);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permitir leitura pública, escrita apenas para usuários autenticados)
-- Para um catálogo público, vamos permitir leitura para todos
CREATE POLICY "Permitir leitura pública de categorias" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de produtos" ON products
    FOR SELECT USING (true);

-- Para escrita, você pode ajustar conforme necessário
-- Por enquanto, vamos permitir todas as operações (você pode restringir depois)
CREATE POLICY "Permitir todas operações em categorias" ON categories
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em produtos" ON products
    FOR ALL USING (true);

-- Inserir dados iniciais (categorias)
INSERT INTO categories (code, slug, name, image_url, is_active) VALUES
('peixes', 'peixes', 'Peixes', 'https://picsum.photos/300/200?random=10', true),
('crustaceos', 'crustaceos', 'Crustáceos', 'https://picsum.photos/300/200?random=11', true),
('moluscos', 'moluscos', 'Moluscos', 'https://picsum.photos/300/200?random=12', true),
('conservas', 'conservas', 'Conservas', 'https://picsum.photos/300/200?random=13', true)
ON CONFLICT (code) DO NOTHING;

-- Inserir dados iniciais (produtos)
INSERT INTO products (code, slug, name, category_code, image_url, description, price, images, is_active) VALUES
('CAM001', 'camarao-rosa', 'Camarão Rosa', 'crustaceos', 'https://picsum.photos/400/300?random=1', 'Camarão rosa fresco, ideal para pratos especiais', 45.90, '["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2"]'::jsonb, true),
('PEI001', 'peixe-salmao', 'Salmão Fresco', 'peixes', 'https://picsum.photos/400/300?random=3', 'Salmão fresco de alta qualidade', 32.50, '["https://picsum.photos/400/300?random=3", "https://picsum.photos/400/300?random=4"]'::jsonb, true),
('CAR001', 'caranguejo', 'Caranguejo', 'crustaceos', 'https://picsum.photos/400/300?random=5', 'Caranguejo fresco do litoral', 28.90, '["https://picsum.photos/400/300?random=5", "https://picsum.photos/400/300?random=6"]'::jsonb, true),
('PEI002', 'robalo', 'Robalo', 'peixes', 'https://picsum.photos/400/300?random=7', 'Robalo fresco, excelente para grelhados', 38.00, '["https://picsum.photos/400/300?random=7", "https://picsum.photos/400/300?random=8"]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;