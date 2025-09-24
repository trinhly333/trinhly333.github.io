import { Heart, Target, Award, Users, Lightbulb, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(34,197,94,0.1)_1px,transparent_0)] [background-size:20px_20px] opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Về <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Worksheet</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Câu chuyện về hành trình biến giấc mơ thành hiện thực
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
            <p className="text-xl text-center mb-12 text-gray-600 font-medium">
              Worksheet sinh ra từ những khó khăn thực tế mà chúng tôi đã trải qua khi điều hành doanh nghiệp nhỏ.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Khởi đầu từ nhu cầu thực tế</h3>
                <p>
                  Năm 2019, khi điều hành cửa hàng nhỏ đầu tiên, chúng tôi đã gặp phải những khó khăn mà nhiều doanh nghiệp nhỏ đều trải qua: quản lý nhân viên bằng sổ tay, tính lương thủ công, theo dõi doanh thu qua Excel rối rắm.
                </p>
                <p>
                  Các giải pháp phần mềm trên thị trường đều quá đắt đỏ, phức tạp và không phù hợp với quy mô nhỏ. Chúng tôi cần một giải pháp đơn giản, hiệu quả và giá cả hợp lý.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ý tưởng đột phá</h3>
                <p>
                  Thay vì xây dựng một hệ thống phức tạp, chúng tôi nghĩ: "Tại sao không tận dụng Google Sheet - công cụ mà ai cũng biết dùng?" 
                </p>
                <p>
                  Từ đó, ý tưởng về Worksheet ra đời: Biến Google Sheet thành giao diện web chuyên nghiệp, giúp chủ doanh nghiệp vừa có công cụ quản lý hiện đại, vừa giữ được sự đơn giản quen thuộc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Giá trị cốt lõi của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi quyết định và hành động của Worksheet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Heart className="w-16 h-16 text-red-500 group-hover:text-green-500 transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  Sứ mệnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Mang đến giải pháp quản lý doanh nghiệp đơn giản, hiệu quả và giá cả phải chăng cho mọi doanh nghiệp nhỏ tại Việt Nam.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Target className="w-16 h-16 text-blue-500 group-hover:text-green-500 transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  Tầm nhìn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành nền tảng quản lý doanh nghiệp hàng đầu cho phân khúc SME, giúp hàng triệu doanh nghiệp nhỏ phát triển bền vững.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Award className="w-16 h-16 text-yellow-500 group-hover:text-green-500 transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  Giá trị cốt lõi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600">Đơn giản hóa phức tạp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">Đặt khách hàng làm trung tâm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Minh bạch & trung thực</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;