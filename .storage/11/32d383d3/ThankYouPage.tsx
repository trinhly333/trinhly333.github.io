import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

const ThankYouPage = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from location state or localStorage
    const details = location.state?.orderDetails || JSON.parse(localStorage.getItem('lastOrder') || 'null');
    if (details) {
      setOrderDetails(details);
    }
  }, [location.state]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đơn hàng</h1>
          <Link to="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cảm ơn bạn đã đặt hàng!</h1>
          <p className="text-gray-600">Đơn hàng của bạn đã được tiếp nhận và đang được xử lý</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Thông tin đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Mã đơn hàng:</span>
                <span className="text-primary-accent-green font-mono">{orderDetails.orderId}</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Sản phẩm đã đặt:</h4>
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-lg font-bold text-primary-accent-green">
                  {orderDetails.total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                <p className="font-medium">{orderDetails.customerName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="font-medium">{orderDetails.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                <p className="font-medium">{orderDetails.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Các bước tiếp theo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Xác nhận đơn hàng</h4>
                <p className="text-sm text-gray-600">Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 24h</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-yellow-600 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Chuẩn bị sản phẩm</h4>
                <p className="text-sm text-gray-600">Đội ngũ kỹ thuật sẽ bắt đầu thiết kế website theo yêu cầu</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Bàn giao sản phẩm</h4>
                <p className="text-sm text-gray-600">Website hoàn thiện sẽ được bàn giao trong 3-7 ngày làm việc</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Tiếp tục mua sắm
            </Button>
          </Link>
          
          <Link to="/products">
            <Button size="lg" className="w-full sm:w-auto">
              Xem thêm sản phẩm
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Cần hỗ trợ?</h3>
          <p className="text-gray-600 mb-4">
            Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+84123456789" className="text-primary-accent-green font-medium">
              📞 0123 456 789
            </a>
            <a href="mailto:support@worksheet.vn" className="text-primary-accent-green font-medium">
              ✉️ support@worksheet.vn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;