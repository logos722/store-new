import { Product } from './product';

export interface OrderFormData {
  email: string;
  name: string;
  phone: string;
  city: string;
  comment?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerInfo: OrderFormData;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
