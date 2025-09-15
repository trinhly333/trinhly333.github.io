import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import AdminLayout from '@/components/AdminLayout';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    business_hours: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    tiktok_url: '',
    zalo_number: '',
    whatsapp_number: '',
    google_map_embed: '',
    about_us_content: '',
    privacy_policy: '',
    terms_of_service: '',
    return_policy: '',
    shipping_info: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when settings load
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        business_hours: settings.business_hours || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || '',
        tiktok_url: settings.tiktok_url || '',
        zalo_number: settings.zalo_number || '',
        whatsapp_number: settings.whatsapp_number || '',
        google_map_embed: settings.google_map_embed || '',
        about_us_content: settings.about_us_content || '',
        privacy_policy: settings.privacy_policy || '',
        terms_of_service: settings.terms_of_service || '',
        return_policy: settings.return_policy || '',
        shipping_info: settings.shipping_info || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSettings(formData);
    } catch (error) {
      // Error handled by the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải cài đặt...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary-accent-green" />
          <div>
            <h1 className="text-3xl font-bold text-text-charcoal">Cài đặt Website</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin website và tích hợp với trang liên hệ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="contact">Liên hệ</TabsTrigger>
              <TabsTrigger value="social">Mạng xã hội</TabsTrigger>
              <TabsTrigger value="policies">Chính sách</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Site Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Thông tin Website</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site_name">Tên Website</Label>
                    <Input
                      id="site_name"
                      value={formData.site_name}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      placeholder="Worksheet"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="site_description">Mô tả Website</Label>
                    <Textarea
                      id="site_description"
                      value={formData.site_description}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      placeholder="Tạo website chuyên nghiệp từ Google Sheet"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="about_us_content">Nội dung Giới thiệu</Label>
                    <Textarea
                      id="about_us_content"
                      value={formData.about_us_content}
                      onChange={(e) => handleInputChange('about_us_content', e.target.value)}
                      placeholder="Mô tả chi tiết về công ty, sứ mệnh, tầm nhìn..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Thông tin Liên hệ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_email">Email Liên hệ</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        placeholder="hello@worksheet.vn"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact_phone">Số điện thoại</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
                    />
                  </div>

                  <div>
                    <Label htmlFor="business_hours">Giờ làm việc</Label>
                    <Textarea
                      id="business_hours"
                      value={formData.business_hours}
                      onChange={(e) => handleInputChange('business_hours', e.target.value)}
                      placeholder="Thứ 2 - Thứ 6: 8:00 - 18:00&#10;Thứ 7 - Chủ nhật: 9:00 - 17:00"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zalo_number">Số Zalo</Label>
                      <Input
                        id="zalo_number"
                        value={formData.zalo_number}
                        onChange={(e) => handleInputChange('zalo_number', e.target.value)}
                        placeholder="0123456789"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="whatsapp_number">Số WhatsApp</Label>
                      <Input
                        id="whatsapp_number"
                        value={formData.whatsapp_number}
                        onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="google_map_embed">Google Maps Embed Code</Label>
                    <Textarea
                      id="google_map_embed"
                      value={formData.google_map_embed}
                      onChange={(e) => handleInputChange('google_map_embed', e.target.value)}
                      placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>'
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Lấy mã nhúng từ Google Maps để hiển thị bản đồ trên trang liên hệ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Facebook className="h-5 w-5" />
                    <span>Mạng xã hội</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook_url" className="flex items-center space-x-2">
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </Label>
                      <Input
                        id="facebook_url"
                        value={formData.facebook_url}
                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instagram_url" className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </Label>
                      <Input
                        id="instagram_url"
                        value={formData.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="youtube_url" className="flex items-center space-x-2">
                        <Youtube className="h-4 w-4" />
                        <span>YouTube</span>
                      </Label>
                      <Input
                        id="youtube_url"
                        value={formData.youtube_url}
                        onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                        placeholder="https://youtube.com/yourchannel"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tiktok_url" className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>TikTok</span>
                      </Label>
                      <Input
                        id="tiktok_url"
                        value={formData.tiktok_url}
                        onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                        placeholder="https://tiktok.com/@yourpage"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              {/* Policies */}
              <Card>
                <CardHeader>
                  <CardTitle>Chính sách & Điều khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="privacy_policy">Chính sách bảo mật</Label>
                    <Textarea
                      id="privacy_policy"
                      value={formData.privacy_policy}
                      onChange={(e) => handleInputChange('privacy_policy', e.target.value)}
                      placeholder="Nội dung chính sách bảo mật..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms_of_service">Điều khoản dịch vụ</Label>
                    <Textarea
                      id="terms_of_service"
                      value={formData.terms_of_service}
                      onChange={(e) => handleInputChange('terms_of_service', e.target.value)}
                      placeholder="Nội dung điều khoản dịch vụ..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="return_policy">Chính sách đổi trả</Label>
                    <Textarea
                      id="return_policy"
                      value={formData.return_policy}
                      onChange={(e) => handleInputChange('return_policy', e.target.value)}
                      placeholder="Nội dung chính sách đổi trả..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_info">Thông tin vận chuyển</Label>
                    <Textarea
                      id="shipping_info"
                      value={formData.shipping_info}
                      onChange={(e) => handleInputChange('shipping_info', e.target.value)}
                      placeholder="Thông tin về phí vận chuyển, thời gian giao hàng..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="worksheet-cta-button"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Đang lưu...' : 'Lưu tất cả cài đặt'}
              </Button>
            </div>
          </Tabs>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;