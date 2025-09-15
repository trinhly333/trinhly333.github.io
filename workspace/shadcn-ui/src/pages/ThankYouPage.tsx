import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, MessageCircle, Home, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { mockProducts } from '@/data/mockData';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  useEffect(() => {
    // Try to get order details from localStorage first
    const savedOrderDetails = localStorage.getItem('lastOrderDetails');
    if (savedOrderDetails) {
      const parsed = JSON.parse(savedOrderDetails);
      setOrderDetails(parsed);
      console.log('Loaded order details from localStorage:', parsed);
    } else if (location.state?.orderData) {
      setOrderDetails(location.state.orderData);
      console.log('Loaded order details from location state:', location.state.orderData);
    } else {
      // Default fallback
      const defaultData = {
        orderCode: 'WS' + Date.now().toString().slice(-6),
        customerName: 'Khách hàng',
        email: 'customer@example.com',
        phone: '0123456789',
        items: [],
        total: 0,
        status: 'Awaiting Payment'
      };
      setOrderDetails(defaultData);
      console.log('Using default order details:', defaultData);
    }
  }, [location.state]);



  return (
    <div className="min-h-screen bg-background-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-primary-accent-green" />
            </div>
            <h1 className="text-4xl font-bold text-text-charcoal mb-4">
              Cảm ơn bạn đã mua hàng!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Đơn hàng của bạn đã được tạo thành công. Chúng tôi sẽ liên hệ trong vòng 24 giờ.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Mã đơn hàng: {orderDetails?.orderCode || 'WS' + Date.now().toString().slice(-6)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Tóm tắt đơn hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Information */}
                <div>
                  <h4 className="font-medium mb-2">Thông tin khách hàng:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Họ tên:</strong> {orderDetails?.customerName || orderDetails?.formData?.fullName || 'Khách hàng'}</p>
                    <p><strong>Email:</strong> {orderDetails?.email || orderDetails?.formData?.email || 'customer@example.com'}</p>
                    <p><strong>Zalo:</strong> {orderDetails?.phone || orderDetails?.formData?.phone || '0123456789'}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Sản phẩm đã mua:</h4>
                  {orderDetails?.items && orderDetails.items.length > 0 ? (
                    <div className="space-y-2">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product?.name || item.name} x{item.quantity}</span>
                          <span className="font-medium">
                            {formatPrice((item.product?.price || item.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Không có thông tin sản phẩm</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-accent-green">
                    {formatPrice(orderDetails?.total || 0)}
                  </span>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-green-800">
                    <strong>Trạng thái:</strong> {orderDetails?.status || 'Awaiting Payment'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn trong vòng 24 giờ.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Bước tiếp theo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary-accent-green mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Xác nhận thanh toán</p>
                      <p className="text-xs text-gray-600">
                        Chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Download className="h-5 w-5 text-secondary-accent-blue mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Nhận sản phẩm qua Email</p>
                      <p className="text-xs text-gray-600">
                        Sản phẩm và hướng dẫn sẽ được gửi qua email trong vòng 5-10 phút
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary-accent-orange mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Hỗ trợ 24/7</p>
                      <p className="text-xs text-gray-600">
                        Hotline: 0982 766 913
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Về trang chủ
                  </Button>
                  <Button
                    onClick={() => navigate('/products')}
                    className="flex-1 worksheet-cta-button"
                  >
                    Mua thêm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Recommendations - Based on purchased products */}
          <div className="mt-12 space-y-8">
            {/* Related Products - From purchased products' related_products */}
            {(() => {
              // Get all related products from purchased items
              const allRelatedProducts = [];
              if (orderDetails?.items) {
                orderDetails.items.forEach((item) => {
                  const productName = item.product?.name || item.name || '';
                  const purchasedProduct = mockProducts.find(p => p.name === productName);
                  if (purchasedProduct?.related_products) {
                    purchasedProduct.related_products.forEach((relatedId) => {
                      const relatedProduct = mockProducts.find(p => p.id === relatedId);
                      if (relatedProduct && !allRelatedProducts.find(p => p.id === relatedProduct.id)) {
                        allRelatedProducts.push(relatedProduct);
                      }
                    });
                  }
                });
              }

              if (allRelatedProducts.length === 0) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm tương tự</CardTitle>
                    <p className="text-sm text-gray-600">
                      Gợi ý từ sản phẩm bạn đã mua
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {allRelatedProducts.slice(0, 3).map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            <img 
                              src={product.thumbnail_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-medium mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{product.description.substring(0, 80)}...</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary-accent-green">
                                {formatPrice(product.price)}
                              </span>
                              {product.original_price && (
                                <span className="text-gray-500 line-through text-sm">
                                  {formatPrice(product.original_price)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/san-pham/${product.slug}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Bundled Products - From purchased products' bundled_products */}
            {(() => {
              // Get all bundled products from purchased items
              const allBundledProducts = [];
              if (orderDetails?.items) {
                orderDetails.items.forEach((item) => {
                  const productName = item.product?.name || item.name || '';
                  const purchasedProduct = mockProducts.find(p => p.name === productName);
                  if (purchasedProduct?.bundled_products) {
                    purchasedProduct.bundled_products.forEach((bundledId) => {
                      const bundledProduct = mockProducts.find(p => p.id === bundledId);
                      if (bundledProduct && !allBundledProducts.find(p => p.id === bundledProduct.id)) {
                        allBundledProducts.push(bundledProduct);
                      }
                    });
                  }
                });
              }

              if (allBundledProducts.length === 0) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm đi kèm</CardTitle>
                    <p className="text-sm text-gray-600">
                      Sản phẩm bổ sung được khuyến nghị
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allBundledProducts.slice(0, 2).map((product) => (
                        <div key={`bundle-${product.id}`} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={product.thumbnail_url} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{product.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{product.description.substring(0, 50)}...</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary-accent-green text-sm">
                                  {formatPrice(product.price)}
                                </span>
                                {product.original_price && (
                                  <span className="text-gray-500 line-through text-xs">
                                    {formatPrice(product.original_price)}
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/san-pham/${product.slug}`)}
                                className="text-xs px-3 py-1"
                              >
                                Thêm vào giỏ
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Combo Deal Banner */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-primary-accent-green/10 to-primary-accent-green/20 rounded-lg border border-primary-accent-green/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-primary-accent-green">🎉 Combo Deal</h4>
                          <p className="text-sm text-gray-600">Mua combo này để được giảm 10%</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-primary-accent-green text-primary-accent-green hover:bg-primary-accent-green hover:text-white"
                          onClick={() => navigate('/products')}
                        >
                          Xem tất cả
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;