# Устранение неполадок SEO оптимизации

## ❌ Ошибка: "Cannot read properties of undefined (reading 'organizationSchema')"

### Описание проблемы

Ошибка возникает при попытке использовать клиентские компоненты структурированных данных в серверных компонентах Next.js 13+.

```
Error: Attempted to call generateOrganizationSchema() from the server but generateOrganizationSchema is on the client.
```

### Причина

В Next.js 13+ с App Router существует четкое разделение между серверными и клиентскими компонентами:

- **Серверные компоненты** выполняются на сервере во время рендеринга
- **Клиентские компоненты** (с директивой `'use client'`) выполняются в браузере
- Нельзя вызывать клиентские функции из серверных компонентов

### ✅ Решение

Созданы отдельные версии для серверных и клиентских компонентов:

#### 1. Серверные утилиты (`src/shared/utils/structuredData.ts`)

```tsx
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';

// В серверном компоненте
export default async function HomePage() {
  const organizationSchema =
    ServerStructuredDataGenerator.generateOrganizationSchema();
  // ...
}
```

#### 2. Серверный компонент (`src/shared/components/seo/ServerStructuredData.tsx`)

```tsx
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';

// Использование в серверном компоненте
<ServerStructuredData data={[organizationSchema, websiteSchema]} />;
```

#### 3. Клиентские компоненты (`src/shared/components/seo/StructuredData.tsx`)

```tsx
'use client';

import StructuredData, {
  StructuredDataGenerator,
} from '@/shared/components/seo/StructuredData';

// Использование в клиентском компоненте
export default function ClientComponent() {
  const schema = StructuredDataGenerator.generateOrganizationSchema();
  return <StructuredData data={schema} />;
}
```

## ❌ Ошибка: "You are attempting to export metadata from a component marked with 'use client'"

### Описание проблемы

Ошибка возникает при попытке экспортировать `metadata` из клиентского компонента в Next.js 13+ App Router.

```
Error: You are attempting to export "metadata" from a component marked with "use client"
```

### Причина

В Next.js 13+ App Router нельзя экспортировать `metadata` из компонентов, помеченных директивой `'use client'`. Metadata API работает только в серверных компонентах.

### ✅ Решение

**Вариант 1: Используйте SEOHead в клиентских компонентах**

```tsx
'use client';

import SEOHead from '@/shared/components/seo/SEOHead';

// ❌ Неправильно - нельзя экспортировать metadata в клиентском компоненте
// export const metadata: Metadata = { ... };

export default function ClientPage() {
  return (
    <>
      {/* ✅ Правильно - используйте SEOHead */}
      <SEOHead
        title="Заголовок страницы"
        description="Описание страницы"
        noindex={true}
        nofollow={true}
      />
      {/* Контент */}
    </>
  );
}
```

**Вариант 2: Преобразуйте в серверный компонент**

Если компонент не использует состояние или хуки, уберите `'use client'` и используйте Metadata API:

```tsx
// Убираем 'use client'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Заголовок страницы',
  description: 'Описание страницы',
};

export default function ServerPage() {
  // Серверный компонент без состояния
  return <div>Контент</div>;
}
```

## ❌ Ошибка: "Cannot find module 'critters'"

### Описание проблемы

Ошибка возникает при включенной экспериментальной функции `optimizeCss` в `next.config.js`.

```
Error: Cannot find module 'critters'
```

### Причина

Функция `optimizeCss` требует дополнительный пакет `critters` для оптимизации CSS, который не устанавливается автоматически.

### ✅ Решение

**Вариант 1: Установить пакет critters**

```bash
npm install critters --save-dev
```

**Вариант 2: Отключить optimizeCss**

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    // optimizeCss: true, // Отключаем
    scrollRestoration: true,
  },
};
```

## ❌ Ошибка: "NextRouter was not mounted"

### Описание проблемы

Ошибка возникает при использовании старого импорта `useRouter` из `next/router` в Next.js 13+ App Router.

```
Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
```

### Причина

В Next.js 13+ App Router изменился способ работы с роутингом. Старый `useRouter` из `next/router` не работает в новой архитектуре.

### ✅ Решение

**Замените импорты на новые хуки из `next/navigation`:**

```tsx
// ❌ Старый способ (Next.js 12)
import { useRouter } from 'next/router';

const router = useRouter();
const pathname = router.pathname;
const query = router.query;

// ✅ Новый способ (Next.js 13+ App Router)
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const pathname = usePathname();
const searchParams = useSearchParams();
const router = useRouter(); // Только для навигации (push, replace)
```

**Миграция методов:**

| Next.js 12 (`next/router`) | Next.js 13+ (`next/navigation`) |
| -------------------------- | ------------------------------- |
| `router.pathname`          | `usePathname()`                 |
| `router.query`             | `useSearchParams()`             |
| `router.asPath`            | `usePathname()`                 |
| `router.push()`            | `router.push()` (остался)       |
| `router.replace()`         | `router.replace()` (остался)    |
| `router.back()`            | `router.back()` (остался)       |

**Пример обновления компонента:**

```tsx
'use client';

// ❌ Старый код
import { useRouter } from 'next/router';

export default function MyComponent() {
  const router = useRouter();
  const currentPath = router.asPath;
  const queryParams = router.query;

  return <div>Path: {currentPath}</div>;
}

// ✅ Новый код
import { usePathname, useSearchParams } from 'next/navigation';

export default function MyComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return <div>Path: {pathname}</div>;
}
```

## ❌ Ошибка: "Invalid URL: process.env.NEXT_PUBLIC_BASE_URL"

### Описание проблемы

Ошибка возникает когда переменная окружения `NEXT_PUBLIC_BASE_URL` не определена или имеет некорректное значение.

```
Error: Invalid URL: process.env.NEXT_PUBLIC_BASE_URL
```

### Причина

1. Переменная `NEXT_PUBLIC_BASE_URL` не определена в файле `.env.local`
2. Значение переменной не является корректным URL (отсутствует протокол)
3. Переменная имеет значение `undefined`

### ✅ Решение

**1. Создайте файл `.env.local` в корне проекта:**

```env
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_IMAGE_HOST=http://localhost:5000
```

**2. Для продакшена используйте HTTPS:**

```env
# .env.production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**3. Добавьте fallback в коде:**

```tsx
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
```

**4. Проверьте формат URL:**

- ✅ `https://example.com`
- ✅ `http://localhost:3000`
- ❌ `example.com` (без протокола)
- ❌ `undefined`

### 💡 Дополнительно

Используйте файл `env.example` как шаблон:

```bash
cp env.example .env.local
```

## ❌ Ошибка: "Failed to execute 'showPopover' on 'HTMLElement': Invalid on disconnected popover elements"

### Описание проблемы

Бесконечные сообщения об ошибке в консоли, связанные с попытками показать popover на отключенных от DOM элементах.

```
canvas.js:84 Uncaught InvalidStateError: Failed to execute 'showPopover' on 'HTMLElement': Invalid on disconnected popover elements
```

### Причина

1. **React Portal проблемы**: `ReactDOM.createPortal` создает элементы, которые могут быть отключены от DOM до завершения операций
2. **Гидратация Next.js**: Несоответствие между серверным и клиентским рендерингом
3. **Браузерные расширения**: Некоторые расширения могут вмешиваться в DOM
4. **Несовместимость библиотек**: Конфликты между версиями React/Next.js и UI библиотеками

### ✅ Решение

**1. Используйте безопасный портал:**

Создан компонент `SafePortal` который проверяет подключение к DOM:

```tsx
// src/shared/components/ui/SafePortal.tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SafePortal = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const targetContainer = container || document.body;

    if (targetContainer && targetContainer.isConnected) {
      setPortalContainer(targetContainer);
      setMounted(true);
    }

    return () => {
      setMounted(false);
      setPortalContainer(null);
    };
  }, [container]);

  if (!mounted || !portalContainer) return null;

  try {
    if (!portalContainer.isConnected) return null;
    return createPortal(children, portalContainer);
  } catch (error) {
    console.error('Error creating portal:', error);
    return null;
  }
};
```

**2. Замените обычные порталы:**

```tsx
// ❌ Старый способ
import ReactDOM from 'react-dom';

{
  isOpen && ReactDOM.createPortal(<div>Content</div>, document.body);
}

// ✅ Новый способ
import SafePortal from '@/shared/components/ui/SafePortal';

{
  isOpen && (
    <SafePortal>
      <div>Content</div>
    </SafePortal>
  );
}
```

**3. Добавьте проверки монтирования:**

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  return () => setMounted(false);
}, []);

if (!mounted) return null;
```

**4. Отключите проблемные браузерные расширения:**

- Canvas Blocker
- uBlock Origin (временно)
- Другие расширения, модифицирующие DOM

### 💡 Профилактика

- Всегда проверяйте `isConnected` перед DOM операциями
- Используйте `useEffect` для клиентских операций
- Добавляйте проверки `typeof document !== 'undefined'`
- Правильно очищайте event listeners и порталы

## ❌ Ошибка: 404 на статические ресурсы (favicon, иконки, шрифты)

### Описание проблемы

Браузер автоматически запрашивает стандартные ресурсы, которые могут отсутствовать:

```
GET /favicon.ico 404
GET /apple-touch-icon.png 404
GET /fonts/montserrat.woff2 404
GET /.well-known/appspecific/com.chrome.devtools.json 404
```

### Причина

1. **Отсутствующие иконки** - браузеры автоматически ищут favicon и PWA иконки
2. **Chrome DevTools** - расширения браузера делают служебные запросы
3. **Шрифты** - неправильные пути к шрифтовым файлам
4. **PWA манифест** - отсутствующие ресурсы для Progressive Web App

### ✅ Решение

**1. Создайте необходимые иконки:**

```
public/
├── favicon.ico          # 16x16, 32x32, 48x48 ICO
├── favicon.svg          # SVG иконка
├── favicon-16x16.png    # 16x16 PNG
├── favicon-32x32.png    # 32x32 PNG
├── apple-touch-icon.png # 180x180 PNG для iOS
└── site.webmanifest     # PWA манифест
```

**2. Добавьте редиректы в next.config.js:**

```javascript
async redirects() {
  return [
    // Блокируем Chrome DevTools запросы
    {
      source: '/.well-known/appspecific/:path*',
      destination: '/404',
      permanent: false,
    },
  ];
}
```

**3. Используйте AssetErrorHandler компонент:**

Автоматически обрабатывает ошибки загрузки ресурсов в development режиме.

```tsx
// В layout.tsx уже добавлен:
<AssetErrorHandler />
```

**4. Правильные пути к шрифтам:**

```tsx
// ✅ Используйте next/font/google
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
});
```

### 💡 Генерация иконок

Используйте онлайн генераторы:

- [Favicon Generator](https://favicon.io/)
- [PWA Asset Generator](https://tools.crawlink.com/tools/pwa-icon-generator/)
- [Real Favicon Generator](https://realfavicongenerator.net/)

## ❌ Ошибка: Chrome DevTools JSON requests

### Описание проблемы

Chrome DevTools и расширения браузера делают автоматические запросы:

```
GET /.well-known/appspecific/com.chrome.devtools.json 404
```

### ✅ Решение

**Вариант 1: Игнорирование (рекомендуется)**

Добавлен `AssetErrorHandler` который подавляет эти ошибки в консоли.

**Вариант 2: Создание заглушки**

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/.well-known/appspecific/:path*',
      destination: '/api/chrome-devtools',
    },
  ];
}
```

```javascript
// pages/api/chrome-devtools.js
export default function handler(req, res) {
  res.status(200).json({});
}
```

**Вариант 3: Блокировка запросов**

```javascript
// next.config.js - уже добавлено
async redirects() {
  return [
    {
      source: '/.well-known/appspecific/:path*',
      destination: '/404',
      permanent: false,
    },
  ];
}
```

## 🔧 Другие распространенные ошибки

### Ошибка импорта модулей

**Проблема:** `Cannot find module '@/stores/useFavoritesStore'`

**Решение:** Проверьте правильность путей импорта в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Проблемы с Mongoose в Next.js

**Проблема:** Ошибки при использовании Mongoose в Middleware

**Решение:**

- Не используйте Mongoose в Next.js Middleware (Edge Runtime)
- Перенесите логику базы данных в API routes
- Используйте опциональную цепочку при экспорте моделей:

```javascript
export default mongoose.models?.Organization ||
  mongoose.model('Organization', organizationSchema);
```

### Конфликты с конфигурацией Webpack

**Проблема:** Ошибки при сборке после изменения `next.config.js`

**Решение:** Проверьте правила Webpack, особенно:

```javascript
// Может вызывать проблемы
config.module.rules.push({
  test: /\.m?js$/,
  type: 'javascript/auto',
  resolve: {
    fullySpecified: false,
  },
});
```

### Проблемы с именованием файлов

**Проблема:** Конфликты с системой маршрутизации Next.js

**Решение:**

- Избегайте папок/файлов, начинающихся с "pages" в App Router
- Используйте правильную структуру папок для App Router

## 📋 Чек-лист устранения неполадок

### 1. Проверка серверных/клиентских компонентов

- [ ] Серверные компоненты используют `ServerStructuredDataGenerator`
- [ ] Клиентские компоненты используют `StructuredDataGenerator`
- [ ] Правильные импорты для каждого типа компонентов

### 2. Проверка путей импорта

- [ ] `@/` алиасы настроены в `tsconfig.json`
- [ ] Все пути импорта корректны
- [ ] Нет циклических зависимостей

### 3. Проверка конфигурации Next.js

- [ ] `next.config.js` не содержит проблемных правил Webpack
- [ ] Правильная структура папок App Router
- [ ] Метаданные экспортируются корректно

### 4. Проверка TypeScript

- [ ] Все типы импортированы
- [ ] Интерфейсы соответствуют использованию
- [ ] Нет ошибок TypeScript

## 🚀 Быстрое исправление

Если у вас возникла ошибка с `organizationSchema`, выполните следующие шаги:

1. **Определите тип компонента:**

   - Есть ли `'use client'` в начале файла? → Клиентский компонент
   - Нет директивы? → Серверный компонент

2. **Используйте правильные импорты:**

   ```tsx
   // Для серверных компонентов
   import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
   import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';

   // Для клиентских компонентов
   import StructuredData, {
     StructuredDataGenerator,
   } from '@/shared/components/seo/StructuredData';
   ```

3. **Замените вызовы функций:**

   ```tsx
   // Серверный компонент
   const schema = ServerStructuredDataGenerator.generateOrganizationSchema();

   // Клиентский компонент
   const schema = StructuredDataGenerator.generateOrganizationSchema();
   ```

4. **Используйте правильный компонент:**

   ```tsx
   // Серверный компонент
   <ServerStructuredData data={schema} />

   // Клиентский компонент
   <StructuredData data={schema} />
   ```

## 📞 Поддержка

Если проблема не решена:

1. Проверьте консоль браузера на дополнительные ошибки
2. Убедитесь, что все зависимости установлены
3. Перезапустите сервер разработки (`npm run dev`)
4. Очистите кэш Next.js (`.next` папку)

---

**Важно:** После внесения изменений всегда перезапускайте сервер разработки для применения изменений в конфигурации.
