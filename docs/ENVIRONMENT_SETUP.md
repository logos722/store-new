# Настройка переменных окружения

## 📋 Обзор

Приложение использует переменные окружения для конфигурации API и других настроек.

## 🔧 Переменные окружения

### API Configuration

| Переменная | Где используется | Описание | Пример |
|------------|------------------|----------|--------|
| `API_BASE_URL` | Server-side (SSR, ISR, API routes) | URL API для серверных запросов | `http://backend:5000` |
| `NEXT_PUBLIC_API_BASE_URL` | Client-side (браузер) | Публичный URL API для клиентских запросов | `https://api.gelionaqua.ru` |
| `NEXT_PUBLIC_BASE_URL` | Везде | Базовый URL вашего приложения (для SEO) | `https://gelionaqua.ru` |
| `NEXT_PUBLIC_IMAGE_HOST` | Image rewrites | URL хоста для изображений | `https://api.gelionaqua.ru` |

### Debug Configuration

| Переменная | Описание | Значения |
|------------|----------|----------|
| `DEBUG` | Включить расширенное логирование | `true` / `false` |
| `NODE_ENV` | Режим работы Node.js | `development` / `production` |

## 🖥️ Локальная разработка

### Шаг 1: Создайте `.env.local`

```bash
# .env.local

# API URLs (локальный backend)
API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Image host
NEXT_PUBLIC_IMAGE_HOST=http://localhost:5000

# Debug (опционально)
# DEBUG=true
```

### Шаг 2: Запустите приложение

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

## 🐳 Docker Production

### Вариант 1: Docker Compose (рекомендуется)

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  backend:
    image: your-backend:latest
    container_name: store-backend
    ports:
      - "5000:5000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    build: .
    container_name: store-frontend
    environment:
      # Server-side API URL (внутри Docker network)
      - API_BASE_URL=http://backend:5000
      
      # Client-side API URL (публичный URL)
      - NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru
      
      # Application URL
      - NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
      
      # Image host
      - NEXT_PUBLIC_IMAGE_HOST=https://api.gelionaqua.ru
    depends_on:
      backend:
        condition: service_healthy
    ports:
      - "3000:3000"
```

**Запуск:**

```bash
docker-compose up -d
```

### Вариант 2: Standalone Docker

**Билд с аргументами:**

```bash
docker build \
  --build-arg API_BASE_URL=http://backend:5000 \
  -t store-frontend:latest \
  .
```

**Запуск с переменными окружения:**

```bash
docker run -d \
  --name store-frontend \
  -p 3000:3000 \
  -e API_BASE_URL=http://backend:5000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru \
  -e NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru \
  -e NEXT_PUBLIC_IMAGE_HOST=https://api.gelionaqua.ru \
  store-frontend:latest
```

## ☁️ Хостинг платформы

### Vercel

1. Откройте настройки проекта
2. Перейдите в **Settings → Environment Variables**
3. Добавьте переменные:

```
API_BASE_URL=https://api.gelionaqua.ru
NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru
NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
```

### Railway

1. Откройте проект
2. Перейдите в **Variables**
3. Добавьте переменные (см. выше)

### Netlify

1. Откройте настройки сайта
2. **Site settings → Environment variables**
3. Добавьте переменные (см. выше)

## 🔍 Проверка конфигурации

### Во время разработки

Откройте DevTools Console и проверьте логи:

```
[getApiUrl] Server-side API URL: http://localhost:5000
[getApiUrl] Client-side API URL: http://localhost:5000
[fetchCatalogShowcase] Fetching: http://localhost:5000/api/catalog/...
```

### В production

Проверьте Docker логи:

```bash
# Проверить логи frontend контейнера
docker logs store-frontend 2>&1 | grep getApiUrl

# Проверить успешность запросов к API
docker logs store-frontend 2>&1 | grep fetchCatalogShowcase
```

## ❓ Частые проблемы

### Проблема: "Каталоги не найдены" на проде

**Причина:** API недоступен или неправильно настроены переменные окружения.

**Решение:**

1. Проверьте, что `API_BASE_URL` указывает на доступный API:

```bash
# Внутри frontend контейнера
docker exec -it store-frontend sh
wget -O- $API_BASE_URL/api/categories
```

2. Проверьте логи на ошибки:

```bash
docker logs store-frontend 2>&1 | grep -i error
```

3. Убедитесь, что backend запущен и доступен:

```bash
docker ps | grep backend
curl http://localhost:5000/api/categories
```

### Проблема: Изображения не загружаются

**Причина:** Неправильный `NEXT_PUBLIC_IMAGE_HOST` или `NEXT_PUBLIC_API_BASE_URL`.

**Решение:**

1. Проверьте переменную:

```bash
echo $NEXT_PUBLIC_IMAGE_HOST
```

2. Убедитесь, что URL публично доступен:

```bash
curl https://api.gelionaqua.ru/images/test.jpg
```

3. Проверьте `next.config.js` → `rewrites` конфигурацию

### Проблема: Ошибки CORS

**Причина:** Backend не настроен для приема запросов от frontend домена.

**Решение:**

Настройте CORS на backend для домена `https://gelionaqua.ru`

## 🔗 Связанные документы

- [ISR_BUILD_FIX.md](./ISR_BUILD_FIX.md) - Исправление проблемы ISR при билде
- [ISR_ПРОБЛЕМА_РЕШЕНИЕ.md](./ISR_ПРОБЛЕМА_РЕШЕНИЕ.md) - Краткая инструкция на русском
- [QUICK_FIXES.md](./QUICK_FIXES.md) - Быстрые исправления

## 📝 Чеклист для деплоя

Перед деплоем убедитесь:

- [ ] Все переменные окружения настроены
- [ ] `API_BASE_URL` доступен из frontend контейнера
- [ ] `NEXT_PUBLIC_API_BASE_URL` публично доступен
- [ ] Backend запущен до frontend (или используйте `depends_on`)
- [ ] Проверены логи на ошибки
- [ ] Изображения загружаются корректно
- [ ] SEO метаданные отображаются правильно

---

**Дата обновления:** 2025-11-18

