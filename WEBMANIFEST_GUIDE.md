# Руководство по настройке Web App Manifest

## Описание

Файл `site.webmanifest` является важной частью Progressive Web App (PWA) и помогает улучшить SEO-показатели сайта. Этот файл сообщает браузерам, как должно вести себя ваше веб-приложение при установке на устройство пользователя.

## Инструкция по установке

### 1. Создание файла site.webmanifest

Создайте файл `public/site.webmanifest` со следующим содержимым:

```json
{
  "name": "Гелион - Трубы, фитинги и системы полива в Краснодаре",
  "short_name": "Гелион",
  "description": "Оптовый и розничный продавец строительных материалов: трубы ПВХ и ПНД, фитинги, системы полива, дренажа и канализации в Краснодаре",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#0066cc",
  "background_color": "#ffffff",
  "lang": "ru-RU",
  "dir": "ltr",
  "categories": ["shopping", "business", "lifestyle"],
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Каталог",
      "short_name": "Каталог",
      "description": "Просмотр каталога товаров",
      "url": "/catalog",
      "icons": [
        {
          "src": "/icons/catalog-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Избранное",
      "short_name": "Избранное",
      "description": "Избранные товары",
      "url": "/favorites",
      "icons": [
        {
          "src": "/icons/favorites-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Корзина",
      "short_name": "Корзина",
      "description": "Корзина покупок",
      "url": "/cart",
      "icons": [
        {
          "src": "/icons/cart-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Контакты",
      "short_name": "Контакты",
      "description": "Связаться с нами",
      "url": "/contact",
      "icons": [
        {
          "src": "/icons/contact-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-home.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Главная страница Гелион"
    },
    {
      "src": "/screenshots/mobile-catalog.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Каталог товаров"
    }
  ],
  "related_applications": [],
  "prefer_related_applications": false,
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

### 2. Добавление ссылки в layout.tsx

Добавьте следующую строку в секцию `<head>` вашего `src/app/layout.tsx`:

```tsx
<link rel="manifest" href="/site.webmanifest" />
```

Пример:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0066cc" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Создание необходимых иконок

Для полноценной работы PWA необходимо создать следующие иконки в директории `public/`:

#### Основные иконки:

- `android-chrome-192x192.png` - 192x192 пикселей
- `android-chrome-512x512.png` - 512x512 пикселей
- `apple-touch-icon.png` - 180x180 пикселей
- `favicon-32x32.png` - 32x32 пикселя
- `favicon-16x16.png` - 16x16 пикселей
- `favicon.ico` - мультиразмерная иконка

#### Иконки для shortcuts (опционально):

Создайте директорию `public/icons/` и добавьте:

- `catalog-96x96.png`
- `favorites-96x96.png`
- `cart-96x96.png`
- `contact-96x96.png`

#### Скриншоты (опционально, но рекомендуется):

Создайте директорию `public/screenshots/` и добавьте:

- `desktop-home.png` - скриншот главной страницы (1920x1080)
- `mobile-catalog.png` - скриншот каталога на мобильном (750x1334)

### 4. Настройка theme_color

Убедитесь, что цвет темы (`#0066cc`) соответствует дизайну вашего сайта. Этот цвет будет использоваться:

- В строке состояния на Android
- В заголовке окна при установке PWA
- В интерфейсе браузера

## Преимущества для SEO

### 1. **Улучшение пользовательского опыта**

- Возможность установки приложения на домашний экран
- Работа в полноэкранном режиме
- Быстрая загрузка через Service Worker

### 2. **Сигналы для поисковых систем**

- Google учитывает наличие Web App Manifest при ранжировании
- Повышает оценку Progressive Web App в Lighthouse
- Улучшает показатели "Mobile-Friendly"

### 3. **Увеличение вовлеченности**

- Пользователи с установленным PWA возвращаются на 50% чаще
- Уменьшается показатель отказов
- Увеличивается время на сайте

### 4. **Индексация как приложение**

- Возможность появления в каталогах PWA
- Лучшая видимость в результатах поиска для мобильных устройств

## Проверка корректности

### 1. Lighthouse Audit

Запустите Lighthouse в Chrome DevTools:

```bash
npm run build
npm run start
# Откройте DevTools > Lighthouse > Generate report
```

Проверьте секцию "PWA" - должны быть соблюдены все критерии.

### 2. Проверка манифеста

Откройте Chrome DevTools:

1. Перейдите на вкладку "Application"
2. Выберите "Manifest" в левом меню
3. Убедитесь, что все поля отображаются корректно

### 3. Онлайн валидаторы

- [Web App Manifest Validator](https://manifest-validator.appspot.com/)
- [PWA Builder](https://www.pwabuilder.com/)

## Дополнительные улучшения

### Service Worker

Для полноценного PWA добавьте Service Worker для кэширования ресурсов и работы офлайн.

### Meta теги

Убедитесь, что в `layout.tsx` есть необходимые meta теги:

```tsx
<meta name="application-name" content="Гелион" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Гелион" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#0066cc" />
```

## Лучшие практики

### 1. **Naming Convention**

- `name` - полное название (до 45 символов)
- `short_name` - короткое название (до 12 символов для домашнего экрана)

### 2. **Icons**

- Минимум: 192x192 и 512x512
- Формат: PNG с прозрачным фоном
- Purpose: "maskable any" для адаптивности

### 3. **Display Modes**

- `standalone` - лучший выбор для e-commerce
- `minimal-ui` - если нужен минимальный UI браузера
- `fullscreen` - для игр и медиа

### 4. **Colors**

- `theme_color` - основной цвет бренда
- `background_color` - цвет splash screen (обычно белый)

## Ссылки и документация

- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [W3C Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Apple Web App Meta Tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

## Чеклист перед запуском

- [ ] Создан файл `public/site.webmanifest`
- [ ] Добавлена ссылка на манифест в `layout.tsx`
- [ ] Созданы все необходимые иконки
- [ ] Цвета темы соответствуют дизайну
- [ ] Проверен манифест в DevTools
- [ ] Пройден Lighthouse PWA audit
- [ ] Протестирована установка PWA на мобильном устройстве
- [ ] Добавлены meta теги для iOS
