import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, X, Tag, Percent } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/currency';
import { useCampaigns } from '@/hooks/useCampaigns';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: any) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { validateDiscountCode } = useCampaigns();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const subtotal = getCartTotal();
  const discountAmount = appliedDiscount ? 
    (appliedDiscount.discount_type === 'fixed' ? 
      appliedDiscount.discount_value : 
      (subtotal * appliedDiscount.discount_value) / 100) : 0;
  const total = subtotal - discountAmount;

  // Auto-apply best discount code
  useEffect(() => {
    const autoApplyBestDiscount = async () => {
      if (subtotal === 0 || appliedDiscount) return;

      try {
        // Get all active campaigns
        const { data: campaigns, error } = await supabase
          .from('app_2e6163d1d7_campaigns')
          .select('*')
          .eq('status', 'active');

        if (error || !campaigns) return;

        // Filter valid campaigns for current order
        const now = new Date();
        const validCampaigns = campaigns.filter(campaign => {
          const startDate = new Date(campaign.start_date);
          const endDate = new Date(campaign.end_date);
          const isValidDate = now >= startDate && now <= endDate;
          const meetsMinOrder = subtotal >= parseFloat(campaign.min_order_amount);
          const hasUsesLeft = !campaign.max_uses || campaign.current_uses < campaign.max_uses;
          
          return isValidDate && meetsMinOrder && hasUsesLeft;
        });

        if (validCampaigns.length === 0) return;

        // Find best discount
        let bestDiscount = null;
        let maxSavings = 0;

        validCampaigns.forEach(campaign => {
          let savings = 0;
          if (campaign.discount_type === 'fixed') {
            savings = parseFloat(campaign.discount_value);
          } else {
            savings = (subtotal * parseFloat(campaign.discount_value)) / 100;
          }

          if (savings > maxSavings) {
            maxSavings = savings;
            bestDiscount = campaign;
          }
        });

        if (bestDiscount) {
          setAppliedDiscount(bestDiscount);
          setDiscountCode(bestDiscount.code);
        }
      } catch (error) {
        console.error('Error auto-applying discount:', error);
      }
    };

    autoApplyBestDiscount();
  }, [subtotal, appliedDiscount]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsValidatingCode(true);
    setDiscountError('');

    try {
      const result = await validateDiscountCode(discountCode.trim(), subtotal);
      setAppliedDiscount(result);
      setDiscountError('');
    } catch (error: any) {
      setDiscountError(error.message || 'Mã giảm giá không hợp lệ');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const handleCheckout = () => {
    const orderData = {
      items: cartItems,
      subtotal,
      discountCode: appliedDiscount?.code || null,
      discountAmount,
      total,
      appliedDiscount
    };
    onCheckout(orderData);
  };

  if (cartItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Giỏ hàng trống</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Chưa có sản phẩm nào trong giỏ hàng</p>
            <Button onClick={onClose}>Tiếp tục mua sắm</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Giỏ hàng ({cartItems.length})
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.selectedAddons?.map(a => a.id).join('-') || 'no-addons'}`} 
                 className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src={item.thumbnail_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                {item.selectedAddons && item.selectedAddons.length > 0 && (
                  <div className="mt-1">
                    {item.selectedAddons.map((addon) => (
                      <p key={addon.id} className="text-xs text-gray-500">
                        + {addon.name} ({formatPrice(addon.price)})
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.selectedAddons || [], Math.max(0, item.quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.selectedAddons || [], item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id, item.selectedAddons || [])}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}

          {/* Auto-applied Discount Display */}
          {appliedDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Mã giảm giá được áp dụng tự động
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveDiscount}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Badge className="bg-green-600 text-white">
                  {appliedDiscount.code}
                </Badge>
                <span className="text-sm text-green-700">
                  {appliedDiscount.discount_type === 'fixed' 
                    ? `Giảm ${formatPrice(appliedDiscount.discount_value)}`
                    : `Giảm ${appliedDiscount.discount_value}%`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Manual Discount Code Input */}
          {!appliedDiscount && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Mã giảm giá</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyDiscount}
                  disabled={isValidatingCode || !discountCode.trim()}
                  size="sm"
                >
                  {isValidatingCode ? 'Đang kiểm tra...' : 'Áp dụng'}
                </Button>
              </div>
              {discountError && (
                <p className="text-red-500 text-sm mt-1">{discountError}</p>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá ({appliedDiscount.code}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Tổng cộng:</span>
              <span className="text-green-600">{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            Thanh toán
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;