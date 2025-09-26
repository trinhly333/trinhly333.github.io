import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent } from 'lucide-react';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/lib/currency';

const DiscountCodesSection = () => {
  const { discountCodes, loading } = useDiscountCodes();

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Gift className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold text-text-charcoal">
            Ưu đãi đặc biệt
          </h2>
        </div>
        <div className="text-center text-gray-500">Đang tải mã giảm giá...</div>
      </section>
    );
  }

  if (discountCodes.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <Gift className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold text-text-charcoal">
          Ưu đãi đặc biệt
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {discountCodes.map((code) => (
          <div
            key={code.id}
            className="relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 group"
          >
            {/* Discount Icon */}
            <div className="absolute top-2 left-2">
              <Percent className="h-4 w-4 text-green-600" />
            </div>
            
            {/* Discount Code Badge */}
            <div className="text-center mb-2">
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-3 py-1">
                {code.code}
              </Badge>
            </div>
            
            {/* Discount Value */}
            <div className="text-center mb-2">
              <div className="text-lg font-bold text-green-700">
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
            <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-lg transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountCodesSection;