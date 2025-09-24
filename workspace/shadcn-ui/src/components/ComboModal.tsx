import { useState } from 'react';
import { X, ShoppingCart, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';
import { bestSellingCombo } from '@/data/mockData';
import { toast } from 'sonner';

interface ComboModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComboModal = ({ isOpen, onClose }: ComboModalProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Create a combo product object
    const comboProduct = {
      id: 'combo-khoi-nghiep',
      name: bestSellingCombo.name,
      price: bestSellingCombo.comboPrice,
      original_price: bestSellingCombo.originalPrice,
      thumbnail_url: bestSellingCombo.thumbnail_url,
      description: bestSellingCombo.description,
      slug: 'combo-khoi-nghiep-hoan-hao',
      category: 'combo',
      tags: ['combo', 'startup'],
      addons: []
    };

    addItem(comboProduct, 1, [], true);
    toast.success('Đã thêm combo vào giỏ hàng!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-charcoal mb-4">
            {bestSellingCombo.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <img
              src={bestSellingCombo.thumbnail_url}
              alt={bestSellingCombo.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex items-center space-x-2 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-cta-orange text-cta-orange" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(147 đánh giá)</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <Badge className="bg-cta-orange text-white mb-4">
              Tiết kiệm {formatPrice(bestSellingCombo.savings)}
            </Badge>
            
            <p className="worksheet-body mb-6 text-gray-600">
              {bestSellingCombo.description}
            </p>

            <div className="mb-6">
              <h4 className="font-semibold text-text-charcoal mb-3">Bao gồm:</h4>
              <div className="space-y-3">
                {bestSellingCombo.includes.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-accent-green mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-text-charcoal">{item.name}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <span className="text-sm font-medium text-primary-accent-green">
                        Giá lẻ: {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-primary-accent-green">
                      {formatPrice(bestSellingCombo.comboPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(bestSellingCombo.originalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Tiết kiệm được {Math.round(((bestSellingCombo.originalPrice - bestSellingCombo.comboPrice) / bestSellingCombo.originalPrice) * 100)}%
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="worksheet-cta-button w-full text-lg py-3"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm Combo Vào Giỏ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComboModal;