import { StaticImageData } from 'next/image';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | StaticImageData;
  category: string;
  stock: number;
  [key: string]: string | number | StaticImageData; // Для дополнительных свойств, если необходимо
}
