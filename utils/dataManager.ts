import { Product, Category } from '../types';

export interface CatalogData {
  products: Product[];
  categories: Category[];
  exportDate: string;
  version: string;
}

export class DataManager {
  private static readonly PRODUCTS_KEY = 'imperio_pescado_products';
  private static readonly CATEGORIES_KEY = 'imperio_pescado_categories';
  private static readonly VERSION = '1.0.0';

  /**
   * Exporta todos os dados do localStorage para um objeto JSON
   */
  static exportData(): CatalogData {
    const products = this.getStoredProducts();
    const categories = this.getStoredCategories();
    
    return {
      products,
      categories,
      exportDate: new Date().toISOString(),
      version: this.VERSION
    };
  }

  /**
   * Importa dados de um objeto JSON para o localStorage
   */
  static importData(data: CatalogData): boolean {
    try {
      // Validação básica
      if (!data.products || !data.categories) {
        throw new Error('Dados inválidos: produtos ou categorias ausentes');
      }

      // Validação de estrutura
      this.validateProducts(data.products);
      this.validateCategories(data.categories);

      // Salva no localStorage
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(data.products));
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(data.categories));

      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  /**
   * Baixa os dados como arquivo JSON
   */
  static downloadData(): void {
    const data = this.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `catalogo-imperio-pescado-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Carrega dados de um arquivo JSON
   */
  static async loadFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data: CatalogData = JSON.parse(text);
      return this.importData(data);
    } catch (error) {
      console.error('Erro ao carregar arquivo:', error);
      return false;
    }
  }

  /**
   * Gera dados para produção (sem localStorage)
   */
  static generateProductionData(): string {
    const data = this.exportData();
    return `// Dados gerados automaticamente em ${data.exportDate}
export const productionData = ${JSON.stringify(data, null, 2)};`;
  }

  // Métodos privados
  private static getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static getStoredCategories(): Category[] {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static validateProducts(products: any[]): void {
    products.forEach((product, index) => {
      if (!product.code || !product.name || !product.category) {
        throw new Error(`Produto inválido no índice ${index}: campos obrigatórios ausentes`);
      }
    });
  }

  private static validateCategories(categories: any[]): void {
    categories.forEach((category, index) => {
      if (!category.slug || !category.name) {
        throw new Error(`Categoria inválida no índice ${index}: campos obrigatórios ausentes`);
      }
    });
  }

  /**
   * Limpa todos os dados do localStorage
   */
  static clearAllData(): boolean {
    if (window.confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados do catálogo. Esta ação não pode ser desfeita. Tem certeza?')) {
      localStorage.removeItem(this.PRODUCTS_KEY);
      localStorage.removeItem(this.CATEGORIES_KEY);
      window.location.reload();
      return true;
    }
    return false;
  }

  /**
   * Verifica se há dados salvos no localStorage
   */
  static hasStoredData(): boolean {
    return !!(localStorage.getItem(this.PRODUCTS_KEY) || localStorage.getItem(this.CATEGORIES_KEY));
  }
}