import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Video,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/AdminLayout';
import { useProducts, Product } from '@/hooks/useProducts';

const AdminProductsPage = () => {
  const { products, categories, loading, createProduct, updateProduct, deleteProduct, createCategory } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isQuickCategoryOpen, setIsQuickCategoryOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailed_description: '',
    price: '',
    original_price: '',
    image_url: '',
    video_url: '',
    gallery_images: [''],
    features: [''],
    specifications: {} as Record<string, string>,
    category_id: '',
    related_products: [] as string[],
    bundled_products: [] as string[],
    google_sheet_link: '',
    tutorial_video_link: '',
    status: 'active' as 'active' | 'inactive',
    is_best_seller: false
  });

  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [relatedProductsOpen, setRelatedProductsOpen] = useState(false);
  const [bundledProductsOpen, setBundledProductsOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      detailed_description: '',
      price: '',
      original_price: '',
      image_url: '',
      video_url: '',
      gallery_images: [''],
      features: [''],
      specifications: {},
      category_id: '',
      related_products: [],
      bundled_products: [],
      google_sheet_link: '',
      tutorial_video_link: '',
      status: 'active',
      is_best_seller: false
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.google_sheet_link.trim()) {
      alert('Vui lòng nhập Link Google Sheet Gốc');
      return;
    }
    
    if (!formData.tutorial_video_link.trim()) {
      alert('Vui lòng nhập Link Video Hướng Dẫn');
      return;
    }
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
      gallery_images: formData.gallery_images.filter(img => img.trim() !== ''),
      features: formData.features.filter(feature => feature.trim() !== ''),
      // Clean the required fields
      google_sheet_link: formData.google_sheet_link.trim(),
      tutorial_video_link: formData.tutorial_video_link.trim()
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      detailed_description: product.detailed_description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url,
      video_url: product.video_url || '',
      gallery_images: product.gallery_images || [''],
      features: product.features || [''],
      specifications: product.specifications || {},
      category_id: product.category_id,
      related_products: product.related_products || [],
      bundled_products: product.bundled_products || [],
      google_sheet_link: product.google_sheet_link || '',
      tutorial_video_link: product.tutorial_video_link || '',
      status: product.status,
      is_best_seller: product.is_best_seller || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProduct(id);
    }
  };

  const handleCreateCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        await createCategory(newCategory);
        setNewCategory({ name: '', description: '' });
        setIsQuickCategoryOpen(false);
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, '']
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Sản phẩm</h1>
            <p className="text-muted-foreground">
              Tổng cộng {filteredProducts.length} sản phẩm
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới cho cửa hàng'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Cơ bản</TabsTrigger>
                    <TabsTrigger value="media">Hình ảnh & Video</TabsTrigger>
                    <TabsTrigger value="details">Chi tiết</TabsTrigger>
                    <TabsTrigger value="specs">Thông số</TabsTrigger>
                    <TabsTrigger value="related">Liên quan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Tên sản phẩm *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập tên sản phẩm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Danh mục</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={formData.category_id} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsQuickCategoryOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Giá bán *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="original_price">Giá gốc</Label>
                        <Input
                          id="original_price"
                          type="number"
                          value={formData.original_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="inactive">Tạm ẩn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_best_seller"
                          checked={formData.is_best_seller}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_best_seller: !!checked }))}
                        />
                        <Label htmlFor="is_best_seller">Sản phẩm bán chạy</Label>
                      </div>
                      
                      <div>
                        <Label>Giảm giá</Label>
                        <div className="text-sm text-gray-600">
                          {formData.original_price && formData.price && parseFloat(formData.original_price) > parseFloat(formData.price) 
                            ? `${Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100)}% giảm giá`
                            : 'Không có giảm giá'
                          }
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả ngắn</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Mô tả ngắn gọn về sản phẩm"
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="image_url">Hình ảnh chính *</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="/images/exampleimage.jpg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="video_url">Video giới thiệu</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        placeholder="https://example.com/video.mp4"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Video sẽ được hiển thị đầu tiên trên trang chi tiết sản phẩm
                      </p>
                    </div>

                    {/* Google Sheet Link - Required for automation */}
                    <div>
                      <Label className="text-red-600" htmlFor="google_sheet_link">Link Google Sheet Gốc *</Label>
                      <Input
                        id="google_sheet_link"
                        value={formData.google_sheet_link}
                        onChange={(e) => setFormData(prev => ({ ...prev, google_sheet_link: e.target.value }))}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        required
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Dán link Google Sheet master của sản phẩm này vào đây. Hệ thống sẽ tự tạo bản sao và gửi cho khách hàng.
                      </p>
                    </div>

                    {/* Tutorial Video Link - Required for automation */}
                    <div>
                      <Label className="text-red-600" htmlFor="tutorial_video_link">Link Video Hướng Dẫn *</Label>
                      <Input
                        id="tutorial_video_link"
                        value={formData.tutorial_video_link}
                        onChange={(e) => setFormData(prev => ({ ...prev, tutorial_video_link: e.target.value }))}
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Dán link YouTube video hướng dẫn sử dụng. Link này sẽ được gửi kèm trong email giao hàng.
                      </p>
                    </div>

                    <div>
                      <Label>Gallery ảnh</Label>
                      {formData.gallery_images.map((image, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const newImages = [...formData.gallery_images];
                              newImages[index] = e.target.value;
                              setFormData(prev => ({ ...prev, gallery_images: newImages }));
                            }}
                            placeholder="/images/galleryimage.jpg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeGalleryImage(index)}
                            disabled={formData.gallery_images.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addGalleryImage}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm ảnh
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="detailed_description">Mô tả chi tiết</Label>
                      <Textarea
                        id="detailed_description"
                        value={formData.detailed_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                        placeholder="Mô tả chi tiết về sản phẩm, tính năng, cách sử dụng..."
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label>Tính năng nổi bật</Label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...formData.features];
                              newFeatures[index] = e.target.value;
                              setFormData(prev => ({ ...prev, features: newFeatures }));
                            }}
                            placeholder="Nhập tính năng"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeFeature(index)}
                            disabled={formData.features.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFeature}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm tính năng
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={specKey}
                          onChange={(e) => setSpecKey(e.target.value)}
                          placeholder="Tên thông số (VD: Kích thước)"
                        />
                        <Input
                          value={specValue}
                          onChange={(e) => setSpecValue(e.target.value)}
                          placeholder="Giá trị (VD: 15x10x5cm)"
                        />
                        <Button
                          type="button"
                          onClick={addSpecification}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(formData.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 border rounded">
                            <span><strong>{key}:</strong> {value}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSpecification(key)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="related" className="space-y-4 mt-4">
                    <div>
                      <Label>Sản phẩm tương tự</Label>
                      <p className="text-sm text-gray-500 mb-3">Gõ để tìm kiếm và chọn các sản phẩm cùng danh mục</p>
                      
                      <Popover open={relatedProductsOpen} onOpenChange={setRelatedProductsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={relatedProductsOpen}
                            className="w-full justify-between"
                          >
                            <span className="truncate">
                              {formData.related_products.length > 0 
                                ? `${formData.related_products.length} sản phẩm đã chọn`
                                : "Tìm kiếm sản phẩm tương tự..."}
                            </span>
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Gõ tên sản phẩm..." />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                              <CommandGroup>
                                {products
                                  .filter(p => p.id !== editingProduct?.id && p.category_id === formData.category_id)
                                  .map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.name} ${product.id}`}
                                      onSelect={() => {
                                        if (!formData.related_products.includes(product.id)) {
                                          setFormData(prev => ({
                                            ...prev,
                                            related_products: [...prev.related_products, product.id]
                                          }));
                                        }
                                        setRelatedProductsOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center">
                                        <img 
                                          src={product.image_url} 
                                          alt={product.name}
                                          className="w-6 h-6 rounded mr-2 object-cover"
                                        />
                                        <span className="truncate">{product.name}</span>
                                      </div>
                                    </CommandItem>
                                  ))
                                }
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.related_products.map((productId) => {
                          const product = products.find(p => p.id === productId);
                          return (
                            <div key={productId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              <span className="truncate max-w-32">{product?.name || 'N/A'}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  related_products: prev.related_products.filter(id => id !== productId)
                                }))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>Sản phẩm đi kèm</Label>
                      <p className="text-sm text-gray-500 mb-3">Gõ để tìm kiếm và chọn các sản phẩm bổ sung</p>
                      
                      <Popover open={bundledProductsOpen} onOpenChange={setBundledProductsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={bundledProductsOpen}
                            className="w-full justify-between"
                          >
                            <span className="truncate">
                              {formData.bundled_products.length > 0 
                                ? `${formData.bundled_products.length} sản phẩm đã chọn`
                                : "Tìm kiếm sản phẩm đi kèm..."}
                            </span>
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Gõ tên sản phẩm..." />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
                              <CommandGroup>
                                {products
                                  .filter(p => p.id !== editingProduct?.id)
                                  .map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.name} ${product.id}`}
                                      onSelect={() => {
                                        if (!formData.bundled_products.includes(product.id)) {
                                          setFormData(prev => ({
                                            ...prev,
                                            bundled_products: [...prev.bundled_products, product.id]
                                          }));
                                        }
                                        setBundledProductsOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                          <img 
                                            src={product.image_url} 
                                            alt={product.name}
                                            className="w-6 h-6 rounded mr-2 object-cover"
                                          />
                                          <span className="truncate">{product.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground ml-2">
                                          {formatPrice(product.price)}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))
                                }
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.bundled_products.map((productId) => {
                          const product = products.find(p => p.id === productId);
                          return (
                            <div key={productId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              <span className="truncate max-w-32">{product?.name || 'N/A'}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  bundled_products: prev.bundled_products.filter(id => id !== productId)
                                }))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Cập nhật' : 'Tạo sản phẩm'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Category Creation Dialog */}
        <Dialog open={isQuickCategoryOpen} onOpenChange={setIsQuickCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo danh mục mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category_name">Tên danh mục</Label>
                <Input
                  id="category_name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <Label htmlFor="category_description">Mô tả</Label>
                <Textarea
                  id="category_description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả danh mục"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsQuickCategoryOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateCategory}>
                  Tạo danh mục
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Sản phẩm</CardTitle>
            <CardDescription>
              Quản lý toàn bộ sản phẩm trong cửa hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.category_name || 'Chưa phân loại'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatPrice(product.price)}</p>
                            {product.original_price && product.original_price > product.price && (
                              <div>
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.original_price)}
                                </p>
                                <Badge variant="destructive" className="text-xs">
                                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                              {product.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                            </Badge>
                            {product.is_best_seller && (
                              <Badge className="bg-orange-500 text-white text-xs">
                                Bán chạy
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu bằng cách tạo sản phẩm đầu tiên'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;