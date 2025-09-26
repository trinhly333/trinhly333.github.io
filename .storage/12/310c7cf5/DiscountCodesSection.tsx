import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent } from 'lucide-react';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/lib/currency';

const DiscountCodesSection = () => {
  const { discountCodes, loading } = useDiscountCodes();

  if (loading) {
    return (
      <section className="mb-16">
        <div className="flex items-center space-x-3 mb-8">
          <Gift className="h-8 w-8 text-green-500" />
          <h2 className="text-3xl font-bold text-text-charcoal">
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
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-8">
        <Gift className="h-8 w-8 text-green-500" />
        <h2 className="text-3xl font-bold text-text-charcoal">
          Ưu đãi đặc biệt
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {discountCodes.map((code) => (
          <div
            key={code.id}
            className="relative bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Discount Icon */}
            <div className="absolute top-4 left-4">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
            
            {/* Discount Code Badge */}
            <div className="text-center mb-4">
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-4 py-2">
                {code.code}
              </Badge>
            </div>
            
            {/* Discount Value */}
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-green-700">
                {code.discount_type === 'fixed' 
                  ? `Giảm ${formatPrice(code.discount_value)}`
                  : `Giảm ${code.discount_value}%`
                }
              </div>
            </div>
            
            {/* Minimum Order */}
            <div className="text-center text-sm text-gray-600">
              Cho đơn từ {formatPrice(code.min_order_amount)}
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiscountCodesSection;