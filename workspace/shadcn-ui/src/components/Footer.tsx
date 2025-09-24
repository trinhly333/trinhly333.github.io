import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-text-charcoal text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://i.postimg.cc/qR77ZVm5/Logo-x-a-ph-ng-to.png" 
                alt="Worksheet Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-primary-accent-green">Worksheet</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Biến dữ liệu trong bảng tính thành một trang web bán hàng mạnh mẽ và dễ quản lý. 
              Không cần biết code, không cần kinh nghiệm lập trình.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-accent-green transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:contact@worksheet.vn" className="text-gray-300 hover:text-primary-accent-green transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+84123456789" className="text-gray-300 hover:text-primary-accent-green transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-accent-blue">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-accent-blue">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-300 hover:text-white transition-colors">
                  Tài liệu hướng dẫn
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Worksheet. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;