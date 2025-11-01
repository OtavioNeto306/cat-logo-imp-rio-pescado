
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGallery from '../components/ProductGallery';
import WhatsAppCTA from '../components/WhatsAppCTA';

const JsonLdProduct: React.FC<{ product: import('../types').Product }> = ({ product }) => {
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description,
        "sku": product.code,
        "brand": {
            "@type": "Brand",
            "name": "Império Pescado"
        }
    };

    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    );
};

const ProductDetailPage: React.FC = () => {
  const { productCode } = useParams<{ productCode: string }>();
  const { getProductByCode, getCategoryBySlug } = useProducts();

  // Use allProducts to find, as getProductByCode might implicitly filter for active only.
  // We explicitly check isActive here.
  const product = productCode ? getProductByCode(productCode) : undefined;
  
  if (!product || !product.isActive) {
    // Redirect to catalog if product not found or is inactive
    return <Navigate to="/catalogo" replace />;
  }

  const category = getCategoryBySlug(product.category);

  return (
    <>
      <JsonLdProduct product={product} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 text-sm text-gray-500">
            <Link to="/catalogo" className="hover:text-accent">Catálogo</Link>
            {category && (
                <>
                    <span className="mx-2">/</span>
                    <Link to={`/catalogo/${category.slug}`} className="hover:text-accent">{category.name}</Link>
                </>
            )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <div>
            <span className="block text-sm font-medium text-accent uppercase">{product.code}</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-primary">{product.name}</h1>
            <p className="mt-6 text-base text-gray-700 leading-relaxed">{product.description}</p>
            <WhatsAppCTA productName={product.name} productCode={product.code} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
