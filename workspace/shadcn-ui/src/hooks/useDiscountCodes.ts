import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DiscountCode {
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

export const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      
      // Fetch from campaigns table instead of hardcoded data
      const { data, error } = await supabase
        .from('app_2e6163d1d7_campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Filter only active and valid campaigns
      const now = new Date();
      const validCodes = (data || []).filter(campaign => {
        const startDate = new Date(campaign.start_date);
        const endDate = new Date(campaign.end_date);
        
        // Check if campaign is within valid date range
        const isValidDate = now >= startDate && now <= endDate;
        
        // Check if campaign hasn't exceeded max uses
        const hasUsesLeft = !campaign.max_uses || campaign.current_uses < campaign.max_uses;
        
        return isValidDate && hasUsesLeft;
      });

      setDiscountCodes(validCodes);
    } catch (err) {
      console.error('Fetch discount codes error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch discount codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  return {
    discountCodes,
    loading,
    error,
    refetch: fetchDiscountCodes
  };
};