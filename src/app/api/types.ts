/**
 * Тип для товара (сокращённая информация) для каталога
 */
export interface ProductSummary {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

/**
 * Ответ для эндпоинта получения товаров по категории
 */
export interface CatalogResponse {
  category: string;
  products: ProductSummary[];
}

/**
 * Тип для детальной информации о товаре
 */
export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  fullName?: string;
  price: number;
  stock: number;
  image: string;
  characteristics?: Record<string, string>;
}

/**
 * Тип результата глобального поиска для товара
 */
export interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

/**
 * Ответ для глобального поиска
 */
export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

/**
 * Ответ для получения изображения
 */
export interface ImageResponse {
  imageUrl: string;
}