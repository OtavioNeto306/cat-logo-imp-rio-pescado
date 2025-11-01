
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { normalizeImageUrl } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const placeholder = `https://via.placeholder.com/400x400.png/F9FAFB/111827?text=${encodeURIComponent(alt)}`;
    const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src) || placeholder);
    
    React.useEffect(() => {
        setImgSrc(normalizeImageUrl(src) || placeholder);
    }, [src, placeholder]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(placeholder)}
            loading="lazy"
        />
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      to={`/catalogo/${product.category}/${product.code}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 font-medium uppercase">{product.code}</p>
        <h3 className="mt-1 text-base font-semibold text-primary group-hover:text-accent transition-colors">
          {product.name}
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
