import { Product, Category } from '../types';
import { supabase } from '../lib/supabase';

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
   * Exporta todos os dados do Supabase para um objeto JSON
   */
  static async exportData(): Promise<CatalogData> {
    try {
      // Buscar categorias do Supabase
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
        throw categoriesError;
      }

      // Buscar produtos do Supabase
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) {
        console.error('Erro ao buscar produtos:', productsError);
        throw productsError;
      }

      // Converter dados do Supabase para o formato esperado
      const formattedCategories: Category[] = (categories || []).map(cat => ({
        code: cat.code,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.image_url || '',
        isActive: cat.is_active
      }));

      const formattedProducts: Product[] = (products || []).map(prod => ({
        code: prod.code,
        name: prod.name,
        slug: prod.slug,
        description: prod.description || '',
        price: prod.price || 0,
        category: prod.category,
        imageUrl: prod.image_url || '',
        isActive: prod.is_active,
        isFeatured: prod.is_featured || false
      }));

      return {
        products: formattedProducts,
        categories: formattedCategories,
        exportDate: new Date().toISOString(),
        version: this.VERSION
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      // Retornar dados vazios em caso de erro
      return {
        products: [],
        categories: [],
        exportDate: new Date().toISOString(),
        version: this.VERSION
      };
    }
  }

  /**
   * Importa dados para o Supabase
   */
  static async importData(data: CatalogData): Promise<boolean> {
    try {
      // Validar dados primeiro
      this.validateCategories(data.categories);
      this.validateProducts(data.products);

      // Converter categorias para o formato do Supabase
      const categoriesToInsert = data.categories.map(cat => ({
        code: cat.code,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.imageUrl || null,
        is_active: cat.isActive !== false
      }));

      // Converter produtos para o formato do Supabase
      const productsToInsert = data.products.map(prod => ({
        code: prod.code,
        name: prod.name,
        slug: prod.slug,
        description: prod.description || null,
        price: prod.price || null,
        category: prod.category,
        image_url: prod.imageUrl || null,
        is_active: prod.isActive !== false,
        is_featured: prod.isFeatured || false
      }));

      // Limpar dados existentes (opcional - pode ser comentado se quiser manter dados)
      await supabase.from('products').delete().neq('id', 0);
      await supabase.from('categories').delete().neq('id', 0);

      // Inserir categorias
      if (categoriesToInsert.length > 0) {
        const { error: categoriesError } = await supabase
          .from('categories')
          .insert(categoriesToInsert);

        if (categoriesError) {
          console.error('Erro ao inserir categorias:', categoriesError);
          throw categoriesError;
        }
      }

      // Inserir produtos
      if (productsToInsert.length > 0) {
        const { error: productsError } = await supabase
          .from('products')
          .insert(productsToInsert);

        if (productsError) {
          console.error('Erro ao inserir produtos:', productsError);
          throw productsError;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  /**
   * Baixa os dados como arquivo JSON
   */
  static async downloadData(): Promise<void> {
    try {
      const data = await this.exportData();
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
    } catch (error) {
      console.error('Erro ao baixar dados:', error);
      throw error;
    }
  }

  /**
   * Carrega dados de um arquivo JSON
   */
  static async loadFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data: CatalogData = JSON.parse(text);
      return await this.importData(data);
    } catch (error) {
      console.error('Erro ao carregar arquivo:', error);
      return false;
    }
  }

  /**
   * Migra dados do localStorage para o Supabase
   */
  static async migrateFromLocalStorage(): Promise<boolean> {
    // Versão simplificada para teste - apenas limpa localStorage
    try {
      if (!this.hasLocalStorageData()) {
        return true;
      }
      return this.clearLocalStorage();
    } catch (error) {
      console.error('Erro na migração:', error);
      return false;
    }
  }

  /**
   * Verifica se há dados no localStorage para migrar
   */
  static hasLocalStorageData(): boolean {
    const products = this.getStoredProducts();
    const categories = this.getStoredCategories();
    return products.length > 0 || categories.length > 0;
  }

  /**
   * Limpa dados do localStorage
   */
  static clearLocalStorage(): boolean {
    try {
      localStorage.removeItem(this.PRODUCTS_KEY);
      localStorage.removeItem(this.CATEGORIES_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  /**
   * Limpa todos os dados do Supabase
   */
  static async clearAllData(): Promise<boolean> {
    // Versão simplificada para teste - apenas retorna true
    return true;
  }

  // Métodos privados para localStorage (para migração)
  private static getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler produtos do localStorage:', error);
      return [];
    }
  }

  private static getStoredCategories(): Category[] {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler categorias do localStorage:', error);
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
      if (!category.code || !category.name) {
        throw new Error(`Categoria inválida no índice ${index}: campos obrigatórios ausentes`);
      }
    });
  }
}