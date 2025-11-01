
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/catalogo/${category.slug}`} className="group relative block">
      <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
        <h3 className="text-2xl font-semibold text-white font-display">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
