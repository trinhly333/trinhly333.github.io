import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent } from 'lucide-react';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/lib/currency';

const DiscountCodesSection = () => {
  const { discountCodes, loading } = useDiscountCodes();

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Gift className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-bold text-text-charcoal">
            Ưu đãi đặc biệt
          </h2>
        </div>
        <div className="text-center text-gray-500 text-sm">Đang tải mã giảm giá...</div>
      </section>
    );
  }

  if (discountCodes.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Gift className="h-5 w-5 text-green-500" />
        <h2 className="text-xl font-bold text-text-charcoal">
          Ưu đãi đặc biệt
        </h2>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {discountCodes.map((code) => (
          <div
            key={code.id}
            className="relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-md p-2 hover:shadow-sm transition-all duration-300 group"
          >
            {/* Discount Icon */}
            <div className="absolute top-1 left-1">
              <Percent className="h-3 w-3 text-green-600" />
            </div>
            
            {/* Discount Code Badge */}
            <div className="text-center mb-1">
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-2 py-0.5">
                {code.code}
              </Badge>
            </div>
            
            {/* Discount Value */}
            <div className="text-center mb-1">
              <div className="text-sm font-bold text-green-700">
                {code.discount_type === 'fixed' 
                  ? `Giảm ${formatPrice(code.discount_value)}`
                  : `Giảm ${code.discount_value}%`
                }
              </div>
            </div>
            
            {/* Minimum Order */}
            <div className="text-center text-xs text-gray-600">
              Cho đơn từ {formatPrice(code.min_order_amount)}
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-md transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountCodesSection;