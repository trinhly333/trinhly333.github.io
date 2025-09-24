import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Eye, ShoppingCart, Zap, TrendingUp, Search } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

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

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url
    });
    toast.success('✓ Đã thêm vào giỏ hàng!');
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:shadow-2xl hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge - Enhanced */}
        {product.original_price && product.original_price > product.price && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-3 py-1 text-sm shadow-lg z-20">
            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
          </Badge>
        )}
        
        {/* Best Seller Badge - Enhanced */}
        {product.is_best_seller && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-3 py-1 shadow-lg">
            🔥 Bán chạy
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating and Social Proof - Enhanced */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">({product.rating})</span>
          </div>
          <Badge variant="outline" className="text-xs font-semibold border-green-200 text-green-700 bg-green-50">
            ✓ Đã bán {product.sold_count}
          </Badge>
        </div>

        {/* Features - Enhanced */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {product.features?.slice(0, 3).map((feature: string, index: number) => (
              <Badge key={index} className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                ✨ {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price - Enhanced */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Enhanced */}
        <div className="grid grid-cols-3 gap-3">
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="sm" className="w-full text-xs hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Eye className="h-3 w-3 mr-1" />
              Chi tiết
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="w-full text-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Thêm giỏ
          </Button>
          <Button 
            size="sm" 
            className="w-full text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header - Enhanced */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl -z-10"></div>
          <div className="py-12 px-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Tất cả sản phẩm
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Khám phá bộ sưu tập webapp hoàn chỉnh để phát triển doanh nghiệp của bạn
            </p>
            
            {/* Search Bar - Enhanced */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl shadow-sm"
                />
              </div>
              
              {/* Search Results Counter */}
              {(searchTerm || selectedCategory !== 'all') && (
                <div className="mt-4 text-gray-600">
                  <p className="font-medium">Tìm thấy {filteredProducts.length} sản phẩm</p>
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-sm hover:bg-gray-100"
                    >
                      Xóa từ khóa tìm kiếm
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best Sellers Section - Enhanced */}
        {bestSellers.length > 0 && (
          <section className="mb-20">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-red-500 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Sản phẩm Bán chạy nhất
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter - Enhanced */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                  : 'hover:bg-gray-50 border-2'
              }`}
            >
              Tất cả ({products.filter(p => p.status === 'active').length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                    : 'hover:bg-gray-50 border-2'
                }`}
              >
                {category.name} ({products.filter(p => p.category?.name === category.name && p.status === 'active').length})
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid - Enhanced */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">😔</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {searchTerm ? 'Không tìm thấy sản phẩm phù hợp' 
                  : selectedCategory === 'all' ? 'Chưa có sản phẩm nào' 
                  : `Chưa có sản phẩm trong danh mục "${selectedCategory}"`}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
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
                      className="mr-4 px-6 py-3 rounded-xl"
                    >
                      Xóa từ khóa tìm kiếm
                    </Button>
                  )}
                  {selectedCategory !== 'all' && (
                    <Button 
                      onClick={() => setSelectedCategory('all')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Xem tất cả sản phẩm
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action - Enhanced */}
        <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mt-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Không tìm thấy webapp phù hợp?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Chúng tôi có thể tạo webapp tùy chỉnh theo yêu cầu riêng của bạn
            </p>
            <Link to="/contact">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                Liên hệ tư vấn miễn phí
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;