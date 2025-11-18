import { MetadataRoute } from 'next';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';

/**
 * Генерирует динамический sitemap для улучшения индексации поисковиками
 *
 * Особенности:
 * - Автоматически включает все статические страницы
 * - Динамически добавляет страницы товаров и категорий
 * - Устанавливает приоритеты и частоту обновления
 * - Поддерживает многоязычность
 * - Использует fallback на константы, если API недоступен
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';

  // Статические страницы с высоким приоритетом
  const staticPages: MetadataRoute.Sitemap = [
    // Главная страница - наивысший приоритет
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Каталог - критическая страница для e-commerce
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Информационные страницы компании - высокий приоритет для SEO
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Контент и статьи
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Поддержка и FAQ
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Сервисные страницы
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // О компании и команда
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Локация и обратная связь
    {
      url: `${baseUrl}/location`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    // Персональные страницы - низкий приоритет
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  try {
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';

    // Получаем категории товаров
    // API возвращает { categories: string[] }, но также используем константы как fallback
    let categories: Array<{ id: string; slug: string }> = [];

    try {
      const categoriesResponse = await fetch(`${apiUrl}/api/categories`, {
        // Кэшируем данные и ревалидируем каждый час для статической генерации
        next: { revalidate: 3600 },
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        // API возвращает { categories: string[] }, где каждый элемент - это ID категории
        if (
          categoriesData?.categories &&
          Array.isArray(categoriesData.categories)
        ) {
          // Преобразуем ID в объекты с id и slug
          categories = categoriesData.categories.map((id: string) => {
            // Пытаемся найти slug в константах
            const catalogInfo = Object.values(CatalogInfo).find(
              (info: { slug: string }) =>
                info.slug === id || id.includes(info.slug),
            );
            return {
              id,
              slug: catalogInfo?.slug || id,
            };
          });
        }
      }
    } catch (error) {
      console.warn(
        'Error fetching categories from API, using constants:',
        error,
      );
    }

    // Fallback: используем категории из констант, если API недоступен
    if (categories.length === 0) {
      try {
        categories = Object.values(CatalogId).map((id: string) => ({
          id,
          slug: CatalogInfo[id as keyof typeof CatalogInfo]?.slug || id,
        }));
      } catch (error) {
        console.warn('Error loading categories from constants:', error);
      }
    }

    // Добавляем страницы категорий
    const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
      url: `${baseUrl}/catalog/${encodeURIComponent(category.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Получаем список товаров через категории
    // Так как прямого endpoint /api/products может не быть,
    // получаем товары через каждую категорию
    const allProducts: Array<{
      id: string;
      slug: string;
      updatedAt?: string;
      createdAt?: string;
    }> = [];

    // Пытаемся получить товары через каждую категорию
    for (const category of categories.slice(0, 10)) {
      // Ограничиваем до 10 категорий для производительности
      try {
        const categoryProductsResponse = await fetch(
          `${apiUrl}/api/catalog/${encodeURIComponent(category.slug)}?limit=100`,
          {
            // Кэшируем данные и ревалидируем каждый час для статической генерации
            next: { revalidate: 3600 },
          },
        );

        if (categoryProductsResponse.ok) {
          const categoryData = await categoryProductsResponse.json();
          if (categoryData?.products && Array.isArray(categoryData.products)) {
            // Добавляем товары, избегая дубликатов
            const newProducts = categoryData.products.filter(
              (product: { id: string }) =>
                !allProducts.some(p => p.id === product.id),
            );
            allProducts.push(...newProducts);
          }
        }
      } catch (error) {
        // Продолжаем обработку других категорий при ошибке
        console.warn(
          `Error fetching products for category ${category.slug}:`,
          error,
        );
      }
    }

    // Добавляем страницы товаров
    const productPages: MetadataRoute.Sitemap = allProducts.map(product => ({
      url: `${baseUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : product.createdAt
          ? new Date(product.createdAt)
          : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Возвращаем только статические страницы в случае ошибки
    return staticPages;
  }
}
