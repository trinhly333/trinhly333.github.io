import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_2e6163d1d7_site_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      
      // Convert array to key-value object
      const settingsObj: Record<string, string> = {};
      data?.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      
      setSettings(settingsObj);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      toast.error('Lỗi khi tải cài đặt website');
    } finally {
      setLoading(false);
    }
  };

  // Update a setting
  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('app_2e6163d1d7_site_settings')
        .upsert({ 
          key, 
          value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      
      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Cập nhật cài đặt thành công!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật cài đặt';
      toast.error(message);
      throw err;
    }
  };

  // Update multiple settings at once
  const updateSettings = async (settingsData: Record<string, string>) => {
    try {
      const settingsArray = Object.entries(settingsData).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('app_2e6163d1d7_site_settings')
        .upsert(settingsArray, { onConflict: 'key' });

      if (error) throw error;
      
      // Update local state
      setSettings(prev => ({ ...prev, ...settingsData }));
      toast.success('Cập nhật cài đặt thành công!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật cài đặt';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    fetchSettings
  };
};