export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category?: {
    id: string;
    name: string;
  };
  status: 'active' | 'inactive';
  is_best_seller: boolean;
  rating: number;
  sold_count: number;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}