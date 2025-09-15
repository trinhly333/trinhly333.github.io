import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating?: number;
  category_name?: string;
  discount?: number;
  is_best_seller?: boolean;
  thumbnail_url?: string; // Add this for mockData compatibility
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, animatingItemId } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const isAnimating = animatingItemId === product.id;
  
  const handleAddToCart = () => {
    if (isAdding || isAnimating) return;
    
    setIsAdding(true);
    
    // CRITICAL FIX: Add fly-to-cart animation with button element
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.thumbnail_url
    }, buttonRef.current || undefined);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <Card className={cn("group hover:shadow-xl transition-all duration-300 hover:border-green-200 overflow-hidden", className)}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image_url || product.thumbnail_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Discount Badge - Left top corner */}
          {product.original_price && product.original_price > product.price && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-bold z-20 rounded-md px-2 py-1 shadow-lg text-xs">
              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
            </Badge>
          )}
          {/* Category Badge - Bottom left */}
          <Badge variant="secondary" className="absolute bottom-2 left-2">
            {product.category_name || 'Chưa phân loại'}
          </Badge>
          {/* Best Seller Badge - Top right */}
          {product.is_best_seller && (
            <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
              Bán chạy
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </CardDescription>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < Math.floor(product.rating || 5)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.rating || 5.0})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-green-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.original_price && (
            <span className="text-lg text-gray-500 line-through">
              {product.original_price.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button variant="outline" size="sm" className="text-xs">
            Xem chi tiết
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={isAdding || isAnimating}
            size="sm"
            className={cn(
              "text-xs transition-all duration-300",
              isAnimating 
                ? "bg-green-600 hover:bg-green-600 text-white" 
                : "bg-green-600 hover:bg-green-700"
            )}
          >
            {isAnimating ? (
              <div className="flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                <span>✓ Đã thêm</span>
              </div>
            ) : isAdding ? (
              <span>Thêm giỏ...</span>
            ) : (
              <span>Thêm giỏ</span>
            )}
          </Button>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-xs"
            onClick={() => {
              handleAddToCart();
              setTimeout(() => {
                window.location.href = '/checkout';
              }, 500);
            }}
          >
            Mua ngay
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}