export interface Product {
  code: string;
  name: string;
  description: string;
  category: string; // Corresponds to Category slug
  price: number;
  images: string[];
  isActive: boolean; // New property
}

export interface Category {
  code: string;
  slug: string;
  name: string;
  imageUrl: string;
  isActive: boolean; // New property
}