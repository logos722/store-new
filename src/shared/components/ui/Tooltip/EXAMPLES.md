# Tooltip - Примеры использования

## 1. Базовый пример с обрезанным текстом

```tsx
import { useRef } from 'react';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';
import styles from './styles.module.scss';

function ProductCard({ product }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isTruncated = useTruncationDetection(titleRef, product.name);

  return (
    <div className={styles.card}>
      <Tooltip content={product.name} disabled={!isTruncated} position="top">
        <h3 ref={titleRef} className={styles.truncatedTitle}>
          {product.name}
        </h3>
      </Tooltip>
    </div>
  );
}
```

**CSS для truncation:**

```scss
.truncatedTitle {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## 2. Простой тултип без truncation detection

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

function InfoIcon() {
  return (
    <Tooltip content="Дополнительная информация о функции" position="right">
      <button className="info-icon">
        <InfoIcon />
      </button>
    </Tooltip>
  );
}
```

---

## 3. Тултип с кастомной задержкой

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

function QuickHelp() {
  return (
    <Tooltip
      content="Подсказка появится быстро"
      delay={100} // Быстрое появление
    >
      <span>Наведи на меня</span>
    </Tooltip>
  );
}

function DetailedHelp() {
  return (
    <Tooltip
      content="Подробная информация появится с задержкой"
      delay={800} // Медленное появление
    >
      <span>Подробности</span>
    </Tooltip>
  );
}
```

---

## 4. Тултип в разных позициях

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

function PositionExamples() {
  return (
    <div className="examples">
      <Tooltip content="Показывается сверху" position="top">
        <button>Top</button>
      </Tooltip>

      <Tooltip content="Показывается снизу" position="bottom">
        <button>Bottom</button>
      </Tooltip>

      <Tooltip content="Показывается слева" position="left">
        <button>Left</button>
      </Tooltip>

      <Tooltip content="Показывается справа" position="right">
        <button>Right</button>
      </Tooltip>
    </div>
  );
}
```

---

## 5. Условное отключение тултипа

```tsx
import { useState } from 'react';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

function ConditionalTooltip({ user }) {
  // Показываем тултип только если есть дополнительная информация
  const hasExtraInfo = user.bio && user.bio.length > 0;

  return (
    <Tooltip content={user.bio || ''} disabled={!hasExtraInfo}>
      <div className="user-name">{user.name}</div>
    </Tooltip>
  );
}
```

---

## 6. Тултип с длинным многострочным текстом

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

function DescriptionWithTooltip({ item }) {
  const fullDescription = `
    ${item.title}
    
    Категория: ${item.category}
    Цена: ${item.price} ₽
    В наличии: ${item.inStock ? 'Да' : 'Нет'}
  `.trim();

  return (
    <Tooltip content={fullDescription}>
      <div className="item-preview">{item.title}</div>
    </Tooltip>
  );
}
```

---

## 7. Тултип в списке элементов

```tsx
import { useRef } from 'react';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductListItem({ product }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTruncated = useTruncationDetection(titleRef, product.name);

  return (
    <div className="product-item">
      <Tooltip content={product.name} disabled={!isTruncated}>
        <div ref={titleRef} className="product-name">
          {product.name}
        </div>
      </Tooltip>
      <div className="product-price">{product.price} ₽</div>
    </div>
  );
}
```

---

## 8. Тултип с кастомным стилем

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import styles from './custom.module.scss';

function CustomStyledTooltip() {
  return (
    <Tooltip
      content="Тултип с кастомным стилем"
      className={styles.customTooltipWrapper}
    >
      <span>Кастомный стиль</span>
    </Tooltip>
  );
}
```

**CSS:**

```scss
.customTooltipWrapper {
  // Можно добавить кастомные стили для wrapper
  display: inline-flex;
  align-items: center;

  // Кастомизация самого тултипа через глобальные селекторы
  :global(.tooltip) {
    background-color: #2c3e50;
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
  }
}
```

---

## 9. Тултип в GridProductCard (полный пример)

```tsx
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import styles from './GridProductCard.module.scss';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

interface ProductCardProps {
  product: Product;
}

const GridProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isTitleTruncated = useTruncationDetection(titleRef, product.name);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        {/* Тултип автоматически определяет, нужен ли он */}
        <Tooltip
          content={product.name}
          disabled={!isTitleTruncated}
          position="top"
          delay={200}
        >
          <h3 ref={titleRef} className={styles.title}>
            {product.name}
          </h3>
        </Tooltip>

        <div className={styles.price}>{product.price.toFixed(2)} ₽</div>
      </div>
    </div>
  );
};

export default GridProductCard;
```

---

## 10. Тултип с проверкой нескольких зависимостей

```tsx
import { useRef, useState } from 'react';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

function ResponsiveCard({ title }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  // Пересчитываем truncation при изменении isExpanded
  const isTruncated = useTruncationDetection(titleRef, title, [isExpanded]);

  return (
    <div className={isExpanded ? 'card-expanded' : 'card-collapsed'}>
      <Tooltip content={title} disabled={!isTruncated}>
        <div ref={titleRef} className="title">
          {title}
        </div>
      </Tooltip>

      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Свернуть' : 'Развернуть'}
      </button>
    </div>
  );
}
```

---

## Best Practices

### ✅ DO:

- Используйте `useTruncationDetection` для показа тултипа только когда нужно
- Устанавливайте разумную задержку (`delay`) для desktop (200-300ms)
- Проверяйте работу на мобильных устройствах
- Используйте семантически правильные элементы

### ❌ DON'T:

- Не показывайте тултип для всего текста без проверки truncation
- Не используйте слишком длинный текст в тултипах
- Не забывайте про `ref` при использовании `useTruncationDetection`
- Не перегружайте страницу тултипами (UX!)

---

## Troubleshooting

### Тултип не показывается

1. Проверьте, что `disabled !== true`
2. Убедитесь, что `content` не пустой
3. Для desktop проверьте задержку (`delay`)
4. Для mobile убедитесь, что onClick не блокируется

### useTruncationDetection всегда возвращает false

1. Проверьте, что ref правильно присвоен элементу
2. Убедитесь, что CSS для truncation применен
3. Проверьте, что элемент имеет фиксированную ширину

### Тултип показывается в неправильном месте

1. Проверьте `position` prop
2. Убедитесь, что родительские элементы не имеют `overflow: hidden`
3. На мобильных проверьте viewport размеры
