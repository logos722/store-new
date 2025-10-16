import { StaticImageData } from 'next/image';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | StaticImageData;
  groupId?: string;
  category: string;
  stock: number;
  quantity: number;
  [key: string]: string | number | StaticImageData | boolean; // Для дополнительных свойств, если необходимо
}
