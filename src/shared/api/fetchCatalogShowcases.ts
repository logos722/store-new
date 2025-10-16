import { CatalogShowcase } from '@/types/catalog';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import { getApiUrl } from '@/shared/utils/getApiUrl';

interface CatalogApiResponse {
  title: string;
  description?: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    groupId?: string;
    category: string;
    stock: number;
    quantity: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  page?: number;
  totalPages?: number;
  total?: number;
}

/**
 * Загружает данные витрины для одной категории
 * @param categoryId - ID категории
 * @param limit - Количество товаров для загрузки (по умолчанию 4)
 * @returns Promise с данными витрины или null в случае ошибки
 */
export async function fetchCatalogShowcase(
  categoryId: string,
  limit: number = 4,
): Promise<CatalogShowcase | null> {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(
      `${apiUrl}/api/catalog/${encodeURIComponent(categoryId)}?page=1&limit=${limit}`,
      {
        cache: 'no-store', // Для всегда актуальных данных
        // или можно использовать:
        // next: { revalidate: 3600 } // Кеширование на 1 час
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch catalog ${categoryId}: ${response.status}`,
      );
      return null;
    }

    const data: CatalogApiResponse = await response.json();

    // Получаем информацию о категории из констант
    const catalogInfo = CatalogInfo[categoryId as CatalogId];

    // Формируем объект витрины
    const showcase: CatalogShowcase = {
      categoryId,
      title: catalogInfo?.title || data.title || 'Каталог',
      description: catalogInfo?.description || data.description,
      slug: catalogInfo?.slug || categoryId,
      imageUrl: catalogInfo?.imageUrl,
      products: data.products || [],
      totalProducts: data.total,
    };

    return showcase;
  } catch (error) {
    console.error(`Error fetching catalog showcase for ${categoryId}:`, error);
    return null;
  }
}

/**
 * Загружает витрины для всех доступных категорий
 * @param categoryIds - Массив ID категорий для загрузки
 * @param itemsPerShowcase - Количество товаров в каждой витрине
 * @returns Promise с массивом витрин (фильтрует неудачные загрузки)
 */
export async function fetchAllCatalogShowcases(
  categoryIds: string[],
  itemsPerShowcase: number = 4,
): Promise<CatalogShowcase[]> {
  try {
    // Параллельная загрузка всех витрин
    const showcasePromises = categoryIds.map(categoryId =>
      fetchCatalogShowcase(categoryId, itemsPerShowcase),
    );

    const showcases = await Promise.all(showcasePromises);

    // Фильтруем null значения (неудачные загрузки)
    return showcases.filter(
      (showcase): showcase is CatalogShowcase => showcase !== null,
    );
  } catch (error) {
    console.error('Error fetching all catalog showcases:', error);
    return [];
  }
}

/**
 * Загружает витрины для главной страницы (используя предопределенные категории)
 * @param itemsPerShowcase - Количество товаров в каждой витрине
 * @returns Promise с массивом витрин
 */
export async function fetchHomePageShowcases(
  itemsPerShowcase: number = 4,
): Promise<CatalogShowcase[]> {
  // Получаем все доступные категории из констант
  const categoryIds = Object.values(CatalogId);

  return fetchAllCatalogShowcases(categoryIds, itemsPerShowcase);
}
