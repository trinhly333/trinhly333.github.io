import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active discount codes
  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_2e6163d1d7_discount_codes')
        .select('*')
        .eq('is_active', true)
        .order('min_order_amount', { ascending: true });

      if (error) throw error;
      setDiscountCodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discount codes');
      toast.error('Lỗi khi tải mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  // Validate discount code
  const validateDiscountCode = async (code: string, orderAmount: number) => {
    try {
      const { data, error } = await supabase
        .from('app_2e6163d1d7_discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' };
        }
        throw error;
      }

      const discountCode = data as DiscountCode;

      // Check if order meets minimum amount
      if (orderAmount < discountCode.min_order_amount) {
        return {
          valid: false,
          message: `Đơn hàng tối thiểu ${discountCode.min_order_amount.toLocaleString('vi-VN')}đ để sử dụng mã này`
        };
      }

      // Check usage limit
      if (discountCode.usage_limit && discountCode.used_count >= discountCode.usage_limit) {
        return { valid: false, message: 'Mã giảm giá đã hết lượt sử dụng' };
      }

      // Check expiry date
      if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
        return { valid: false, message: 'Mã giảm giá đã hết hạn' };
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discountCode.discount_type === 'fixed') {
        discountAmount = discountCode.discount_value;
      } else {
        discountAmount = (orderAmount * discountCode.discount_value) / 100;
        if (discountCode.max_discount_amount) {
          discountAmount = Math.min(discountAmount, discountCode.max_discount_amount);
        }
      }

      return {
        valid: true,
        discountCode,
        discountAmount,
        message: 'Mã giảm giá hợp lệ'
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi kiểm tra mã giảm giá';
      toast.error(message);
      return { valid: false, message };
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  return {
    discountCodes,
    loading,
    error,
    fetchDiscountCodes,
    validateDiscountCode,
  };
};