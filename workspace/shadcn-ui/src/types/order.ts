export interface OrderFormData {
  productId: string;
  addons: string[];
  fullName: string;
  email: string;
  phone: string;
  source: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  email: string;
  phone: string;
  productId: string;
  productName: string;
  addons: string[];
  subtotal: number;
  total: number;
  status: 'Awaiting Payment' | 'Completed' | 'Cancelled';
  source: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  product: {
    id: string;
    name: string;
    price: number;
  };
  addons: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  subtotal: number;
  total: number;
}