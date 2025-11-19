# 🛒 Store New - E-commerce Platform

Современный интернет-магазин, построенный на Next.js 14 с поддержкой SSR, ISR и оптимизацией для SEO.

## ✨ Особенности

- 🚀 **Next.js 14** с App Router и Server Components
- 🎨 **Modern UI/UX** с SCSS модулями и адаптивным дизайном
- 📱 **Mobile-first** подход к разработке
- 🔍 **SEO оптимизация** с SSR, метаданными и структурированными данными
- ⚡ **ISR (Incremental Static Regeneration)** для оптимальной производительности
- 🐳 **Docker** поддержка для простого деплоя
- 🔄 **CI/CD** с GitHub Actions
- 📊 **Витрины каталогов** с динамической загрузкой
- 🛍️ **Корзина и избранное** с Zustand state management
- 🔐 **Type-safe** с TypeScript

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонируйте репозиторий
git clone https://github.com/logos722/store-new.git
cd store-new

# Установите зависимости
npm install

# Настройте переменные окружения
# Создайте .env.local (см. docs/ENVIRONMENT_SETUP.md)

# Запустите dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Docker Development

```bash
# Билд образа
docker build -t store-new .

# Запуск контейнера
docker run -p 3000:3000 \
  -e API_BASE_URL=http://host.docker.internal:5000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:5000 \
  store-new
```

### Docker Compose (Production)

```bash
# Скопируйте пример
cp docker-compose.production.example.yml docker-compose.yml

# Настройте переменные окружения
# Создайте .env файл

# Запустите
docker-compose up -d
```

## 📋 Структура проекта

```
store-new/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница
│   │   ├── catalog/           # Каталог товаров
│   │   ├── product/           # Страница товара
│   │   └── ...
│   ├── components/            # React компоненты
│   ├── shared/                # Общие компоненты и утилиты
│   │   ├── components/        # Переиспользуемые компоненты
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Утилиты
│   │   └── api/               # API функции
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript типы
│   └── constants/             # Константы
├── public/                    # Статические файлы
├── docs/                      # Документация
└── Dockerfile                 # Docker конфигурация
```

## 🔧 Скрипты

```bash
npm run dev          # Запуск development сервера
npm run build        # Production сборка
npm run start        # Запуск production сервера
npm run lint         # Проверка кода линтером
```

## 📚 Документация

### Основная документация

- [📖 Docs Index](./docs/README.md) - Полный список документации
- [⚡ Quick Fixes](./docs/QUICK_FIXES.md) - Быстрые решения проблем
- [🔧 Troubleshooting](./docs/TROUBLESHOOTING.md) - Устранение неполадок

### Недавние исправления (2025-11-18)

#### ✅ ISR Build Problem - ИСПРАВЛЕНО

Проблема с пустыми витринами на продакшене решена. Подробности:

- [ISR Build Fix](./docs/ISR_BUILD_FIX.md) - Полное описание и решения
- [Краткое решение (RU)](./docs/ISR_ПРОБЛЕМА_РЕШЕНИЕ.md) - Быстрый старт
- [Quick Fix (EN)](./docs/ISR_QUICK_FIX.md) - Quick reference

### Конфигурация и развертывание

- [Environment Setup](./docs/ENVIRONMENT_SETUP.md) - Настройка переменных окружения
- [CI/CD Recommendations](./docs/CI_CD_RECOMMENDATIONS.md) - Настройка CI/CD
- [Testing Guide](./docs/ISR_TESTING_GUIDE.md) - Руководство по тестированию

### Архитектура и разработка

- [Catalog Showcase Architecture](./docs/CATALOG_SHOWCASE_ARCHITECTURE.md)
- [Footer Pages Documentation](./docs/FOOTER_PAGES_DOCUMENTATION.md)
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)

### SEO и оптимизация

- [SEO Optimization Guide](./docs/SEO_OPTIMIZATION_GUIDE.md)
- [Быстрый старт SEO](./docs/БЫСТРЫЙ_СТАРТ_SEO.md)
- [Semantic Core Guide](./docs/SEMANTIC_CORE_GUIDE.md)

## 🔒 Переменные окружения

### Обязательные

```bash
# Server-side API URL (для SSR, ISR)
API_BASE_URL=http://backend:5000

# Client-side API URL (для браузера)
NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru

# Application URL (для SEO)
NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
```

Подробнее: [ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md)

## 🐳 Docker

### Production Build

```dockerfile
# Multi-stage build для оптимального размера образа
FROM node:18-alpine AS builder
# ... сборка

FROM node:18-alpine AS runner
# ... production runtime
```

### Healthcheck

Контейнер включает healthcheck:

```bash
docker ps  # Проверить статус "healthy"
```

## 🔄 CI/CD

Автоматический деплой через GitHub Actions:

1. **Build & Push** - сборка Docker образа → GHCR
2. **Deploy** - SSH деплой на сервер
3. **Health Check** - проверка работоспособности

См. [.github/workflows/ci-cd.yml](./.github/workflows/ci-cd.yml)

## 🛠️ Технологии

### Core

- **Next.js 14** - React фреймворк
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **SCSS Modules** - Стили

### State Management

- **Zustand** - Легковесный state management
- **React Context** - Для глобального состояния

### Styling

- **SCSS** - Препроцессор CSS
- **CSS Modules** - Изолированные стили
- **Mobile-first** - Адаптивный дизайн

### SEO

- **Next.js Metadata API** - SSR метаданные
- **Structured Data** - Schema.org разметка
- **Sitemap & Robots.txt** - Автоматическая генерация

### DevOps

- **Docker** - Контейнеризация
- **GitHub Actions** - CI/CD
- **Docker Compose** - Оркестрация

## 📊 Производительность

- ⚡ **ISR**: Кэширование на 1 час
- 🎯 **SSR**: Полный серверный рендеринг
- 📦 **Code Splitting**: Автоматическое разделение кода
- 🖼️ **Image Optimization**: Next.js Image оптимизация
- 🔄 **Dynamic Import**: Ленивая загрузка компонентов

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект является частной разработкой.

## 🆘 Поддержка

### Частые проблемы

| Проблема                       | Решение                                          |
| ------------------------------ | ------------------------------------------------ |
| "Каталоги не найдены" на проде | [ISR Build Fix](./docs/ISR_BUILD_FIX.md)         |
| Ошибки сборки                  | [Build Errors Fix](./docs/BUILD_ERRORS_FIX.md)   |
| Проблемы с Docker              | [Environment Setup](./docs/ENVIRONMENT_SETUP.md) |
| SEO проблемы                   | [SEO Guide](./docs/SEO_OPTIMIZATION_GUIDE.md)    |

### Получить помощь

1. 📖 Проверьте [документацию](./docs/README.md)
2. 🔍 Поищите в [issues](https://github.com/logos722/store-new/issues)
3. 💬 Создайте новый issue

## 📈 Статус

![Build Status](https://github.com/logos722/store-new/workflows/Build&Deploy%20Frontend/badge.svg)

---

**Последнее обновление:** 2025-11-18  
**Версия:** 1.0.0
