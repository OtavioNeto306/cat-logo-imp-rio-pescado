import { useState, useMemo, useEffect } from 'react';
import { initialProducts, initialCategories } from '../data/products';
import { Product, Category } from '../types';
import { hasProductionData, getProductionData } from '../data/catalogData';

const PRODUCTS_STORAGE_KEY = 'imperio_pescado_products';
const CATEGORIES_STORAGE_KEY = 'imperio_pescado_categories';

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
  const [products, setProducts] = useState<Product[]>(() => {
    let loadedProducts: Product[] = [];
    try {
      const storedProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        loadedProducts = JSON.parse(storedProducts);
      }
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
    }

    // Determine which data source to use
    let defaultProducts = initialProducts;
    
    // Use production data if available and no localStorage data exists
    if (hasProductionData() && loadedProducts.length === 0) {
      const productionData = getProductionData();
      defaultProducts = productionData.products;
    }

    const productsToInitialize = loadedProducts.length > 0 ? loadedProducts : defaultProducts;

    const productsWithDefaults = productsToInitialize.map(p => ({
      ...p,
      isActive: p.isActive === undefined ? true : p.isActive,
    }));

    if (loadedProducts.length === 0 && defaultProducts.length > 0) {
        window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsWithDefaults));
    }
    
    return productsWithDefaults;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    let loadedCategories: Category[] = [];
    try {
      const storedCategories = window.localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCategories) {
        loadedCategories = JSON.parse(storedCategories);
      }
    } catch (error) {
      console.error("Failed to parse categories from localStorage", error);
    }

    // Determine which data source to use
    let defaultCategories = initialCategories;
    
    // Use production data if available and no localStorage data exists
    if (hasProductionData() && loadedCategories.length === 0) {
      const productionData = getProductionData();
      defaultCategories = productionData.categories;
    }

    const categoriesToInitialize = loadedCategories.length > 0 ? loadedCategories : defaultCategories;

    const categoriesWithDefaults = categoriesToInitialize.map(c => ({
        ...c,
        isActive: c.isActive === undefined ? true : c.isActive,
    }));

    if (loadedCategories.length === 0 && defaultCategories.length > 0) {
        window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesWithDefaults));
    }

    return categoriesWithDefaults;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Persist products to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products to localStorage", error);
    }
  }, [products]);

  // Persist categories to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
        console.error("Failed to save categories to localStorage", error);
    }
  }, [categories]);

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
    return products.find(p => p.code === code);
  };
  
  const getCategoryBySlug = (slug: string): Category | undefined => {
      return allCategories.find(c => c.slug === slug);
  };
  
  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, { ...product, isActive: product.isActive === undefined ? true : product.isActive }]); // Ensure new products respect isActive or default to true
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => (p.code === updatedProduct.code ? updatedProduct : p))
    );
  };

  const deleteProduct = (code: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.code !== code));
  };

  const addCategory = (category: Omit<Category, 'slug'>): boolean => {
    const slug = generateSlug(category.name);

    if (allCategories.some(c => c.slug === slug)) {
        alert('Erro: Uma categoria com nome similar (mesmo slug) já existe.');
        return false;
    }

    const newCategory: Category = { ...category, slug, isActive: true }; // New categories are active by default
    setCategories(prev => [...prev, newCategory]);
    return true;
  };

  const updateCategory = (slugToUpdate: string, data: { name: string; imageUrl: string }): boolean => {
    const newSlug = generateSlug(data.name);
    
    if (newSlug !== slugToUpdate && allCategories.some(c => c.slug === newSlug)) {
      alert('Erro: Já existe uma categoria com um nome similar (mesmo slug).');
      return false;
    }

    setCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.slug === slugToUpdate 
          ? { ...cat, name: data.name, imageUrl: data.imageUrl, slug: newSlug } 
          : cat
      )
    );

    // If the slug changed, update all associated products
    if (slugToUpdate !== newSlug) {
      setProducts(prevProducts =>
        prevProducts.map(p => 
          p.category === slugToUpdate ? { ...p, category: newSlug } : p
        )
      );
    }
    
    return true;
  };

  const toggleCategoryActive = (slug: string) => {
    setCategories(prevCategories => {
        const updatedCategories = prevCategories.map(cat => 
            cat.slug === slug ? { ...cat, isActive: !cat.isActive } : cat
        );
        // Find the new status of the category
        const newCategoryStatus = updatedCategories.find(cat => cat.slug === slug)?.isActive;

        // Update all products belonging to this category to match its new status
        setProducts(prevProducts => 
            prevProducts.map(p => 
                p.category === slug ? { ...p, isActive: newCategoryStatus } : p
            )
        );
        return updatedCategories;
    });
  };

  const deleteCategory = (slug: string): boolean => {
    if (products.some(p => p.category === slug)) {
      alert('Não é possível excluir esta categoria, pois existem produtos associados a ela.');
      return false;
    }

    if (window.confirm('Tem certeza que deseja excluir esta categoria? A ação não pode ser desfeita.')) {
      setCategories(prevCategories => prevCategories.filter(cat => cat.slug !== slug));
      return true;
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
    toggleCategoryActive, // New function for category activation
  };
};