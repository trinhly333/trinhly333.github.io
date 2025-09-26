import { X, Plus, Minus, ShoppingBag, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, getFinalPrice } from '@/hooks/useCart';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/lib/currency';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const CartModal = () => {
  const items = useCart(state => state.items);
  const isOpen = useCart(state => state.isOpen);
  const toggleCart = useCart(state => state.toggleCart);
  const updateQuantity = useCart(state => state.updateQuantity);
  const removeItem = useCart(state => state.removeItem);
  const appliedDiscount = useCart(state => state.appliedDiscount);
  const applyDiscount = useCart(state => state.applyDiscount);
  const removeDiscount = useCart(state => state.removeDiscount);
  
  const { discountCodes } = useDiscountCodes();
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const closeCart = () => toggleCart();

  // Auto-apply best discount code based on cart total
  useEffect(() => {
    const subtotal = getTotalPrice();
    
    if (subtotal === 0) {
      removeDiscount();
      return;
    }

    // Find applicable discount codes
    const applicableCodes = discountCodes.filter(code => 
      code.status === 'active' && subtotal >= code.min_order_amount
    );

    if (applicableCodes.length === 0) {
      removeDiscount();
      return;
    }

    // Calculate discount amount for each applicable code
    const codesWithDiscount = applicableCodes.map(code => {
      let discountAmount = 0;
      if (code.discount_type === 'fixed') {
        discountAmount = code.discount_value;
      } else {
        discountAmount = (subtotal * code.discount_value) / 100;
      }
      return { ...code, calculatedDiscount: discountAmount };
    });

    // Find the best discount (highest discount amount)
    const bestDiscount = codesWithDiscount.reduce((best, current) => 
      current.calculatedDiscount > best.calculatedDiscount ? current : best
    );

    // Apply the best discount if it's different from current
    if (!appliedDiscount || appliedDiscount.code !== bestDiscount.code) {
      applyDiscount(bestDiscount, bestDiscount.calculatedDiscount);
    }
  }, [items, discountCodes, appliedDiscount, applyDiscount, removeDiscount]);

  // Find next better discount code
  const getNextBetterDiscount = () => {
    const subtotal = getTotalPrice();
    
    const betterCodes = discountCodes.filter(code => {
      if (code.status !== 'active' || subtotal >= code.min_order_amount) return false;
      
      let potentialDiscount = 0;
      if (code.discount_type === 'fixed') {
        potentialDiscount = code.discount_value;
      } else {
        potentialDiscount = (code.min_order_amount * code.discount_value) / 100;
      }
      
      return !appliedDiscount || potentialDiscount > appliedDiscount.discountAmount;
    });

    if (betterCodes.length === 0) return null;

    // Return the next achievable better discount
    return betterCodes.reduce((closest, current) => 
      current.min_order_amount < closest.min_order_amount ? current : closest
    );
  };

  const nextBetterDiscount = getNextBetterDiscount();

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const finalTotal = getFinalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-container-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-text-charcoal">
              Giỏ hàng ({getTotalItems()})
            </h2>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-400 mb-6">
                  Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
                </p>
                <Link to="/products">
                  <Button className="worksheet-cta-button" onClick={closeCart}>
                    Xem sản phẩm
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Auto-applied discount notification */}
                {appliedDiscount && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">
                        Áp dụng voucher: {appliedDiscount.code}
                      </span>
                    </div>
                    <p className="text-green-600 font-medium">
                      Bạn được giảm {formatPrice(appliedDiscount.discountAmount)}!
                    </p>
                  </div>
                )}

                {/* Next better discount suggestion */}
                {nextBetterDiscount && (
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-700">
                        Voucher cao hơn: {nextBetterDiscount.code}
                      </span>
                    </div>
                    <p className="text-orange-600 font-medium">
                      Thêm {formatPrice(nextBetterDiscount.min_order_amount - subtotal)} nữa để được giảm thêm!
                    </p>
                  </div>
                )}

                {/* Cart items */}
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-text-charcoal mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-text-charcoal">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 text-xs p-0 h-auto"
                              onClick={() => removeItem(item.id)}
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                
                {appliedDiscount && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Giảm giá ({appliedDiscount.code}):</span>
                    <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-lg font-semibold text-text-charcoal">Tổng cộng:</span>
                  <span className="text-xl font-bold text-primary-accent-green">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full worksheet-cta-button" onClick={closeCart}>
                  Thanh toán
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;