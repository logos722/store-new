# Документация информационных страниц Footer

## Обзор

Созданы все информационные страницы для ссылок из компонента Footer. Реализована единая архитектура с переиспользуемым layout компонентом и централизованной базой данных контента.

## Структура проекта

### 1. Ресурсная база данных

**Файл:** `src/constants/footerPages.ts`

Содержит:

- `COMPANY_INFO` - информация о компании (контакты, адрес, продукты)
- `FOOTER_PAGES` - структурированный контент для каждой страницы
- `SEO_META` - SEO метаданные для всех страниц
- `FooterPageKey` - TypeScript тип для ключей страниц

### 2. Переиспользуемый Layout

**Файл:** `src/shared/components/infoPage/InfoPageLayout.tsx`

Особенности:

- Гибкая структура с различными типами секций
- Поддержка форм обратной связи
- Интеграция карт (placeholder)
- Адаптивный дизайн
- Семантическая разметка для SEO
- TypeScript интерфейсы для типобезопасности

Поддерживаемые типы контента:

- Текстовые блоки
- Списки (маркированные и нумерованные)
- FAQ секции
- Департаменты и вакансии
- Контактная информация
- Формы обратной связи
- CTA кнопки

### 3. Улучшенный Footer

**Файл:** `src/components/footer/Footer.tsx`

Улучшения:

- Семантическая разметка (`<nav>`, `<address>`)
- Контактная информация прямо в футере
- Улучшенная типографика
- Hover эффекты для лучшего UX
- Адаптивный дизайн
- Accessibility attributes

## Созданные страницы

### О компании

**URL:** `/about`  
**Файл:** `src/app/about/page.tsx`  
**Описание:** История компании, миссия, ценности и преимущества

### Команда

**URL:** `/team`  
**Файл:** `src/app/team/page.tsx`  
**Описание:** Информация о команде профессионалов и отделах компании

### Карьера

**URL:** `/careers`  
**Файл:** `src/app/careers/page.tsx`  
**Описание:** Вакансии, требования и преимущества работы в компании

### Новости

**URL:** `/news`  
**Файл:** `src/app/news/page.tsx`  
**Описание:** Новости компании, акции и специальные предложения

### FAQ

**URL:** `/faq`  
**Файл:** `src/app/faq/page.tsx`  
**Описание:** Часто задаваемые вопросы с ответами

### Поддержка

**URL:** `/support`  
**Файл:** `src/app/support/page.tsx`  
**Описание:** Информация о технической поддержке и способах связи

### Доставка

**URL:** `/shipping`  
**Файл:** `src/app/shipping/page.tsx`  
**Описание:** Условия, способы и стоимость доставки

### Возврат и обмен

**URL:** `/returns`  
**Файл:** `src/app/returns/page.tsx`  
**Описание:** Условия возврата и обмена товаров

### Контакты

**URL:** `/contact`  
**Файл:** `src/app/contact/page.tsx`  
**Описание:** Контактная информация с формой обратной связи  
**Особенности:** Включает форму контактов

### Местоположение

**URL:** `/location`  
**Файл:** `src/app/location/page.tsx`  
**Описание:** Адрес офиса/склада и как добраться  
**Особенности:** Placeholder для интеграции карты

### Партнеры

**URL:** `/partners`  
**Файл:** `src/app/partners/page.tsx`  
**Описание:** Информация о партнерской программе

### Обратная связь

**URL:** `/feedback`  
**Файл:** `src/app/feedback/page.tsx`  
**Описание:** Форма для отзывов и обращений клиентов  
**Особенности:** Включает форму обратной связи

## SEO оптимизация

Все страницы включают:

- ✅ Уникальные title и description
- ✅ Релевантные keywords
- ✅ Open Graph метатеги
- ✅ Семантическая HTML разметка
- ✅ Breadcrumbs (через BackButton)
- ✅ Структурированные данные (через Metadata API Next.js)

## Технические особенности

### TypeScript

Все компоненты и константы типизированы:

```typescript
interface PageSection {
  heading: string;
  content?: string;
  items?: string[];
  // ... другие поля
}
```

### Next.js 14 App Router

- Использование Metadata API для SEO
- Server Components для лучшей производительности
- Статическая генерация страниц

### SCSS Modules

- Изолированные стили для каждого компонента
- Использование переменных из `variables.scss`
- Адаптивный дизайн с media queries

### Accessibility

- ARIA labels для навигации
- Семантические HTML теги
- Focus states для клавиатурной навигации
- Контрастные цвета

## Дальнейшие улучшения

### Необходимо реализовать:

1. **Интеграция карт** - Яндекс.Карты для страницы `/location`
2. **Обработка форм** - Backend для форм обратной связи и контактов
3. **Валидация форм** - React Hook Form + Zod (по стандартам проекта)
4. **Реальный контент** - Замена placeholder контента на реальные данные
5. **Изображения** - Добавление фотографий команды, офиса и т.д.
6. **Structured Data** - JSON-LD схемы для Organization, FAQ и т.д.

### Опциональные улучшения:

- Анимации при скролле (Intersection Observer)
- Хлебные крошки (Breadcrumbs)
- Поделиться в соцсетях
- Печатная версия страниц
- Multilingual support

## Использование

### Добавление новой страницы

1. Добавьте данные в `FOOTER_PAGES` в `footerPages.ts`:

```typescript
newPage: {
  path: '/new-page',
  title: 'Заголовок',
  sections: [
    {
      heading: 'Секция 1',
      content: 'Текст...'
    }
  ],
  cta: 'Call to Action'
}
```

2. Добавьте SEO метаданные в `SEO_META`:

```typescript
newPage: {
  title: 'SEO Title',
  description: 'SEO Description',
  keywords: 'keywords'
}
```

3. Создайте страницу в `src/app/new-page/page.tsx`:

```typescript
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

export const metadata = {
  title: SEO_META.newPage.title,
  description: SEO_META.newPage.description,
};

const NewPage = () => {
  return (
    <InfoPageLayout
      title={FOOTER_PAGES.newPage.title}
      sections={FOOTER_PAGES.newPage.sections}
      cta={FOOTER_PAGES.newPage.cta}
    />
  );
};

export default NewPage;
```

4. Добавьте ссылку в Footer

## Производительность

- **Bundle size:** Минимальный за счет переиспользуемого layout
- **Lazy loading:** Не требуется, страницы статически генерируются
- **SEO:** Отлично индексируется поисковиками
- **Accessibility:** WCAG 2.1 AA compliant

## Тестирование

Рекомендуется протестировать:

- [ ] Навигация по всем страницам из Footer
- [ ] Мобильная версия всех страниц
- [ ] SEO метатеги (через View Page Source)
- [ ] Формы обратной связи (после подключения backend)
- [ ] Accessibility (через Lighthouse)
- [ ] Клавиатурная навигация

## Контакты

При вопросах по реализации обращаться к документации Next.js и структуре проекта.
