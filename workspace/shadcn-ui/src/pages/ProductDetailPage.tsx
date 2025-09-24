import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap, Heart, Share2, Star, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem, setQuickBuyItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image', url: string }>({ type: 'video', url: '' });

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      if (foundProduct) {
        // Default to video if available, otherwise main image
        if (foundProduct.video_url) {
          setSelectedMedia({ type: 'video', url: foundProduct.video_url });
        } else {
          setSelectedMedia({ type: 'image', url: foundProduct.image_url });
        }
      }
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url
      });
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  const handleQuickBuy = () => {
    if (product) {
      // Add to cart first
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url
      });
      toast.success('✓ Chuyển đến thanh toán!');
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-white py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy sản phẩm</h1>
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages = product.gallery_images && product.gallery_images.length > 0 
    ? [product.image_url, ...product.gallery_images]
    : [product.image_url];

  return (
    <div className="min-h-screen bg-background-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-primary-accent-green transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách sản phẩm
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Media */}
          <div className="space-y-4">
            {/* Main Display Area */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              {selectedMedia.type === 'video' ? (
                selectedMedia.url.includes('youtube.com') || selectedMedia.url.includes('youtu.be') ? (
                  <iframe
                    className="w-full h-full"
                    src={(() => {
                      let embedUrl = selectedMedia.url;
                      if (embedUrl.includes('youtube.com/watch?v=')) {
                        embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                      } else if (embedUrl.includes('youtu.be/')) {
                        embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                      }
                      // Remove any additional parameters after video ID
                      if (embedUrl.includes('&')) {
                        embedUrl = embedUrl.split('&')[0];
                      }
                      return embedUrl;
                    })()}
                    title="Video giới thiệu sản phẩm"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                    poster={product.image_url}
                  >
                    <source src={selectedMedia.url} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                )
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Media Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {/* Video Thumbnail */}
              {product.video_url && (
                <button
                  onClick={() => setSelectedMedia({ type: 'video', url: product.video_url! })}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                    selectedMedia.type === 'video' ? 'border-primary-accent-green' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={product.image_url}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[6px] border-l-red-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </button>
              )}

              {/* Gallery Images */}
              {product.gallery_images && product.gallery_images.filter(img => img && img.trim() !== '').map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia({ type: 'image', url: image })}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                    selectedMedia.type === 'image' && selectedMedia.url === image ? 'border-primary-accent-green' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category_name || 'Chưa phân loại'}
              </Badge>
              <h1 className="worksheet-h1 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(5.0)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary-accent-green">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="text-sm text-red-600">
                  Tiết kiệm {formatPrice(product.original_price - product.price)}
                </div>
              )}
            </div>

            {/* Short Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tính năng nổi bật:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-accent-green mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="worksheet-cta-button flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={handleQuickBuy}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Mua ngay
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Yêu thích
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bundled Products Section - Above tabs */}
        {product && product.bundled_products?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm chọn để mua kèm</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => product.bundled_products?.includes(p.id))
                .slice(0, 4)
                .map((bundledProduct) => (
                  <div key={bundledProduct.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
                    <Link to={`/product/${bundledProduct.id}`}>
                      <img
                        src={bundledProduct.image_url}
                        alt={bundledProduct.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </Link>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{bundledProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(bundledProduct.price)}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            addItem({
                              id: bundledProduct.id,
                              name: bundledProduct.name,
                              price: bundledProduct.price,
                              image: bundledProduct.image_url
                            });
                            toast.success('Đã thêm sản phẩm đi kèm vào giỏ hàng!');
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Thêm giỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}



        {/* Related Products Section - Below tabs */}
        {product && product.related_products?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => product.related_products?.includes(p.id))
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </Link>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <Link to={`/product/${relatedProduct.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;