# MobileHeaderSearchField

Компонент мобильного поля поиска с анимированным расширением для использования в мобильном хедере.

## Особенности

### 🎨 Анимированное расширение

- В свернутом состоянии показывается только иконка лупы
- При клике на иконку поле расширяется с плавной анимацией
- Автоматический фокус на input при расширении
- Плавное изменение grid структуры родительского контейнера

### 🔍 Поиск

- Debounced поиск (500ms задержка)
- Поиск по категориям (фронтенд)
- Поиск по продуктам (API запрос)
- Отображение результатов в выпадающем списке

### ⌨️ Управление

- **Клик на иконку** - расширение поля поиска
- **Клик на крестик** - сворачивание и очистка
- **Escape** - сворачивание и очистка
- **Клик вне компонента** - автоматическое сворачивание (если поле пустое)

### ✅ Обработка ошибок

- Try-catch для API запросов
- Fallback для ошибок загрузки
- Graceful degradation при отсутствии результатов

### 🚀 Оптимизация

- Debounce для минимизации API запросов
- useRef для предотвращения лишних рендеров
- Эффективное управление состоянием

## Props

```typescript
interface MobileHeaderSearchFieldProps {
  onExpandChange?: (isExpanded: boolean) => void; // Колбэк для уведомления родителя о состоянии расширения
}
```

## Использование

```tsx
import MobileHeaderSearchField from './components/MobileHeaderSearchField/MobileHeaderSearchField';

function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className={`header ${isSearchExpanded ? 'expanded' : ''}`}>
      <MobileHeaderSearchField onExpandChange={setIsSearchExpanded} />
    </div>
  );
}
```

## Интеграция с Grid

Компонент разработан для использования в grid структуре [1:2:1] -> [1:1:3]:

```scss
.mobileHeader {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; // обычное состояние
  transition: grid-template-columns 0.3s ease-in-out;

  &.searchExpanded {
    grid-template-columns: 1fr 1fr 3fr; // расширенное состояние
  }
}
```

## Accessibility

- ✅ `aria-label` для кнопок
- ✅ Поддержка клавиатуры (Escape)
- ✅ Семантический HTML
- ✅ Понятная навигация

## Совместимость

- ✅ Мобильные устройства (320px+)
- ✅ Планшеты
- ✅ Адаптивный дизайн
- ✅ Touch-friendly интерфейс
