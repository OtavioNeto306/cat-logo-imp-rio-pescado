
import React, { useState, useEffect } from 'react';
import { normalizeImageUrl } from '../utils/imageUtils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [mainImage, setMainImage] = useState('');
  
  useEffect(() => {
    const placeholder = `https://via.placeholder.com/800x800.png?text=Sem+imagem`;
    setMainImage(normalizeImageUrl(images[0]) || placeholder);
  }, [images]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
        {images.map((image, index) => {
          const normalizedThumb = normalizeImageUrl(image);
          return (
            <button
              key={index}
              onClick={() => setMainImage(normalizedThumb)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${mainImage === normalizedThumb ? 'border-accent' : 'border-transparent'}`}
            >
              <img src={normalizedThumb} alt={`${productName} - visualização ${index + 1}`} className="w-full h-full object-cover"/>
            </button>
          )
        })}
      </div>
      <div className="flex-1">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-auto aspect-square object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
