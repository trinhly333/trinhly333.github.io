import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smxhiggtyoyyhxuuhmnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNteGhpZ2d0eW95eWh4dXVobW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzU2MjgsImV4cCI6MjA3MTExMTYyOH0.ez9xuhvtBv3EkLm8orswpM-QtbDt6kEugPw2X4tTN-M';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price: number | null;
          discount_percentage: number | null;
          image_url: string;
          category_id: string;
          is_best_seller: boolean;
          sold_count: number;
          rating: number;
          features: string[];
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          original_price?: number | null;
          discount_percentage?: number | null;
          image_url: string;
          category_id: string;
          is_best_seller?: boolean;
          sold_count?: number;
          rating?: number;
          features?: string[];
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          discount_percentage?: number | null;
          image_url?: string;
          category_id?: string;
          is_best_seller?: boolean;
          sold_count?: number;
          rating?: number;
          features?: string[];
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
}