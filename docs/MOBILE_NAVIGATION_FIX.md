# Исправление прикрепления MobileBottomNavigation к низу экрана

## Проблема

После изменений в `layout.module.scss` и `globals.scss` мобильная навигация перестала корректно прикрепляться к низу экрана.

## Причины

### 1. Конфликт CSS свойства `contain`

Свойство `contain: layout` на элементе `.layout` создавало новый контекст форматирования, из-за чего `position: fixed` начинало позиционироваться относительно `.layout`, а не относительно viewport.

### 2. Двойная flex-структура

В `globals.scss` у `body` был `display: flex`, а в `layout.module.scss` у `.layout` тоже был `display: flex`, что создавало конфликт структуры.

### 3. Расположение в DOM

`MobileBottomNavigation` находился внутри `.layout` div, что могло приводить к влиянию родительских стилей.

## Решение

### 1. Убрали `contain: layout` из `.layout`

**Файл**: `src/app/layout.module.scss`

```scss
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  // ВАЖНО: contain: layout удален, так как он нарушает position: fixed
  // для MobileBottomNavigation (фиксированный элемент начинает позиционироваться
  // относительно .layout, а не viewport)
}
```

### 2. Убрали `contain: layout paint` из `.main`

**Файл**: `src/app/layout.module.scss`

```scss
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-x: hidden;

  // ВАЖНО: contain убран, так как может влиять на position: fixed элементов

  @media (max-width: 767px) {
    padding-bottom: 80px; // 60px высота навигации + 20px отступ
  }
}
```

### 3. Исправили структуру `body` в `globals.scss`

**Файл**: `src/app/globals.scss`

```scss
body {
  min-height: 100vh;
  // display: flex удален - flexbox структура управляется через .layout в layout.module.scss
}

main {
  width: 100%;
}

footer {
  width: 100%;
  background-color: $primary-color;
  color: white;
  padding: 20px;
  text-align: center;
}
```

### 4. Переместили MobileBottomNavigation за пределы .layout

**Файл**: `src/app/layout.tsx`

```tsx
<ClientProviders>
  <div className={styles.layout}>
    <a href="#main-content" className={styles.skipLink}>
      Перейти к основному содержанию
    </a>
    <Header />
    <main id="main-content" className={styles.main} role="main">
      {children}
    </main>
    <Footer />
  </div>

  {/* Мобильная нижняя навигация вынесена за пределы .layout */}
  <MobileBottomNavigation />
</ClientProviders>
```

### 5. Улучшили стили мобильной навигации

**Файл**: `src/shared/components/mobileBottomNavigation/MobileBottomNavigation.module.scss`

```scss
.mobileBottomNav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%; // Явно указываем ширину
  height: $nav-height;
  background-color: $background-color;
  border-top: 1px solid $border-color;
  box-shadow: $shadow;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  z-index: 9999; // Увеличен z-index для гарантии отображения поверх всего

  @media (min-width: 768px) {
    display: none;
  }
}
```

## Итоговая структура

```
body (min-height: 100vh)
  └── ClientProviders
        ├── .layout (display: flex, flex-direction: column, min-height: 100vh)
        │     ├── .skipLink
        │     ├── Header
        │     ├── main.main (flex: 1, padding-bottom: 80px на мобильных)
        │     └── Footer
        └── MobileBottomNavigation (position: fixed, bottom: 0, z-index: 9999)
```

## Ключевые моменты

1. ✅ `position: fixed` работает относительно viewport
2. ✅ `z-index: 9999` гарантирует отображение поверх всех элементов
3. ✅ Отступ `padding-bottom: 80px` в `.main` предотвращает перекрытие контента
4. ✅ `MobileBottomNavigation` находится вне `.layout`, что исключает влияние родительских стилей
5. ✅ Навигация скрывается на десктопе через `@media (min-width: 768px)`

## Тестирование

Проверьте на мобильных устройствах (или в DevTools):

1. Навигация должна быть прикреплена к низу экрана
2. Навигация должна оставаться на месте при прокрутке
3. Контент не должен перекрываться навигацией (отступ 80px снизу)
4. На десктопе (≥768px) навигация не должна отображаться
