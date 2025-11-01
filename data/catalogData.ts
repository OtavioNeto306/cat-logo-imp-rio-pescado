// Arquivo de dados estáticos para produção
// Este arquivo deve ser atualizado quando houver mudanças nos dados
// Para atualizar: exporte os dados do admin e substitua o conteúdo abaixo

import { Product, Category } from '../types';

export const productionData = {
  products: [
    {
      "code": "CAM001",
      "slug": "camarao-rosa",
      "name": "Camarão Rosa",
      "category": "crustaceos",
      "imageUrl": "https://picsum.photos/400/300?random=1",
      "description": "Camarão rosa fresco, ideal para pratos especiais",
      "images": [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2"
      ],
      "isActive": true
    },
    {
      "code": "PEI001",
      "slug": "peixe-salmao",
      "name": "Salmão Fresco",
      "category": "peixes",
      "imageUrl": "https://picsum.photos/400/300?random=3",
      "description": "Salmão fresco de alta qualidade",
      "images": [
        "https://picsum.photos/400/300?random=3",
        "https://picsum.photos/400/300?random=4"
      ],
      "isActive": true
    }
  ] as Product[],
  
  categories: [
    {
      "code": "peixes",
      "slug": "peixes",
      "name": "Peixes",
      "imageUrl": "https://picsum.photos/300/200?random=10",
      "isActive": true
    },
    {
      "code": "crustaceos",
      "slug": "crustaceos", 
      "name": "Crustáceos",
      "imageUrl": "https://picsum.photos/300/200?random=11",
      "isActive": true
    }
  ] as Category[]
};

// Função para verificar se há dados em produção
export const hasProductionData = (): boolean => {
  return productionData.products.length > 0 && productionData.categories.length > 0;
};

// Função para obter dados de produção
export const getProductionData = () => {
  return {
    products: productionData.products,
    categories: productionData.categories
  };
};