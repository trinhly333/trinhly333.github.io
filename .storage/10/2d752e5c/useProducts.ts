import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description: string;
  detailed_description?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image_url: string;
  video_url?: string;
  gallery_images?: string[];
  category_id: string;
  category?: Category;
  category_name?: string;
  is_best_seller?: boolean;
  sold_count?: number;
  rating?: number;
  features?: string[];
  specifications?: Record<string, string>;
  related_products?: string[];
  bundled_products?: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_2e6163d1d7_products')
        .select(`
          *,
          category:app_2e6163d1d7_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      toast.error('Lỗi khi tải danh mục sản phẩm');
    }
  };

  // Create new product
  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      toast.success('Tạo sản phẩm thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tạo sản phẩm';
      toast.error(message);
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      // Clean the data before updating - remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries({ ...productData, updated_at: new Date().toISOString() })
          .filter(([_, value]) => value !== undefined)
      );

      const { data, error } = await supabase
        .from('app_2e6163d1d7_products')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      toast.success('Cập nhật sản phẩm thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật sản phẩm';
      toast.error(message);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_2e6163d1d7_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts(); // Refresh the list
      toast.success('Xóa sản phẩm thành công!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi xóa sản phẩm';
      toast.error(message);
      throw err;
    }
  };

  // Create new category
  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      toast.success('Tạo danh mục thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tạo danh mục';
      toast.error(message);
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_categories')
        .update({ ...categoryData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      toast.success('Cập nhật danh mục thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật danh mục';
      toast.error(message);
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      // Check if category has products
      const { data: productsInCategory, error: checkError } = await supabase
        .from('app_2e6163d1d7_products')
        .select('id')
        .eq('category_id', id);

      if (checkError) throw checkError;

      if (productsInCategory && productsInCategory.length > 0) {
        toast.error('Không thể xóa danh mục có sản phẩm. Vui lòng di chuyển sản phẩm trước.');
        return;
      }

      const { error } = await supabase
        .from('app_2e6163d1d7_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      toast.success('Xóa danh mục thành công!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi xóa danh mục';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};