import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatPrice } from '@/lib/currency';

const PricingPage = () => {
  const pricingPlans = [
    {
      name: 'Bản Tiêu chuẩn',
      price: 199000,
      description: 'Dành cho cá nhân & team siêu nhỏ cần sự đơn giản.',
      features: [
        { name: 'Giao diện web cơ bản', included: true },
        { name: 'Kết nối Google Sheet', included: true },
        { name: 'Hỗ trợ email', included: true },
        { name: 'Template cơ bản', included: true },
        { name: 'Tùy chỉnh nâng cao', included: false },
        { name: 'Hỗ trợ ưu tiên', included: false },
        { name: 'Backup tự động', included: false }
      ],
      cta: 'CHỌN MUA NGAY',
      popular: false
    },
    {
      name: 'Bản Chuyên nghiệp',
      price: 399000,
      description: 'Giải pháp tối ưu cho đa số doanh nghiệp nhỏ và vừa.',
      features: [
        { name: 'Mọi tính năng gói Tiêu chuẩn', included: true },
        { name: 'Giao diện web nâng cao', included: true },
        { name: 'Tùy chỉnh màu sắc & logo', included: true },
        { name: 'Analytics cơ bản', included: true },
        { name: 'Hỗ trợ ưu tiên', included: true },
        { name: 'Backup tự động', included: true },
        { name: 'Training 1-1', included: true }
      ],
      cta: 'CHỌN MUA NGAY',
      popular: true
    },
    {
      name: 'Bản Doanh nghiệp',
      price: null,
      description: 'Dành cho doanh nghiệp có nhu cầu đặc thù, cần tích hợp và tùy chỉnh sâu.',
      features: [
        { name: 'Mọi tính năng gói Pro', included: true },
        { name: 'Xây dựng tính năng riêng', included: true },
        { name: 'Tích hợp hệ thống khác', included: true },
        { name: 'Hỗ trợ chuyên sâu', included: true },
        { name: 'SLA đảm bảo', included: true },
        { name: 'Đào tạo team', included: true },
        { name: 'Consultant chuyên biệt', included: true }
      ],
      cta: 'LIÊN HỆ TƯ VẤN',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Sản phẩm có chạy nhanh và mượt như các phần mềm chuyên nghiệp không?',
      answer: 'Worksheet được tối ưu cho các doanh nghiệp quy mô nhỏ và vừa. Nó xử lý rất tốt các tác vụ hàng ngày. Tuy nhiên, vì chạy trên nền tảng Google Apps Script, nó sẽ có những giới hạn nhất định so với các phần mềm đắt tiền. Bù lại, bạn có được sự đơn giản, quen thuộc và chi phí cực thấp mà không giải pháp nào khác có được.'
    },
    {
      question: 'Tôi có thể tự thêm tính năng mới cho web không?',
      answer: 'Việc tùy chỉnh DỮ LIỆU (thêm nhân viên, sửa giờ công) thì siêu dễ dàng ngay trên Google Sheet. Việc thêm TÍNH NĂNG MỚI (ví dụ: một nút bấm mới) sẽ cần can thiệp vào mã nguồn. Gói Doanh nghiệp của chúng tôi có hỗ trợ các yêu cầu này.'
    },
    {
      question: 'Chuyển dữ liệu từ file Excel cũ của tôi sang có dễ không?',
      answer: 'Cực kỳ dễ. Đây là một trong những điểm mạnh nhất của Worksheet. Bạn chỉ cần copy dữ liệu từ file cũ và paste vào các cột tương ứng trong file Google Sheet của chúng tôi. Mọi thông tin sẽ ngay lập tức được hiển thị trên giao diện web.'
    },
    {
      question: 'Việc cài đặt và sử dụng có thực sự dễ không?',
      answer: 'Chắc chắn! Quy trình chỉ gồm vài bước đơn giản sau khi xem video hướng dẫn 5 phút. Chúng tôi thiết kế để một người không chuyên về công nghệ cũng có thể tự tin làm được.'
    }
  ];

  return (
    <div className="min-h-screen bg-background-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="worksheet-h1 mb-6">Sản phẩm & Bảng giá</h1>
          <p className="worksheet-body text-xl text-gray-600 max-w-3xl mx-auto">
            Chọn gói phù hợp với nhu cầu doanh nghiệp của bạn
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-container-white ${
                  plan.popular 
                    ? 'border-2 border-primary-accent-green shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-accent-green text-white">
                    Phổ biến nhất
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-bold text-primary-accent-green">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-gray-600 ml-2">/ trọn đời</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        Liên hệ để nhận báo giá
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary-accent-green flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'worksheet-cta-button' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="worksheet-h2 text-center mb-12">Câu hỏi thường gặp</h2>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-accent-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Bắt đầu hành trình tự động hóa ngay hôm nay
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tự động hóa trong tầm tay - Làm điều Đơn giản một cách Xuất sắc
          </p>
          <Button className="bg-cta-orange hover:bg-cta-orange/90 text-white text-lg px-8 py-4">
            Liên hệ tư vấn miễn phí
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;