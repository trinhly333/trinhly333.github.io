import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProducts, Category } from '@/hooks/useProducts';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryForm {
  name: string;
  description: string;
}

const AdminCategoriesPage = () => {
  const { 
    categories, 
    loading, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    fetchCategories 
  } = useProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    description: ''
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    const slug = generateSlug(formData.name);
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: slug,
          description: formData.description.trim()
        });
      } else {
        await createCategory({
          name: formData.name.trim(),
          slug: slug,
          description: formData.description.trim()
        });
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
      description: ''
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`)) {
      await deleteCategory(categoryId);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải danh mục...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-charcoal">Quản lý Danh mục</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="worksheet-cta-button" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Danh mục mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên danh mục *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Webapp Bán Lẻ"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ngắn về danh mục này"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" className="worksheet-cta-button flex-1">
                    {editingCategory ? 'Cập nhật' : 'Thêm danh mục'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-primary-accent-green" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-2">
                  {category.description || 'Không có mô tả'}
                </p>
                <div className="text-xs text-gray-500">
                  Slug: {category.slug}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có danh mục nào
              </h3>
              <p className="text-gray-600 mb-4">
                Tạo danh mục đầu tiên để bắt đầu phân loại sản phẩm.
              </p>
              <Button 
                className="worksheet-cta-button"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm danh mục đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;