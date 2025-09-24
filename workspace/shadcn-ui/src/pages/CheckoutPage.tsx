import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/currency';
import { generateOrderQR, MB_BANK_CONFIG } from '@/lib/vietqr';
import { toast } from 'sonner';
import { ShoppingCart, CreditCard, QrCode, Copy, ArrowLeft, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCart(state => state.items);
  const clearCart = useCart(state => state.clearCart);
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    source: ''
  });
  const [selectedAddons, setSelectedAddons] = useState<{[key: string]: string}>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [orderCode, setOrderCode] = useState<string>('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');

  const sourceOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'google', label: 'Google Search' },
    { value: 'zalo', label: 'Zalo' },
    { value: 'friend', label: 'Bạn bè giới thiệu' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Khác' }
  ];

  const freeGifts = [
    { id: 'ebook', name: 'Ebook Hướng dẫn', description: 'Hướng dẫn chi tiết sử dụng website' },
    { id: 'template', name: 'Template Báo cáo', description: 'Mẫu báo cáo chuyên nghiệp' }
  ];

  // Mock discount codes - in real app, this would come from API
  const validDiscountCodes = [
    { code: 'TET2024', type: 'percentage' as const, value: 20, minOrder: 200000 },
    { code: 'TET2025', type: 'percentage' as const, value: 25, minOrder: 150000 },
    { code: 'WELCOME10', type: 'percentage' as const, value: 10, minOrder: 100000 },
    { code: 'NEWUSER', type: 'fixed' as const, value: 50000, minOrder: 150000 }
  ];

  const subtotal = getTotalPrice();
  const discountAmount = appliedDiscount 
    ? appliedDiscount.type === 'percentage' 
      ? subtotal * (appliedDiscount.value / 100)
      : appliedDiscount.value
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const discount = validDiscountCodes.find(d => d.code === code);
    
    if (!discount) {
      setDiscountError('Mã giảm giá không hợp lệ.');
      return;
    }
    
    if (subtotal < discount.minOrder) {
      setDiscountError(`Đơn hàng tối thiểu ${formatPrice(discount.minOrder)} để sử dụng mã này.`);
      return;
    }
    
    setAppliedDiscount(discount);
    setDiscountError('');
    setDiscountCode('');
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError('');
  };

  // Generate order code and QR when moving to payment step
  useEffect(() => {
    if (currentStep === 2 && items.length > 0) {
      const newOrderCode = `WS${Date.now().toString().slice(-6)}`;
      setOrderCode(newOrderCode);
      
      const qrUrl = generateOrderQR(
        finalTotal,
        newOrderCode,
        `${items.length} sản phẩm`
      );
      setQrCodeUrl(qrUrl);
    }
  }, [currentStep, items, finalTotal]);

  const handleAddonSelect = (productId: string, addonId: string) => {
    setSelectedAddons(prev => ({
      ...prev,
      [productId]: addonId
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate customer info
      if (!formData.fullName || !formData.email || !formData.phone || !formData.source) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    try {
      // First, create or update customer
      const { data: existingCustomer, error: customerCheckError } = await supabase
        .from('app_2e6163d1d7_customers')
        .select('*')
        .eq('email', formData.email)
        .single();

      let customerId;
      
      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('app_2e6163d1d7_customers')
          .update({
            full_name: formData.fullName,
            phone: formData.phone,
            total_orders: (existingCustomer.total_orders || 0) + 1,
            total_spent: (existingCustomer.total_spent || 0) + finalTotal,
            last_order_date: new Date().toISOString(),
            status: 'active'
          })
          .eq('id', existingCustomer.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from('app_2e6163d1d7_customers')
          .insert({
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone,
            total_orders: 1,
            total_spent: finalTotal,
            last_order_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            status: 'active'
          })
          .select()
          .single();
          
        if (createError) throw createError;
        customerId = newCustomer.id;
      }

      // Create order - match the actual database schema
      const orderData = {
        customer_id: customerId,
        order_number: orderCode,
        total_amount: finalTotal,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customer_info: {
          source: formData.source,
          discount_code: appliedDiscount?.code,
          discount_amount: discountAmount,
          qr_code_url: qrCodeUrl
        }
      };

      const { data: newOrder, error: orderError } = await supabase
        .from('app_2e6163d1d7_orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      console.log('Order successfully saved:', newOrder);
      toast.success('Đơn hàng được tạo thành công! Vui lòng thanh toán theo QR code.');
      
      // Save order details to localStorage for thank you page
      const orderDetails = {
        orderCode,
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        items: items,
        total: finalTotal,
        status: 'Awaiting Payment'
      };
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      console.log('Saved order details to localStorage:', orderDetails);
      
      // Clear cart and redirect to thank you page
      setTimeout(() => {
        clearCart();
        navigate('/thank-you', { state: { orderCode, orderData: { ...orderData, id: newOrder.id, formData } } });
      }, 1500);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép!');
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-text-charcoal mb-4">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="worksheet-cta-button"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-text-charcoal">
            Thanh toán
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentStep >= 1 ? 'bg-primary-accent-green text-white' : 'bg-gray-100'}`}>
              <ShoppingCart className="h-5 w-5" />
              <span>Xác nhận đơn hàng</span>
            </div>
            <div className="w-12 h-1 bg-gray-200"></div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentStep >= 2 ? 'bg-primary-accent-green text-white' : 'bg-gray-100'}`}>
              <CreditCard className="h-5 w-5" />
              <span>Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Sản phẩm trong giỏ hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">Số lượng: {item.quantity}</p>
                            <p className="text-lg font-semibold text-primary-accent-green">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>


                    </div>
                  ))}
                  
                  <Separator />
                  
                  {/* Discount Code Section */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex space-x-2 mb-4">
                      <Input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim()}
                      >
                        Áp dụng
                      </Button>
                    </div>
                    {discountError && (
                      <p className="text-red-500 text-sm mb-2">{discountError}</p>
                    )}
                    {appliedDiscount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">
                            Mã giảm giá "{appliedDiscount.code}" đã được áp dụng
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleRemoveDiscount}
                            className="text-green-700 hover:text-green-900"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({appliedDiscount.code}):</span>
                        <span>-{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : formatPrice(appliedDiscount.value)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary-accent-green">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nhập họ và tên đầy đủ"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Gmail kích hoạt *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập email để kích hoạt website"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại Zalo *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số Zalo để hỗ trợ"
                      required
                    />
                  </div>

                  <div>
                    <Label>Bạn biết đến chúng tôi từ đâu? *</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nguồn..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    className="w-full worksheet-cta-button"
                  >
                    Tiếp tục thanh toán
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QR Code Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Thanh toán VietQR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img 
                      src={qrCodeUrl} 
                      alt="VietQR Code" 
                      className="w-64 h-64 mx-auto"
                      onError={(e) => {
                        console.error('QR Code failed to load:', qrCodeUrl);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Quét mã QR để thanh toán</p>
                    <p className="text-sm text-gray-600">
                      Sử dụng app ngân hàng hoặc ví điện tử để quét mã
                    </p>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                    <h4 className="font-medium mb-2">Thông tin chuyển khoản:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Ngân hàng:</span>
                        <span className="font-medium">MB Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Số tài khoản:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{MB_BANK_CONFIG.accountNumber}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(MB_BANK_CONFIG.accountNumber)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Chủ tài khoản:</span>
                        <span className="font-medium">{MB_BANK_CONFIG.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số tiền:</span>
                        <span className="font-bold text-primary-accent-green">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Nội dung:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs">{orderCode}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(orderCode)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Mã đơn hàng: {orderCode}</p>
                    <p className="text-sm text-gray-600">Vui lòng lưu mã này để tra cứu</p>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Thông tin khách hàng:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Họ tên:</strong> {formData.fullName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Zalo:</strong> {formData.phone}</p>
                      <p><strong>Nguồn:</strong> {sourceOptions.find(s => s.value === formData.source)?.label}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Sản phẩm đã chọn:</h4>
                    <div className="space-y-2 text-sm">
                      {items.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                          {selectedAddons[item.id] && selectedAddons[item.id] !== 'none' && (
                            <div className="text-primary-accent-green text-xs ml-4">
                              + {freeGifts.find(g => g.id === selectedAddons[item.id])?.name} (miễn phí)
                            </div>
                          )}
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng:</span>
                        <span className="text-primary-accent-green">
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Hướng dẫn thanh toán:</h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Quét mã QR bằng app ngân hàng</li>
                      <li>2. Kiểm tra thông tin chuyển khoản</li>
                      <li>3. Xác nhận thanh toán</li>
                      <li>4. Kiểm tra sản phẩm và hướng dẫn được gửi qua Email đã đăng ký</li>
                    </ol>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Quay lại
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 worksheet-cta-button"
                    >
                      Xác nhận đặt hàng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;