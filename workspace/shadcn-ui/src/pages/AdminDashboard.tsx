import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Eye,
  Check
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { useCustomers } from '@/hooks/useCustomers';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { stats, loading } = useDashboard();
  const { confirmPayment } = useCustomers();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      shipped: { label: 'Đã gửi', variant: 'outline' as const },
      delivered: { label: 'Đã giao', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động kinh doanh của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <Link to="/admin/products" className="text-primary-accent-green hover:underline">
                  Xem chi tiết
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                <Link to="/admin/customers" className="text-primary-accent-green hover:underline">
                  Quản lý khách hàng
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <Link to="/admin/customers" className="text-primary-accent-green hover:underline">
                  Xem đơn hàng
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Tổng doanh thu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>
                {stats.recentOrders.length} đơn hàng mới nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer?.full_name || order.customer?.email || 'Khách vãng lai'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-medium">{formatPrice(order.total_amount)}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadge(order.status).variant}>
                            {getStatusBadge(order.status).label}
                          </Badge>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => confirmPayment(order.id)}
                              className="bg-primary-accent-green hover:bg-primary-accent-green/80"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Xác nhận
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Chưa có đơn hàng nào
                  </p>
                )}
              </div>
              {stats.recentOrders.length > 0 && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/admin/customers">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem tất cả đơn hàng
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm mới nhất</CardTitle>
              <CardDescription>
                {stats.popularProducts.length} sản phẩm được thêm gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.popularProducts.length > 0 ? (
                  stats.popularProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Danh mục: {product.category_name || 'Chưa phân loại'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Chưa có sản phẩm nào
                  </p>
                )}
              </div>
              {stats.popularProducts.length > 0 && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/admin/products">
                      <Package className="h-4 w-4 mr-2" />
                      Quản lý sản phẩm
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Sales Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 6 tháng gần đây</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu theo tháng từ cơ sở dữ liệu thực tế
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.monthlySales.map((month, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{month.month}</p>
                  <p className="text-lg font-semibold">{formatPrice(month.sales)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>
              Các chức năng thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild>
                <Link to="/admin/products">
                  <Package className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/categories">
                  Quản lý danh mục
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/campaigns">
                  Tạo khuyến mãi
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/settings">
                  Cài đặt website
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;