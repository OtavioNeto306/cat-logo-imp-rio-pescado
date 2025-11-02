export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          code: string;
          slug: string;
          name: string;
          image_url: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          slug: string;
          name: string;
          image_url: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          slug?: string;
          name?: string;
          image_url?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          code: string;
          slug: string;
          name: string;
          category_code: string;
          image_url: string;
          description: string;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          slug: string;
          name: string;
          category_code: string;
          image_url: string;
          description: string;
          images: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          slug?: string;
          name?: string;
          category_code?: string;
          image_url?: string;
          description?: string;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}