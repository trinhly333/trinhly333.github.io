import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/useSettings';

const ContactPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Get settings with fallbacks
  const siteName = settings.site_name || 'Worksheet';
  const contactEmail = settings.contact_email || 'support@worksheet.vn';
  const contactPhone = settings.contact_phone || '0123 456 789';
  const address = settings.address || '123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam';
  const businessHours = settings.business_hours || 'Thứ 2 - Thứ 6: 8:00 - 18:00\nThứ 7 - Chủ nhật: 9:00 - 17:00';
  const zaloNumber = settings.zalo_number || contactPhone;
  const whatsappNumber = settings.whatsapp_number;
  const googleMapEmbed = settings.google_map_embed;
  const facebookUrl = settings.facebook_url;
  const instagramUrl = settings.instagram_url;
  const youtubeUrl = settings.youtube_url;

  return (
    <div className="min-h-screen bg-background-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="worksheet-h1 mb-6">Liên hệ với {siteName}</h1>
          <p className="worksheet-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ {siteName} luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Phone */}
              <Card className="bg-container-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="worksheet-h3 flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-primary-accent-green" />
                    <span>Điện thoại</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="worksheet-body text-gray-600 mb-2">Hotline hỗ trợ</p>
                  <a 
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    className="text-lg font-semibold text-text-charcoal hover:text-primary-accent-green transition-colors"
                  >
                    {contactPhone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Thứ 2 - Chủ nhật, 8:00 - 22:00</p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="bg-container-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="worksheet-h3 flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-secondary-accent-blue" />
                    <span>Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="worksheet-body text-gray-600 mb-2">Email hỗ trợ</p>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-lg font-semibold text-text-charcoal hover:text-secondary-accent-blue transition-colors"
                  >
                    {contactEmail}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Phản hồi trong vòng 24h</p>
                </CardContent>
              </Card>

              {/* Zalo */}
              {zaloNumber && (
                <Card className="bg-container-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="worksheet-h3 flex items-center space-x-3">
                      <MessageCircle className="h-6 w-6 text-cta-orange" />
                      <span>Zalo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="worksheet-body text-gray-600 mb-2">Chat trực tiếp</p>
                    <a 
                      href={`https://zalo.me/${zaloNumber.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-text-charcoal hover:text-cta-orange transition-colors"
                    >
                      {zaloNumber}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Hỗ trợ nhanh chóng</p>
                  </CardContent>
                </Card>
              )}



              {/* Social Media */}
              {(facebookUrl || instagramUrl || youtubeUrl) && (
                <Card className="bg-container-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="worksheet-h3">Theo dõi chúng tôi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      {facebookUrl && (
                        <a
                          href={facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                      {instagramUrl && (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800 transition-colors"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {youtubeUrl && (
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Youtube className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <Card className="bg-container-white border border-gray-200">
              <CardHeader>
                <CardTitle className="worksheet-h2">Gửi tin nhắn cho chúng tôi</CardTitle>
                <p className="worksheet-body text-gray-600">
                  Điền thông tin vào form dưới đây và chúng tôi sẽ phản hồi bạn sớm nhất có thể.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Họ và tên *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên của bạn"
                        required
                        className="bg-background-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ email"
                        required
                        className="bg-background-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Số điện thoại
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="bg-background-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Chủ đề
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Chủ đề cần hỗ trợ"
                        className="bg-background-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-charcoal mb-2">
                      Nội dung tin nhắn *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Mô tả chi tiết nhu cầu hoặc câu hỏi của bạn..."
                      rows={6}
                      required
                      className="bg-background-white"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="worksheet-cta-button w-full md:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Google Map */}
            {googleMapEmbed && (
              <Card className="bg-container-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="worksheet-h3">Bản đồ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-full h-64 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: googleMapEmbed }}
                  />
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <Card className="bg-gradient-to-r from-primary-accent-green/5 to-secondary-accent-blue/5 border border-gray-200">
              <CardHeader>
                <CardTitle className="worksheet-h3">Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-charcoal mb-2">
                      Tôi có thể tùy chỉnh mẫu website theo ý muốn không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Có, tất cả mẫu website đều có thể tùy chỉnh màu sắc, nội dung, hình ảnh theo yêu cầu của bạn.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-charcoal mb-2">
                      Thời gian bàn giao website là bao lâu?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Thường là 1-3 ngày làm việc kể từ khi nhận đầy đủ thông tin và hoàn tất thanh toán.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-charcoal mb-2">
                      Có hỗ trợ sau khi mua không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Có, chúng tôi hỗ trợ 30 ngày miễn phí sau khi bàn giao website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;