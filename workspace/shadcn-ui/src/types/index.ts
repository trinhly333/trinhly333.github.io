export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  thumbnail_url: string;
  video_demo_url: string;
  google_sheets_url?: string;
  image_gallery_urls: string[];
  addons: ProductAddon[];
  category: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons: ProductAddon[];
  totalPrice: number;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'vietqr' | 'momo' | 'zalopay';
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  selected_addons: ProductAddon[];
  total_price: number;
}

export interface SiteSettings {
  id: string;
  site_logo_url: string;
  favicon_url: string;
  contact_email: string;
  facebook_group_url: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count: number;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: 'vietqr' | 'momo' | 'zalopay';
  logo_url: string;
  is_active: boolean;
}