import { MetadataRoute } from 'next';

/**
 * Генерирует динамический sitemap для улучшения индексации поисковиками
 *
 * Особенности:
 * - Автоматически включает все статические страницы
 * - Динамически добавляет страницы товаров и категорий
 * - Устанавливает приоритеты и частоту обновления
 * - Поддерживает многоязычность
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
    // Получаем категории товаров
    const categoriesResponse = await fetch(
      `${process.env.API_BASE_URL || baseUrl}/api/categories`,
    );

    let categories = [];
    if (categoriesResponse.ok) {
      try {
        const categoriesData = await categoriesResponse.json();
        // Проверяем, что данные - это массив
        categories = Array.isArray(categoriesData) ? categoriesData : [];
      } catch (error) {
        console.error('Error parsing categories response:', error);
        categories = [];
      }
    }

    // Добавляем страницы категорий только если есть массив
    const categoryPages: MetadataRoute.Sitemap = categories.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (category: any) => ({
        url: `${baseUrl}/catalog/${encodeURIComponent(category.id)}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }),
    );

    // Получаем список всех товаров (в реальном приложении с пагинацией)
    const productsResponse = await fetch(
      `${process.env.API_BASE_URL || baseUrl}/api/products?limit=1000`,
    );

    let products = [];
    if (productsResponse.ok) {
      try {
        const productsData = await productsResponse.json();
        // Проверяем структуру данных
        products = Array.isArray(productsData?.products)
          ? productsData.products
          : [];
      } catch (error) {
        console.error('Error parsing products response:', error);
        products = [];
      }
    }

    // Добавляем страницы товаров только если есть массив
    const productPages: MetadataRoute.Sitemap = products.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (product: any) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(
          product.updatedAt || product.createdAt || new Date(),
        ),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }),
    );

    return [...staticPages, ...categoryPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Возвращаем только статические страницы в случае ошибки
    return staticPages;
  }
}
