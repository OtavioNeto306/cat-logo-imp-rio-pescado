import { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { supabase } from '../lib/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dados filtrados (apenas ativos)
  const activeCategories = categories.filter(c => c.isActive);
  
  // Filtrar produtos por busca e categoria
  const filteredProducts = products.filter(p => {
    if (!p.isActive) return false;
    
    // Filtro por categoria
    if (selectedCategory && p.category !== selectedCategory) return false;
    
    // Filtro por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.code.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const activeProducts = products.filter(p => p.isActive);

  // Carregar dados iniciais
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar categorias do Supabase
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        throw new Error(`Erro ao carregar categorias: ${categoriesError.message}`);
      }

      // Buscar produtos do Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) {
        throw new Error(`Erro ao carregar produtos: ${productsError.message}`);
      }

      // Converter dados do Supabase para o formato da aplicação
      const formattedCategories: Category[] = (categoriesData || []).map(cat => ({
        code: cat.code,
        slug: cat.slug,
        name: cat.name,
        imageUrl: cat.image_url,
        isActive: cat.is_active
      }));

      const formattedProducts: Product[] = (productsData || []).map(prod => ({
        code: prod.code,
        slug: prod.slug,
        name: prod.name,
        category: prod.category_code,
        imageUrl: prod.image_url,
        description: prod.description || '',
        price: prod.price || 0,
        images: Array.isArray(prod.images) ? prod.images : [],
        isActive: prod.is_active
      }));

      setCategories(formattedCategories);
      setProducts(formattedProducts);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Funções de busca
  const getProductByCode = (code: string) => products.find(p => p.code === code);
  const getProductBySlug = (slug: string) => products.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
  const getCategoryByCode = (code: string) => categories.find(c => c.code === code);
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
  const getProductsByCategory = (categoryCode: string) => products.filter(p => p.category === categoryCode);

  // CRUD Produtos
  const addProduct = async (product: Product): Promise<boolean> => {
    try {
      const newProduct = {
        code: product.code || `PROD${Date.now()}`,
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        category_code: product.category,
        image_url: product.imageUrl,
        description: product.description,
        price: product.price,
        images: product.images,
        is_active: product.isActive
      };

      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após inserção
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
      return false;
    }
  };

  const updateProduct = async (code: string, product: Product): Promise<boolean> => {
    try {
      const updatedProduct = {
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        category_code: product.category,
        image_url: product.imageUrl,
        description: product.description,
        price: product.price,
        images: product.images,
        is_active: product.isActive
      };

      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('code', code);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após atualização
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
      return false;
    }
  };

  const deleteProduct = async (code: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('code', code);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após exclusão
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir produto');
      return false;
    }
  };

  // CRUD Categorias
  const addCategory = async (category: Category): Promise<boolean> => {
    try {
      const newCategory = {
        code: category.code || `CAT${Date.now()}`,
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        name: category.name,
        image_url: category.imageUrl,
        is_active: category.isActive
      };

      const { error } = await supabase
        .from('categories')
        .insert([newCategory]);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após inserção
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
      return false;
    }
  };

  const updateCategory = async (code: string, category: Category): Promise<boolean> => {
    try {
      const updatedCategory = {
        slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        name: category.name,
        image_url: category.imageUrl,
        is_active: category.isActive
      };

      const { error } = await supabase
        .from('categories')
        .update(updatedCategory)
        .eq('code', code);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após atualização
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      return false;
    }
  };

  const deleteCategory = async (code: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('code', code);

      if (error) {
        throw new Error(error.message);
      }

      // Recarregar dados após exclusão
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir categoria');
      return false;
    }
  };

  const toggleCategoryActive = async (code: string): Promise<boolean> => {
    try {
      const category = getCategoryByCode(code);
      if (!category) return false;

      const newActiveState = !category.isActive;
      
      const { error } = await supabase
        .from('categories')
        .update({ is_active: newActiveState })
        .eq('code', code);

      if (error) {
        throw new Error(error.message);
      }

      // Se desativando a categoria, desativar todos os produtos dessa categoria
      if (!newActiveState) {
        const { error: productsError } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('category_code', code);

        if (productsError) {
          throw new Error(productsError.message);
        }
      }

      // Recarregar dados após atualização
      await loadData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status da categoria');
      return false;
    }
  };

  return {
    loading,
    error,
    products: filteredProducts, // Produtos filtrados por busca e categoria
    categories: activeCategories,
    allProducts: products,
    allCategories: categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    getProductByCode,
    getProductBySlug,
    getCategoryByCode,
    getCategoryBySlug,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    refreshData: loadData,
  };
};