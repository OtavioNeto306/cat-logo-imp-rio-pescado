import React from 'react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { categories, products } = useProducts(); // 'products' and 'categories' here will already be filtered for isActive: true
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Hero />
      <div className="bg-neutral">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold font-display text-center text-primary mb-12">Nossas Categorias</h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </div>
       <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold font-display text-center text-primary mb-12">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;