import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/currency';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Megaphone, Calendar, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CampaignForm {
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
}

const AdminCampaignsPage = () => {
  const { 
    campaigns, 
    loading, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign 
  } = useCampaigns();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: null,
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.start_date || !formData.end_date) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, formData);
      } else {
        await createCampaign(formData);
      }
      
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_uses: null,
      start_date: '',
      end_date: '',
      status: 'active'
    });
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      code: campaign.code,
      discount_type: campaign.discount_type,
      discount_value: campaign.discount_value,
      min_order_amount: campaign.min_order_amount,
      max_uses: campaign.max_uses,
      start_date: campaign.start_date.split('T')[0],
      end_date: campaign.end_date.split('T')[0],
      status: campaign.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (campaignId: string, campaignName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${campaignName}"?`)) {
      await deleteCampaign(campaignId);
    }
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải khuyến mãi...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Megaphone className="h-8 w-8 text-primary-accent-green" />
            <h1 className="text-3xl font-bold text-text-charcoal">Quản lý Khuyến mãi</h1>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="worksheet-cta-button" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Khuyến mãi mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tên khuyến mãi *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Khuyến mãi Tết 2024"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="code">Mã giảm giá *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="TET2024"
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateCode}>
                        Tạo tự động
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="discount_type">Loại giảm giá</Label>
                    <Select value={formData.discount_type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, discount_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                        <SelectItem value="fixed">Số tiền cố định (VND)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="discount_value">
                      Giá trị giảm {formData.discount_type === 'percentage' ? '(%)' : '(VND)'}
                    </Label>
                    <Input
                      id="discount_value"
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount_value: Number(e.target.value) }))}
                      placeholder="20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="min_order_amount">Đơn hàng tối thiểu (VND)</Label>
                    <Input
                      id="min_order_amount"
                      type="number"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: Number(e.target.value) }))}
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="max_uses">Số lần sử dụng tối đa (để trống = không giới hạn)</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      value={formData.max_uses || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value ? Number(e.target.value) : null }))}
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="start_date">Ngày bắt đầu *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">Ngày kết thúc *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="worksheet-cta-button flex-1">
                    {editingCampaign ? 'Cập nhật' : 'Tạo khuyến mãi'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Khuyến mãi</th>
                    <th className="text-left p-4 font-medium">Mã giảm giá</th>
                    <th className="text-left p-4 font-medium">Giá trị</th>
                    <th className="text-left p-4 font-medium">Thời gian</th>
                    <th className="text-left p-4 font-medium">Sử dụng</th>
                    <th className="text-left p-4 font-medium">Trạng thái</th>
                    <th className="text-left p-4 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          {campaign.min_order_amount > 0 && (
                            <p className="text-sm text-gray-600">
                              Đơn tối thiểu: {formatPrice(campaign.min_order_amount)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="font-mono">
                          {campaign.code}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {campaign.discount_type === 'percentage' ? (
                            <Percent className="h-4 w-4 text-primary-accent-green" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-primary-accent-green" />
                          )}
                          <span className="font-medium">
                            {campaign.discount_type === 'percentage' 
                              ? `${campaign.discount_value}%`
                              : formatPrice(campaign.discount_value)
                            }
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{new Date(campaign.start_date).toLocaleDateString('vi-VN')}</p>
                          <p className="text-gray-500">đến</p>
                          <p>{new Date(campaign.end_date).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium">{campaign.current_uses}</p>
                          <p className="text-gray-500">
                            {campaign.max_uses ? `/ ${campaign.max_uses}` : '/ ∞'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge 
                            variant={campaign.status === 'active' ? 'default' : 'secondary'}
                            className={isExpired(campaign.end_date) ? 'bg-red-100 text-red-800' : 
                              isUpcoming(campaign.start_date) ? 'bg-blue-100 text-blue-800' : ''}
                          >
                            {isExpired(campaign.end_date) ? 'Hết hạn' :
                             isUpcoming(campaign.start_date) ? 'Sắp tới' :
                             campaign.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(campaign)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(campaign.id, campaign.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {campaigns.length === 0 && (
              <div className="p-8 text-center">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có khuyến mãi nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Tạo khuyến mãi đầu tiên để thu hút khách hàng.
                </p>
                <Button 
                  className="worksheet-cta-button"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khuyến mãi đầu tiên
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCampaignsPage;