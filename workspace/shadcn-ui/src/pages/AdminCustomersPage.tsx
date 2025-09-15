import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useCustomers, Customer, Order } from '@/hooks/useCustomers';

const AdminCustomersPage = () => {
  const { customers, orders, loading, updateCustomerStatus, updateOrderStatus, confirmPayment, getCustomerStats } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['status']>('all');
  
  // Order search and pagination states
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const stats = getCustomerStats();

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
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Hoạt động', variant: 'default' as const },
      inactive: { label: 'Không hoạt động', variant: 'secondary' as const },
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      processing: { label: 'Đang xử lý', variant: 'default' as const },
      shipped: { label: 'Đã gửi', variant: 'outline' as const },
      delivered: { label: 'Đã giao', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    
    const matchesSearch = orderSearchTerm === '' || 
      order.order_number.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customer?.full_name?.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(orderSearchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  const handleOrderSearch = (value: string) => {
    setOrderSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setOrderStatusFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Hiển thị:</p>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">đơn mỗi trang</p>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={page === '...' ? 'cursor-default' : ''}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin khách hàng và đơn hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng hoạt động</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá trị đơn hàng TB</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.avgOrderValue)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            {/* Customers Section */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách Khách hàng</CardTitle>
                <CardDescription>
                  Tổng cộng {filteredCustomers.length} khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm khách hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredCustomers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Liên hệ</TableHead>
                          <TableHead>Địa chỉ</TableHead>
                          <TableHead>Đơn hàng</TableHead>
                          <TableHead>Chi tiêu</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{customer.full_name}</p>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  <Calendar className="inline h-3 w-3 mr-1" />
                                  {formatDate(customer.created_at)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {customer.phone && (
                                  <p className="text-sm flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {customer.phone}
                                  </p>
                                )}
                                <p className="text-sm flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {customer.address ? (
                                <div>
                                  <p className="text-sm flex items-start">
                                    <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                                    {customer.address}
                                  </p>
                                  {customer.city && (
                                    <p className="text-xs text-muted-foreground ml-4">{customer.city}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{customer.total_orders} đơn</p>
                                {customer.last_order_date && (
                                  <p className="text-xs text-muted-foreground">
                                    Gần nhất: {formatDate(customer.last_order_date)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{formatPrice(customer.total_spent)}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(customer.status).variant}>
                                {getStatusBadge(customer.status).label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCustomerStatus(
                                    customer.id, 
                                    customer.status === 'active' ? 'inactive' : 'active'
                                  )}
                                >
                                  {customer.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {searchTerm ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Khách hàng sẽ xuất hiện khi có đơn hàng đầu tiên'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {/* Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách Đơn hàng</CardTitle>
                <CardDescription>
                  Tổng cộng {filteredOrders.length} đơn hàng
                  {orderSearchTerm && ` (đã lọc từ ${orders.length} đơn hàng)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm theo mã đơn, tên, hoặc email khách hàng..."
                      value={orderSearchTerm}
                      onChange={(e) => handleOrderSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="shipped">Đã gửi</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paginatedOrders.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đơn hàng</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead>Ngày đặt</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <p className="font-medium">#{order.order_number}</p>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {order.customer?.full_name || 'Khách vãng lai'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.customer?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">
                                  <ShoppingCart className="inline h-3 w-3 mr-1" />
                                  {order.items?.length || 0} sản phẩm
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{formatPrice(order.total_amount)}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{formatDate(order.created_at)}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(order.status).variant}>
                                {getStatusBadge(order.status).label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Select 
                                  value={order.status} 
                                  onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipped">Đã gửi</SelectItem>
                                    <SelectItem value="delivered">Đã giao</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                  </SelectContent>
                                </Select>
                                {order.status === 'pending' && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await confirmPayment(order.id);
                                      } catch (error) {
                                        console.error('Failed to confirm payment:', error);
                                      }
                                    }}
                                  >
                                    Xác nhận thanh toán
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <PaginationComponent />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {orderSearchTerm ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {orderSearchTerm 
                        ? 'Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc'
                        : 'Đơn hàng sẽ xuất hiện khi khách hàng thực hiện mua hàng'
                      }
                    </p>
                    {orderSearchTerm && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setOrderSearchTerm('');
                          setOrderStatusFilter('all');
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;