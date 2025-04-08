import { Product } from '@/types/product';

export const mockProduct: Product = {
  id: '1',
  name: 'Смартфон iPhone 13 Pro',
  description: 'Мощный смартфон с профессиональной камерой, процессором A15 Bionic и дисплеем ProMotion. Идеально подходит для фотографов и видеографов.',
  price: 99999.99,
  image: '/images/products/iphone-13-pro.jpg',
  category: 'electronics',
  stock: 5
};

export const mockProducts: Product[] = [
  mockProduct,
  {
    id: '2',
    name: 'Ноутбук MacBook Pro 14"',
    description: 'Профессиональный ноутбук с чипом M2 Pro, дисплеем Liquid Retina XDR и длительным временем автономной работы.',
    price: 199999.99,
    image: '/images/products/macbook-pro.jpg',
    category: 'electronics',
    stock: 3
  },
  {
    id: '3',
    name: 'Наушники AirPods Pro',
    description: 'Беспроводные наушники с активным шумоподавлением, пространственным аудио и прозрачным режимом.',
    price: 29999.99,
    image: '/images/products/airpods-pro.jpg',
    category: 'electronics',
    stock: 0
  }
]; 