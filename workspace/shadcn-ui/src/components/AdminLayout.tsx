import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen,
  Megaphone, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin',
      active: location.pathname === '/admin'
    },
    {
      icon: Package,
      label: 'Quản lý Sản phẩm',
      path: '/admin/products',
      active: location.pathname === '/admin/products'
    },
    {
      icon: FolderOpen,
      label: 'Quản lý Danh mục',
      path: '/admin/categories',
      active: location.pathname === '/admin/categories'
    },
    {
      icon: Megaphone,
      label: 'Quản lý Khuyến mãi',
      path: '/admin/campaigns',
      active: location.pathname === '/admin/campaigns'
    },
    {
      icon: Users,
      label: 'Quản lý Khách hàng',
      path: '/admin/customers',
      active: location.pathname === '/admin/customers'
    },
    {
      icon: Settings,
      label: 'Cài đặt Website',
      path: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuth');
    // Force reload to clear any cached state
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary-accent-green">
            Admin Panel
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    item.active 
                      ? 'bg-primary-accent-green text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="px-3 mt-8 pt-8 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Worksheet Admin Dashboard
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;