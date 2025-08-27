# 🚨 Быстрые исправления

## Проблемы с SEO компонентами

### ❌ "export metadata from 'use client'"

```tsx
'use client';

// ❌ Убираем это
// export const metadata: Metadata = { ... };

// ✅ Используем это
import SEOHead from '@/shared/components/seo/SEOHead';

<SEOHead title="Заголовок" description="Описание" noindex={true} />;
```

### ❌ "Cannot find module 'critters'"

В `next.config.js`:

```javascript
experimental: {
  // optimizeCss: true, // Отключить
  scrollRestoration: true,
},
```

### ❌ "Cannot find module '@/stores/useFavoritesStore'"

Исправить путь:

```tsx
// ❌ Неправильно
import { useFavoritesStore } from '@/stores/useFavoritesStore';

// ✅ Правильно
import { useFavoritesStore } from '@/store/useFavoritesStore';
```

### ❌ "generateOrganizationSchema is on the client"

```tsx
// ❌ В серверном компоненте
import { StructuredDataGenerator } from '@/shared/components/seo/StructuredData';

// ✅ В серверном компоненте
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
```

### ❌ "NextRouter was not mounted"

```tsx
// ❌ Старый импорт
import { useRouter } from 'next/router';
const router = useRouter();
const path = router.asPath;

// ✅ Новый импорт
import { usePathname } from 'next/navigation';
const pathname = usePathname();
```

### ❌ "Invalid URL: process.env.NEXT_PUBLIC_BASE_URL"

Создайте `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Или используйте fallback:

```tsx
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
```

### ❌ "Failed to execute 'showPopover'" (бесконечные ошибки)

Замените обычные порталы на безопасные:

```tsx
// ❌ Проблемный код
import ReactDOM from 'react-dom';
{
  isOpen && ReactDOM.createPortal(<div>Content</div>, document.body);
}

// ✅ Безопасное решение
import SafePortal from '@/shared/components/ui/SafePortal';
{
  isOpen && (
    <SafePortal>
      <div>Content</div>
    </SafePortal>
  );
}
```

## Правила использования

| Тип компонента | Metadata                | Structured Data        | SEO Head     |
| -------------- | ----------------------- | ---------------------- | ------------ |
| **Серверный**  | `export const metadata` | `ServerStructuredData` | ❌           |
| **Клиентский** | ❌                      | `StructuredData`       | ✅ `SEOHead` |

## Быстрая проверка

1. **Есть ли `'use client'`?**

   - Да → Используйте `SEOHead`
   - Нет → Используйте `export const metadata`

2. **Ошибка с critters?**

   - Отключите `optimizeCss: true` в `next.config.js`

3. **Ошибка с путями?**
   - Проверьте `@/store/` vs `@/stores/`
   - Проверьте серверные vs клиентские импорты
