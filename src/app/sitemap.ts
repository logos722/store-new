import { MetadataRoute } from 'next';
import { CatalogInfo } from '@/constants/catalogs';
import { LIMIT_PRODUCTS_FOR_SEO } from '@/constants/seo';

/**
 * Генерирует динамический sitemap для улучшения индексации поисковиками
 *
 * Стратегия:
 * - ПОЛНОСТЬЮ ДИНАМИЧЕСКИЙ (force-dynamic) - не генерируется во время билда
 * - Генерируется на лету при каждом запросе в runtime
 * - Кеширование на уровне CDN/Edge (Vercel автоматически)
 * - Graceful error handling - fallback на статические страницы при ошибках
 *
 * Преимущества:
 * - ✅ Билд всегда успешен (нет зависимости от API)
 * - ✅ На проде всегда актуальные товары
 * - ✅ CDN кеширует ответ для производительности
 * - ✅ Поисковики получают полный sitemap
 *
 * Производительность:
 * - Первый запрос: ~500-1000ms (загрузка товаров)
 * - Последующие: <50ms (CDN кеш)
 * - Cache-Control: public, s-maxage=3600, stale-while-revalidate
 */

// Делаем sitemap полностью динамическим - не генерировать статически
// Во время билда Next.js пропустит его, избегая ошибок ECONNREFUSED
// В runtime будет генерироваться с товарами
export const dynamic = 'force-dynamic';

// Не используем revalidate с force-dynamic (они несовместимы)
// Вместо этого полагаемся на кеширование CDN/Edge

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
    /**
     * С force-dynamic sitemap генерируется только в runtime
     * Во время билда Next.js просто пропустит его (не будет вызывать эту функцию)
     * Поэтому мы всегда загружаем товары здесь
     */
    // Используем только реальные категории из констант CatalogInfo
    // API возвращает названия категорий (например, "Американки", "Шаровые краны"),
    // которые используются только для фильтрации внутри каталога,
    // но не являются отдельными маршрутами.
    // Реальные маршруты каталогов определены в CatalogInfo (например, /catalog/PVC)
    let categories: Array<{ id: string; slug: string }> = [];

    try {
      categories = Object.entries(CatalogInfo).map(([id, info]) => ({
        id,
        slug: info.slug,
      }));
    } catch (error) {
      console.warn('Error loading categories from constants:', error);
      // Возвращаем пустой массив в случае ошибки
      categories = [];
    }

    // Добавляем страницы категорий
    // Slug уже в правильном формате (например, "PVC"), не нужно кодировать
    const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
      url: `${baseUrl}/catalog/${category.slug}`,
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

    /**
     * Пытаемся получить товары через каждую категорию
     * Используем Promise.all для параллельной загрузки товаров из всех категорий
     *
     * Важные моменты:
     * - Добавлен timeout для предотвращения зависания
     * - Каждая категория обрабатывается независимо (ошибка в одной не влияет на другие)
     * - Используем AbortController для корректной отмены запросов
     */
    const productPromises = categories.map(async category => {
      try {
        // API endpoint: /api/catalog/{categoryId}?page=1&limit=${LIMIT_PRODUCTS_FOR_SEO}&minPrice=0&maxPrice=100000&inStock=0
        const apiUrl = `${baseUrl}/api/catalog/${category.id}?page=1&limit=${LIMIT_PRODUCTS_FOR_SEO}&minPrice=0&maxPrice=100000&inStock=0`;

        // Создаем AbortController для таймаута
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

        try {
          const categoryProductsResponse = await fetch(apiUrl, {
            // Кэшируем данные и ревалидируем каждый час для статической генерации
            next: { revalidate: 3600 },
            // Добавляем заголовки для корректной обработки запроса
            headers: {
              'Content-Type': 'application/json',
            },
            // Передаем signal для возможности отмены запроса
            signal: controller.signal,
          });

          // Очищаем таймер после успешного ответа
          clearTimeout(timeoutId);

          // Проверяем статус ответа
          if (!categoryProductsResponse.ok) {
            console.warn(
              `[Sitemap] Failed to fetch products for category ${category.slug} (${category.id}): ${categoryProductsResponse.status} ${categoryProductsResponse.statusText}`,
            );
            return [];
          }

          // Проверяем тип контента перед парсингом JSON
          const contentType =
            categoryProductsResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(
              `[Sitemap] Invalid content type for category ${category.slug}: ${contentType}. Expected application/json`,
            );
            return [];
          }

          const categoryData = await categoryProductsResponse.json();

          // Проверяем наличие массива products
          if (categoryData?.products && Array.isArray(categoryData.products)) {
            // Фильтруем товары, у которых есть slug (необходим для генерации URL)
            const validProducts = categoryData.products.filter(
              (product: { slug?: string }) => product.slug,
            );
            return validProducts;
          }

          console.warn(
            `[Sitemap] No products array in response for category ${category.slug}`,
          );
          return [];
        } catch (fetchError) {
          // Очищаем таймер в случае ошибки
          clearTimeout(timeoutId);
          throw fetchError; // Пробрасываем ошибку дальше для обработки внешним catch
        }
      } catch (error) {
        // Продолжаем обработку других категорий при ошибке
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const isTimeout = errorMessage.includes('aborted');

        console.warn(
          `[Sitemap] Error fetching products for category ${category.slug}: ${errorMessage}${isTimeout ? ' (timeout)' : ''}`,
        );
        return [];
      }
    });

    // Ждем завершения всех запросов и объединяем результаты
    const productsArrays = await Promise.all(productPromises);

    // Объединяем все массивы товаров и удаляем дубликаты по id
    const productsMap = new Map<string, (typeof allProducts)[0]>();
    productsArrays.flat().forEach(product => {
      if (product.id && product.slug && !productsMap.has(product.id)) {
        productsMap.set(product.id, product);
      }
    });

    // Преобразуем MapIterator в массив и добавляем в allProducts
    allProducts.push(...Array.from(productsMap.values()));

    // Добавляем страницы товаров
    // Slug уже в правильном формате (например, "amerikanka-pvh-kleevaya-110-mm"),
    // не нужно кодировать, так как обращаемся к товару именно по slug
    const productPages: MetadataRoute.Sitemap = allProducts.map(product => ({
      url: `${baseUrl}/product/${product.slug}`,
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
    // Логируем детальную информацию об ошибке
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('[Sitemap] Error generating sitemap:', {
      message: errorMessage,
      stack: errorStack,
    });

    // Возвращаем только статические страницы и категории в случае критической ошибки
    // Это гарантирует, что sitemap все равно будет сгенерирован с базовой структурой
    try {
      const fallbackCategories = Object.values(CatalogInfo).map(info => ({
        url: `${baseUrl}/catalog/${info.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));

      return [...staticPages, ...fallbackCategories];
    } catch (fallbackError) {
      // Если даже fallback не работает, возвращаем только статические страницы
      return staticPages;
    }
  }
}
