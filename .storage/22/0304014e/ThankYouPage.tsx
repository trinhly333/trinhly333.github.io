import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';

interface OrderDetails {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const clearCart = useCart(state => state.clearCart);
  
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart when reaching thank you page
    clearCart();
    
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      if (orderId) {
        // In a real app, you would fetch from your API
        // For now, we'll simulate with mock data
        setTimeout(() => {
          setOrderDetails({
            id: orderId,
            total_amount: 995000,
            status: 'confirmed',
            created_at: new Date().toISOString(),
            customer_name: 'Khách hàng',
            customer_email: 'customer@example.com',
            customer_phone: '0123456789',
            items: [
              {
                name: 'Webapp Nhà Hàng Premium',
                price: 199000,
                quantity: 5
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent-green mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-text-charcoal mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cảm ơn bạn đã tin tưởng và đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Order Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-text-charcoal mb-4">
                  Thông tin đơn hàng
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">#{orderDetails.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium">
                      {new Date(orderDetails.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Đã xác nhận
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-lg font-semibold text-text-charcoal">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary-accent-green">
                      {formatPrice(orderDetails.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-text-charcoal mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Họ tên:</span>
                    <p className="font-medium">{orderDetails.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{orderDetails.customer_email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <p className="font-medium">{orderDetails.customer_phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-text-charcoal mb-6">
              Các bước tiếp theo
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-text-charcoal mb-2">1. Xử lý đơn hàng</h3>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ xử lý và chuẩn bị đơn hàng của bạn trong vòng 24 giờ
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-text-charcoal mb-2">2. Triển khai</h3>
                <p className="text-sm text-gray-600">
                  Webapp sẽ được triển khai và cấu hình theo yêu cầu của bạn
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-text-charcoal mb-2">3. Bàn giao</h3>
                <p className="text-sm text-gray-600">
                  Bạn sẽ nhận được thông tin truy cập và hướng dẫn sử dụng
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gradient-to-r from-primary-accent-green/5 to-secondary-accent-blue/5 mb-12">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-semibold text-text-charcoal mb-4">
              Cần hỗ trợ?
            </h2>
            <p className="text-gray-600 mb-6">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="worksheet-cta-button">
                  Liên hệ hỗ trợ
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">
                  Tiếp tục mua sắm
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Email Confirmation */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            📧 Email xác nhận đã được gửi đến địa chỉ email của bạn
          </p>
          <p className="text-sm">
            Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để xem chi tiết đơn hàng
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;