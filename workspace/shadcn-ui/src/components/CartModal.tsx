import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/currency';
import { Link } from 'react-router-dom';

const CartModal = () => {
  const items = useCart(state => state.items);
  const isOpen = useCart(state => state.isOpen);
  const toggleCart = useCart(state => state.toggleCart);
  const updateQuantity = useCart(state => state.updateQuantity);
  const removeItem = useCart(state => state.removeItem);
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const closeCart = () => toggleCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 500000; // 500k VND for free shipping
  const currentTotal = getTotalPrice();
  const remainingForFreeShipping = freeShippingThreshold - currentTotal;

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
                {/* Free shipping notice */}
                {remainingForFreeShipping > 0 && (
                  <div className="bg-secondary-accent-blue bg-opacity-10 border border-secondary-accent-blue border-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-secondary-accent-blue">
                      <strong>Bạn chỉ cần thêm {formatPrice(remainingForFreeShipping)} nữa để được miễn phí vận chuyển!</strong>
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
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-text-charcoal">Tổng cộng:</span>
                <span className="text-xl font-bold text-primary-accent-green">
                  {formatPrice(currentTotal)}
                </span>
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