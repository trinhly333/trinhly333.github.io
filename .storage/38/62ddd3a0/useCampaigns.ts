import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      toast.error('Lỗi khi tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  // Create new campaign
  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'current_uses'>) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .insert([{ ...campaignData, current_uses: 0 }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchCampaigns(); // Refresh the list
      toast.success('Tạo khuyến mãi thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tạo khuyến mãi';
      toast.error(message);
      throw err;
    }
  };

  // Update campaign
  const updateCampaign = async (id: string, campaignData: Partial<Campaign>) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .update({ ...campaignData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchCampaigns(); // Refresh the list
      toast.success('Cập nhật khuyến mãi thành công!');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật khuyến mãi';
      toast.error(message);
      throw err;
    }
  };

  // Delete campaign
  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchCampaigns(); // Refresh the list
      toast.success('Xóa khuyến mãi thành công!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi xóa khuyến mãi';
      toast.error(message);
      throw err;
    }
  };

  // Validate discount code (for checkout)
  const validateDiscountCode = async (code: string, orderAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'active')
        .single();

      if (error || !data) {
        throw new Error('Mã giảm giá không hợp lệ');
      }

      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (now < startDate || now > endDate) {
        throw new Error('Mã giảm giá đã hết hạn');
      }

      if (orderAmount < data.min_order_amount) {
        throw new Error(`Đơn hàng tối thiểu ${data.min_order_amount.toLocaleString('vi-VN')}đ`);
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        throw new Error('Mã giảm giá đã hết lượt sử dụng');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi kiểm tra mã giảm giá';
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    validateDiscountCode,
    fetchCampaigns
  };
};