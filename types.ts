export interface Product {
  code: string;
  name: string;
  description: string;
  category: string; // Corresponds to Category slug
  images: string[];
  isActive: boolean; // New property
}

export interface Category {
  slug: string;
  name: string;
  imageUrl: string;
  isActive: boolean; // New property
}