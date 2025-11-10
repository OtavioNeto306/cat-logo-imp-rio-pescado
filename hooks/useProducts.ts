import { useState, useMemo, useEffect, useCallback } from 'react';
import { initialProducts, initialCategories } from '../data/products'; // Keep for manual seeding instructions
import { Product, Category } from '../types';
import { supabase, supabaseInitializationError } from '../supabaseClient'; // Import Supabase client and error

const generateSlug = (name: string): string => {
  if (!name) return '';
  return name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductsAndCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch categories
      const { data: fetchedCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;
      setCategories(fetchedCategories); // Just set the fetched data

      // Fetch products
      const { data: fetchedProducts, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;
      setProducts(fetchedProducts); // Just set the fetched data

    } catch (err: any) {
      console.error("Error fetching data:", err.message);
      setError("Falha ao carregar dados: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, supabaseInitializationError]);

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]);

  const allCategories = useMemo(() => categories, [categories]); // For admin view

  const activeCategories = useMemo(() => categories.filter(cat => cat.isActive), [categories]); // For public view

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    // Get active categories to filter products
    const currentlyActiveCategories = activeCategories.map(cat => cat.slug);

    // Only show active products whose categories are also active
    filtered = filtered.filter(p => p.isActive && currentlyActiveCategories.includes(p.category)); 

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowercasedFilter) ||
        product.code.toLowerCase().includes(lowercasedFilter) ||
        product.description.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return filtered;
  }, [products, searchTerm, selectedCategory, activeCategories]);

  // Use this for admin panel, where all products (active or not) should be visible
  const allProductsIncludingInactive = useMemo(() => products, [products]);

  const getProductByCode = (code: string): Product | undefined => {
    // Note: This now searches across all fetched products, 
    // the calling component decides whether to filter by isActive.
    return products.find(p => p.code === code);
  };
  
  const getCategoryBySlug = (slug: string): Category | undefined => {
      return allCategories.find(c => c.slug === slug);
  };
  
  const addProduct = async (product: Product) => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...product, isActive: product.isActive === undefined ? true : product.isActive }])
        .select('*');
      
      if (error) throw error;
      await fetchProductsAndCategories(); // Re-fetch all data to ensure consistency
      return true;
    } catch (err: any) {
      console.error("Error adding product:", err.message);
      setError("Falha ao adicionar produto: " + err.message);
      alert('Erro ao adicionar produto: ' + err.message);
      return false;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('code', updatedProduct.code)
        .select('*');
      
      if (error) throw error;
      await fetchProductsAndCategories(); // Re-fetch all data to ensure consistency
      return true;
    } catch (err: any) {
      console.error("Error updating product:", err.message);
      setError("Falha ao atualizar produto: " + err.message);
      alert('Erro ao atualizar produto: ' + err.message);
      return false;
    }
  };

  const deleteProduct = async (code: string) => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('code', code);
      
      if (error) throw error;
      await fetchProductsAndCategories(); // Re-fetch all data to ensure consistency
      return true;
    } catch (err: any) {
      console.error("Error deleting product:", err.message);
      setError("Falha ao excluir produto: " + err.message);
      alert('Erro ao excluir produto: ' + err.message);
      return false;
    }
  };

  const addCategory = async (category: { name: string; imageUrl: string }): Promise<boolean> => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    const slug = generateSlug(category.name);

    if (allCategories.some(c => c.slug === slug)) {
        alert('Erro: Uma categoria com nome similar (mesmo slug) já existe.');
        return false;
    }

    try {
      const newCategory: Category = { ...category, slug, isActive: true }; // New categories are active by default
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select('*');
      
      if (error) throw error;
      await fetchProductsAndCategories(); // Re-fetch all data to ensure consistency
      return true;
    } catch (err: any) {
      console.error("Error adding category:", err.message);
      setError("Falha ao adicionar categoria: " + err.message);
      alert('Erro ao adicionar categoria: ' + err.message);
      return false;
    }
  };

  const updateCategory = async (slugToUpdate: string, data: { name: string; imageUrl: string }): Promise<boolean> => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    const newSlug = generateSlug(data.name);
    
    if (newSlug !== slugToUpdate && allCategories.some(c => c.slug === newSlug)) {
      alert('Erro: Já existe uma categoria com um nome similar (mesmo slug).');
      return false;
    }

    try {
      const { error: categoryUpdateError } = await supabase
        .from('categories')
        .update({ name: data.name, imageUrl: data.imageUrl, slug: newSlug })
        .eq('slug', slugToUpdate);
      
      if (categoryUpdateError) throw categoryUpdateError;

      // If the slug changed, update all associated products
      if (slugToUpdate !== newSlug) {
        const { error: productUpdateError } = await supabase
          .from('products')
          .update({ category: newSlug })
          .eq('category', slugToUpdate);

        if (productUpdateError) throw productUpdateError;
      }
      
      await fetchProductsAndCategories(); // Re-fetch to ensure all data is consistent after potential slug change
      return true;
    } catch (err: any) {
      console.error("Error updating category:", err.message);
      setError("Falha ao atualizar categoria: " + err.message);
      alert('Erro ao atualizar categoria: ' + err.message);
      return false;
    }
  };

  const toggleCategoryActive = async (slug: string) => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    try {
        const categoryToUpdate = categories.find(cat => cat.slug === slug);
        if (!categoryToUpdate) throw new Error('Category not found');

        const newIsActiveStatus = !categoryToUpdate.isActive;

        // Update category status
        const { error: categoryError } = await supabase
            .from('categories')
            .update({ isActive: newIsActiveStatus })
            .eq('slug', slug);
        
        if (categoryError) throw categoryError;

        // Update all products belonging to this category to match its new status
        // This is important because inactive categories should hide their products automatically.
        const { error: productsError } = await supabase
            .from('products')
            .update({ isActive: newIsActiveStatus })
            .eq('category', slug);

        if (productsError) throw productsError;

        await fetchProductsAndCategories(); // Re-fetch to ensure all data is consistent
        return true;
    } catch (err: any) {
      console.error("Error toggling category active status:", err.message);
      setError("Falha ao alterar status da categoria: " + err.message);
      alert('Erro ao alterar status da categoria: ' + err.message);
      return false;
    }
  };

  const deleteCategory = async (slug: string): Promise<boolean> => {
    setError(null);
    if (!supabase) {
      setError(supabaseInitializationError || "Supabase client não está inicializado.");
      alert('Erro: Supabase client não está inicializado.');
      return false;
    }
    // Check if products are associated first (though Supabase FK with ON DELETE RESTRICT would handle this too)
    const associatedProducts = products.some(p => p.category === slug);
    if (associatedProducts) {
      alert('Não é possível excluir esta categoria, pois existem produtos associados a ela. Por favor, remova ou redefina a categoria dos produtos primeiro.');
      return false;
    }

    if (window.confirm('Tem certeza que deseja excluir esta categoria? A ação não pode ser desfeita.')) {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('slug', slug);
            
            if (error) throw error;
            await fetchProductsAndCategories(); // Re-fetch all data to ensure consistency
            return true;
        } catch (err: any) {
            console.error("Error deleting category:", err.message);
            setError("Falha ao excluir categoria: " + err.message);
            alert('Erro ao excluir categoria: ' + err.message);
            return false;
        }
    }
    return false;
  };


  return {
    products: filteredProducts, // This is for public facing view (only active products from active categories)
    allProducts: allProductsIncludingInactive, // This is for admin view (all products, active or not)
    categories: activeCategories, // For public-facing views, only active categories
    allCategories: allCategories, // For admin panel, all categories (active or not)
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    getProductByCode,
    getCategoryBySlug,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    isLoading,
    error,
    fetchProductsAndCategories, // Expose refetch function for convenience
  };
};