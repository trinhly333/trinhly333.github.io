import { Product, ProductAddon } from '@/types';

// Mock addons
const mockAddons: ProductAddon[] = [
  {
    id: 'addon-1',
    name: 'Thêm Gói Giao Diện Cao Cấp',
    price: 150000,
    description: 'Giao diện chuyên nghiệp với nhiều tùy chọn màu sắc và font chữ'
  },
  {
    id: 'addon-2',
    name: 'Thêm Gói Tích Hợp Thanh Toán Tự Động',
    price: 200000,
    description: 'Tích hợp thanh toán tự động với VietQR, Momo, ZaloPay'
  }
];

// Mock products with Vietnamese content
export const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Website Bán Lẻ Chuyên Nghiệp',
    description: 'Mẫu website tối ưu cho các cửa hàng thời trang, mỹ phẩm, đồ gia dụng. Tích hợp quản lý tồn kho, màu sắc, kích cỡ trực tiếp từ Google Sheet. Giao diện hiện đại, chuẩn SEO, giúp bạn tăng doanh thu ngay lập tức.',
    price: 399000,
    original_price: 599000,
    thumbnail_url: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_demo_url: 'https://www.youtube.com/watch?v=QC4xsRZ3ph8',
    google_sheets_url: 'https://docs.google.com/spreadsheets/d/1vw3cy1NGQf6R5gb3to2rDsZWDpXrJbHKLHT3VXdUuEQ/edit?usp=sharing',
    image_gallery_urls: [
      'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/220357/pexels-photo-220357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    addons: mockAddons,
    category: 'Website Bán Lẻ',
    slug: 'website-ban-le-chuyen-nghiep',
    related_products: ['product-2', 'product-3'], // Similar products
    bundled_products: ['product-2'], // Bundle recommendations
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-2',
    name: 'Website Dịch Vụ & Đặt Lịch Hẹn',
    description: 'Giải pháp hoàn hảo cho các spa, phòng khám, tư vấn viên, hoặc bất kỳ ngành dịch vụ nào cần hệ thống đặt lịch hẹn. Khách hàng có thể xem lịch trống và đặt hẹn trực tiếp, dữ liệu tự động cập nhật vào Google Sheet của bạn.',
    price: 449000,
    original_price: 699000,
    thumbnail_url: 'https://images.pexels.com/photos/4098272/pexels-photo-4098272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_demo_url: 'https://www.youtube.com/watch?v=sO8eSa_4p-U',
    google_sheets_url: 'https://docs.google.com/spreadsheets/d/1vw3cy1NGQf6R5gb3to2rDsZWDpXrJbHKLHT3VXdUuEQ/edit?usp=sharing',
    image_gallery_urls: [
      'https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    addons: mockAddons,
    category: 'Website Dịch Vụ',
    slug: 'website-dich-vu-dat-lich-hen',
    related_products: ['product-1', 'product-3'], // Similar products
    bundled_products: ['product-3'], // Bundle recommendations
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-3',
    name: 'Website Portfolio Sáng Tạo',
    description: 'Mẫu website hoàn hảo cho freelancer, designer, photographer, và các nghệ sĩ sáng tạo. Giao diện tối giản, focus vào việc showcase tác phẩm với hiệu ứng visual ấn tượng.',
    price: 299000,
    original_price: 499000,
    thumbnail_url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    video_demo_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    google_sheets_url: 'https://docs.google.com/spreadsheets/d/1vw3cy1NGQf6R5gb3to2rDsZWDpXrJbHKLHT3VXdUuEQ/edit?usp=sharing',
    image_gallery_urls: [
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/430205/pexels-photo-430205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    addons: [mockAddons[0]], // Only premium design addon
    category: 'Website Portfolio',
    slug: 'website-portfolio-sang-tao',
    related_products: ['product-1', 'product-2'], // Similar products
    bundled_products: ['product-1'], // Bundle recommendations
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Featured categories
export const featuredCategories = [
  {
    id: 'retail',
    name: 'Website Bán Lẻ',
    description: 'Mẫu website cho cửa hàng online, thương mại điện tử',
    icon: '🛍️',
    count: 15
  },
  {
    id: 'service',
    name: 'Website Dịch Vụ',
    description: 'Mẫu website cho spa, phòng khám, tư vấn',
    icon: '💼',
    count: 12
  },
  {
    id: 'portfolio',
    name: 'Website Portfolio',
    description: 'Mẫu website cho freelancer, designer, nghệ sĩ',
    icon: '🎨',
    count: 8
  }
];

// Best selling combo
export const bestSellingCombo = {
  id: 'combo-1',
  name: 'Combo Khởi Nghiệp Hoàn Hảo',
  description: 'Bao gồm: Website Bán Lẻ + Gói Giao Diện Cao Cấp + Gói Thanh Toán Tự Động + 6 tháng hỗ trợ miễn phí',
  originalPrice: 949000,
  comboPrice: 699000,
  savings: 250000,
  products: [mockProducts[0], mockProducts[1]],
  thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  includes: [
    {
      name: 'Website Bán Lẻ Chuyên Nghiệp',
      description: 'Mẫu website tối ưu cho các cửa hàng online với quản lý tồn kho thông minh',
      price: 399000
    },
    {
      name: 'Gói Giao Diện Cao Cấp',
      description: 'Giao diện chuyên nghiệp với nhiều tùy chọn màu sắc và font chữ',
      price: 150000
    },
    {
      name: 'Gói Thanh Toán Tự Động',
      description: 'Tích hợp thanh toán tự động với VietQR, Momo, ZaloPay',
      price: 200000
    },
    {
      name: 'Hỗ trợ 6 tháng',
      description: 'Hỗ trợ kỹ thuật và tư vấn miễn phí trong 6 tháng đầu',
      price: 200000
    }
  ]
};