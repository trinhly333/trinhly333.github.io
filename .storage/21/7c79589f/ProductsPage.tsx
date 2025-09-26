import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Eye, ShoppingCart, Zap, TrendingUp, Search } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';
import { useProducts, Product } from '@/hooks/useProducts';
import { toast } from 'sonner';
import DiscountCodesSection from '@/components/DiscountCodesSection';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const addItem = useCart(state => state.addItem);
  const { products, categories, loading } = useProducts();

  // Filter products by selected category and search term
  const filteredProducts = products.filter(product => {
    const matchesStatus = product.status === 'active';
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });
  
  // Get best sellers (top 4) 
  const bestSellers = products.filter(product => product.is_best_seller && product.status === 'active').slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url
    });
    toast.success('✓ Đã thêm vào giỏ hàng!');
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge - FIXED */}
        {product.original_price && product.original_price > product.price && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold z-20">
            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
          </Badge>
        )}
        
        {/* Best Seller Badge */}
        {product.is_best_seller && (
          <Badge className="absolute top-3 right-3 bg-cta-orange text-white">
            Bán chạy
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-text-charcoal mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Rating and Social Proof */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-cta-orange text-cta-orange' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Đã bán {product.sold_count}
          </Badge>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {product.features?.slice(0, 3).map((feature: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-accent-green">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Chi tiết
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="w-full text-xs bg-green-600 hover:bg-green-700"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Thêm giỏ
          </Button>
          <Button 
            size="sm" 
            className="w-full text-xs bg-orange-500 hover:bg-orange-600"
            onClick={() => {
              handleAddToCart(product);
              setTimeout(() => {
                window.location.href = '/checkout';
              }, 500);
            }}
          >
            <Zap className="h-3 w-3 mr-1" />
            Mua ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-white py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-charcoal mb-6">
            Tất cả sản phẩm
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Khám phá bộ sưu tập webapp hoàn chỉnh để phát triển doanh nghiệp của bạn
          </p>
        </div>

        {/* Discount Codes Section */}
        <DiscountCodesSection />

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm sản phẩm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-primary-accent-green"
            />
          </div>
          
          {/* Search Results Counter */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-4 text-gray-600">
              <p>Tìm thấy {filteredProducts.length} sản phẩm</p>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-sm"
                >
                  Xóa từ khóa tìm kiếm
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold text-text-charcoal">
                Sản phẩm Bán chạy nhất
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'worksheet-cta-button' : ''}
            >
              Tất cả ({products.filter(p => p.status === 'active').length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name ? 'worksheet-cta-button' : ''}
              >
                {category.name} ({products.filter(p => p.category?.name === category.name && p.status === 'active').length})
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              {searchTerm ? 'Không tìm thấy sản phẩm phù hợp' 
                : selectedCategory === 'all' ? 'Chưa có sản phẩm nào' 
                : `Chưa có sản phẩm trong danh mục "${selectedCategory}"`}
            </h3>
            <p className="text-gray-500 mb-8">
              {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác'
                : selectedCategory === 'all' 
                ? 'Hãy quay lại sau để xem các sản phẩm mới nhất.' 
                : 'Hãy chọn danh mục khác hoặc quay lại sau.'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="space-x-4">
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="mr-4"
                  >
                    Xóa từ khóa tìm kiếm
                  </Button>
                )}
                {selectedCategory !== 'all' && (
                  <Button 
                    onClick={() => setSelectedCategory('all')}
                    className="worksheet-cta-button"
                  >
                    Xem tất cả sản phẩm
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary-accent-green/5 to-secondary-accent-blue/5 rounded-2xl mt-16">
          <h2 className="text-3xl font-bold text-text-charcoal mb-4">
            Không tìm thấy webapp phù hợp?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Chúng tôi có thể tạo webapp tùy chỉnh theo yêu cầu riêng của bạn
          </p>
          <Link to="/contact">
            <Button className="worksheet-cta-button text-lg px-8 py-3">
              Liên hệ tư vấn miễn phí
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;