import { useState } from 'react';
import { Search, ArrowRight, Star, CheckCircle, ShoppingCart, Briefcase, Palette, Rocket, Database, ShieldCheck, PiggyBank, ChevronRight, HelpCircle, ChevronDown, Package, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(34,197,94,0.1)_1px,transparent_0)] [background-size:20px_20px] opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Giải pháp <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Worksheet</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Từ Google Sheet đến Webapp chuyên nghiệp trong 5 phút
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm mẫu webapp cho ngành nghề của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-green-500 transition-all duration-300 shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full px-6 py-2 transition-all duration-300 hover:scale-105"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              asChild
            >
              <Link to="/products">
                Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/products">
                Xem Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Danh mục sản phẩm Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-6">
              Danh mục sản phẩm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các sản phẩm chất lượng cao trong từng danh mục
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <Package className="w-12 h-12 text-blue-600 group-hover:text-green-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Sản phẩm Hot</h3>
              <p className="text-gray-600 mb-4">Những sản phẩm bán chạy nhất hiện tại</p>
              <p className="text-sm text-gray-500 mb-4">Đang cập nhật</p>
              <Link to="/products" className="w-full text-blue-600 font-medium flex items-center justify-center space-x-1 hover:text-green-700 transition-all duration-300 group-hover:translate-x-1">
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-blue-600 group-hover:text-green-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Sản phẩm Mới</h3>
              <p className="text-gray-600 mb-4">Những sản phẩm mới nhất vừa được thêm vào</p>
              <p className="text-sm text-gray-500 mb-4">Đang cập nhật</p>
              <Link to="/products" className="w-full text-blue-600 font-medium flex items-center justify-center space-x-1 hover:text-green-700 transition-all duration-300 group-hover:translate-x-1">
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-blue-600 group-hover:text-green-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Sản phẩm Khuyến mãi</h3>
              <p className="text-gray-600 mb-4">Sản phẩm đang có ưu đãi đặc biệt</p>
              <p className="text-sm text-gray-500 mb-4">Đang cập nhật</p>
              <Link to="/products" className="w-full text-blue-600 font-medium flex items-center justify-center space-x-1 hover:text-green-700 transition-all duration-300 group-hover:translate-x-1">
                <span>Xem chi tiết</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Giải pháp Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Không chỉ là một công cụ, đó là một giải pháp xây dựng từ thực tế
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <Rocket className="w-12 h-12 text-orange-500 group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Cài đặt "Mì ăn liền"</h3>
              <p className="text-gray-600">Chỉ với 1 video 5 phút và vài thao tác copy-paste, bạn đã có ngay một trang quản lý chuyên nghiệp của riêng mình.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <Database className="w-12 h-12 text-blue-500 group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Quản lý Tập trung</h3>
              <p className="text-gray-600">Dễ dàng chuyển toàn bộ dữ liệu từ file Excel cũ sang Google Sheet. Mọi thông tin sẽ ngay lập tức hiển thị trên giao diện web.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="w-12 h-12 text-red-500 group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Toàn quyền Kiểm soát Dữ liệu</h3>
              <p className="text-gray-600">Bạn toàn quyền kiểm soát và chỉnh sửa dữ liệu gốc trên file Sheet quen thuộc. Không cần biết code, không sợ "hỏng đen".</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <div className="flex justify-center mb-4">
                <PiggyBank className="w-12 h-12 text-purple-500 group-hover:text-green-500 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-green-600 transition-colors duration-300">Chi phí một lần, Sở hữu trọn đời</h3>
              <p className="text-gray-600">Một khoản đầu tư nhỏ, không rủi ro, không có chi phí ẩn hay đánh nặng trả phí hàng tháng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Câu hỏi thường gặp
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-left group">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Tôi không rành kỹ thuật, cài đặt có thực sự dễ trong 5 phút không?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all duration-300 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 bg-white rounded-b-lg">
                <p className="text-gray-600 leading-relaxed">
                  Chắc chắn! Quy trình chỉ gồm 3 bước: 1. Bạn nhận một bản sao của file Google Sheet mẫu. 2. Xem một video hướng dẫn 5 phút. 3. Điền thông tin cơ bản của doanh nghiệp bạn vào file Sheet đó. Thế là xong! Bạn đã có ngay một web quản lý của riêng mình.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-left group">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Làm sao tôi có thể tùy chỉnh hay sửa dữ liệu khi cần?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all duration-300 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 bg-white rounded-b-lg">
                <p className="text-gray-600 leading-relaxed">
                  Cực kỳ đơn giản. Bạn chỉ cần mở file Google Sheet mà chúng tôi đã cung cấp. Mọi thông tin nhân viên, ca làm việc, dữ liệu chấm công... đều nằm trong đó. Bạn có thể xem, lọc, sửa, xóa như một file Excel thông thường. Giao diện web sẽ tự động cập nhật theo.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-left group">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Tại sao giá lại rẻ và chỉ trả một lần như vậy?
                </h3>
                <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-all duration-300 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 bg-white rounded-b-lg">
                <p className="text-gray-600 leading-relaxed">
                  Vì sứ mệnh của Worksheet là hỗ trợ các doanh nghiệp nhỏ, những người có ngân sách hạn hẹp như chúng tôi đã từng. Chúng tôi xây dựng sản phẩm theo mô hình "tự phục vụ" với các video hướng dẫn chi tiết, giúp bạn làm chủ công cụ mà không cần đội ngũ hỗ trợ tốn kém. Đó là lý do chúng tôi có thể mang đến một mức giá tốt như vậy.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn doanh nghiệp đã tin tương và sử dụng Worksheet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-gray-600 italic">
                  "Điều tôi tâm đắc nhất ở Worksheet là nó trả lại cho tôi thời gian. Thay vì mất cả ngày cuối tháng để đối chiếu sổ sách, giờ tôi chỉ cần 5 phút để kiểm tra file Google Sheet đã được tự động tổng hợp. Thực sự rất đáng đầu tư."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face" 
                    alt="Chị Minh Anh" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Chị Minh Anh</p>
                    <p className="text-sm text-gray-500">Quản lý Vận hành, Trung tâm Anh ngữ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-gray-600 italic">
                  "Tôi từng rất ngại triển khai công nghệ mới vì sợ phức tạp. Nhưng với Worksheet, tôi chỉ mất đúng một buổi sáng để cài đặt và chuyển toàn bộ dữ liệu kinh doanh sang. Giờ mọi thứ nằm gọn trên Google Sheet, trực quan và hoàn toàn trong tầm kiểm soát của tôi."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="Anh Hoàng Nam" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Anh Hoàng Nam</p>
                    <p className="text-sm text-gray-500">Chủ An Nhiên Spa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:border-green-200 group">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-gray-600 italic">
                  "Là một startup, chúng tôi cần những công cụ linh hoạt và thông minh, không phải những hệ thống cồng kềnh, đắt đỏ. Worksheet đáp ứng chính xác điều đó: giải quyết đúng vấn đề cốt lõi với chi phí một lần. Đây là một khoản đầu tư cho hiệu suất, không phải gánh nặng chi phí."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                    alt="Chị Ngọc Lan" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Chị Ngọc Lan</p>
                    <p className="text-sm text-gray-500">Trưởng phòng Kinh doanh, BĐS Inta Land</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Chỉ mất 5 phút để có một webapp chuyên nghiệp hoàn chỉnh
          </p>
          <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Tạo webapp ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;