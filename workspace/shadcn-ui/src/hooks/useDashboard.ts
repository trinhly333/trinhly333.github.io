import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: unknown[];
  popularProducts: unknown[];
  monthlySales: unknown[];
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    popularProducts: [],
    monthlySales: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('app_2e6163d1d7_products')
        .select('*', { count: 'exact', head: true });

      // Fetch categories count
      const { count: categoriesCount } = await supabase
        .from('app_2e6163d1d7_categories')
        .select('*', { count: 'exact', head: true });

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from('app_2e6163d1d7_customers')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and recent orders
      const { data: orders, count: ordersCount } = await supabase
        .from('app_2e6163d1d7_orders')
        .select(`
          *,
          customer:app_2e6163d1d7_customers(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate total revenue
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Fetch popular products (mock data for now)
      const { data: products } = await supabase
        .from('app_2e6163d1d7_products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate real monthly sales data from orders
      const monthlySalesData = [];
      for (let i = 5; i >= 0; i--) {
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - i);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const { data: monthlyOrders } = await supabase
          .from('app_2e6163d1d7_orders')
          .select('total_amount')
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());

        const monthSales = monthlyOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        monthlySalesData.push({
          month: startOfMonth.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
          sales: monthSales
        });
      }
      const monthlySales = monthlySalesData;

      setStats({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        totalCustomers: customersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        recentOrders: orders || [],
        popularProducts: products || [],
        monthlySales
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Lỗi tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    fetchDashboardStats
  };
};