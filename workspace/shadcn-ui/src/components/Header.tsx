import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const items = useCart(state => state.items);
  const toggleCart = useCart(state => state.toggleCart);
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  const location = useLocation();

  // CRITICAL BUG FIX: Auto scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="https://i.postimg.cc/k5FjCFmp/X-a-ph-ng-kh-ng-c-ch.png" 
              alt="Worksheet Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-text-charcoal font-sans transition-colors duration-300 group-hover:text-green-600">Worksheet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary-accent-green ${
                location.pathname === '/' ? 'text-primary-accent-green border-b-2 border-primary-accent-green' : 'text-gray-600'
              }`}
              style={{ textDecoration: 'none' }}
            >
              Trang chủ
            </Link>
            <Link 
              to="/products" 
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary-accent-green ${
                location.pathname === '/products' ? 'text-primary-accent-green border-b-2 border-primary-accent-green' : 'text-gray-600'
              }`}
              style={{ textDecoration: 'none' }}
            >
              Sản phẩm
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary-accent-green ${
                location.pathname === '/about' ? 'text-primary-accent-green border-b-2 border-primary-accent-green' : 'text-gray-600'
              }`}
              style={{ textDecoration: 'none' }}
            >
              Giới thiệu
            </Link>
            <Link 
              to="/contact" 
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary-accent-green ${
                location.pathname === '/contact' ? 'text-primary-accent-green border-b-2 border-primary-accent-green' : 'text-gray-600'
              }`}
              style={{ textDecoration: 'none' }}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm mẫu website cho ngành nghề của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background-white border-gray-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </form>

          {/* Cart and Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleCart}
              className="relative cart-button"
            >
              <ShoppingCart className="h-4 w-4 cart-icon" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-cta-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-count animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            <Link to="/admin">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                Admin
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </form>
              
              <Link 
                to="/" 
                className="worksheet-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                to="/products" 
                className="worksheet-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link 
                to="/about" 
                className="worksheet-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link 
                to="/contact" 
                className="worksheet-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <Link 
                to="/admin" 
                className="worksheet-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;