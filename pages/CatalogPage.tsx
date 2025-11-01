import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchAndFilter from '../components/SearchAndFilter';
import { useProducts } from '../hooks/useProducts';

const CatalogPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const {
    products, // 'products' here will already be filtered for isActive: true
    categories, // This is now active categories only
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    getCategoryBySlug, // This retrieves from all categories for name display
  } = useProducts();

  useEffect(() => {
    setSelectedCategory(categorySlug || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);
  
  // getCategoryBySlug now needs to retrieve from ALL categories, not just active ones, to show the name
  // even if the category is inactive (e.g., if navigating directly to a URL with an inactive category slug)
  const currentCategoryObj = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const categoryName = currentCategoryObj ? currentCategoryObj.name : 'Todos os Produtos';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-primary">{categoryName}</h1>
        <p className="mt-2 text-lg text-gray-600">Explore nossa seleção completa de produtos frescos e especiais.</p>
      </div>

      <SearchAndFilter
        categories={categories} // These are already active categories
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-primary">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mt-2">Tente ajustar sua busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;