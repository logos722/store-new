# CI/CD Рекомендации после исправления ISR

## ✅ Текущая конфигурация

Ваш текущий CI/CD pipeline (`.github/workflows/ci-cd.yml`):

1. **Build & Push** - собирает Docker образ и пушит в GHCR
2. **Deploy** - подключается по SSH и перезапускает контейнеры

**Статус:** ✅ Работает корректно после применения исправлений ISR

## 🎯 Что изменилось

### До исправления

```
Build → ECONNREFUSED ошибки → ❌ Билд падал или создавал битый образ
```

### После исправления

```
Build → ✅ Успешно (без pre-rendering) → Deploy → Runtime rendering с реальными данными
```

## 🔧 Рекомендуемые улучшения

### 1. Добавьте переменные окружения в GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret**

Добавьте:
- `API_BASE_URL` (для Docker network, например: `http://backend:5000`)
- `NEXT_PUBLIC_API_BASE_URL` (публичный URL, например: `https://api.gelionaqua.ru`)
- `NEXT_PUBLIC_BASE_URL` (URL сайта, например: `https://gelionaqua.ru`)

### 2. Обновите workflow для передачи build args (опционально)

```yaml
- name: Build and push frontend image
  uses: docker/build-push-action@v4
  with:
    context: .
    file: Dockerfile
    push: true
    tags: |
      ${{ env.REGISTRY }}/logos722/store-new:latest
    # Опционально: передаем build-time аргументы
    # (не обязательно благодаря dynamic rendering)
    build-args: |
      API_BASE_URL=${{ secrets.API_BASE_URL }}
      NEXT_PUBLIC_API_BASE_URL=${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
      NEXT_PUBLIC_BASE_URL=${{ secrets.NEXT_PUBLIC_BASE_URL }}
```

**Важно:** Это не обязательно! Благодаря `dynamic = 'force-dynamic'` билд пройдет успешно и без этих переменных.

### 3. Добавьте тесты билда

```yaml
- name: Test build
  run: |
    docker build --target builder -t test-build .
    echo "Build stage completed successfully"
```

### 4. Добавьте healthcheck перед деплоем

```yaml
- name: Wait for deployment
  run: |
    timeout 60 bash -c 'until curl -sf http://localhost:3000/; do sleep 2; done'
    echo "Frontend is healthy"
```

### 5. Настройте уведомления о статусе билда

```yaml
- name: Send notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐳 Docker Compose на сервере

Убедитесь, что на сервере (`~/project/docker-compose.yml`) настроены переменные окружения:

```yaml
version: '3.8'

services:
  backend:
    image: your-backend:latest
    # ... конфигурация backend

  frontend:
    image: ghcr.io/logos722/store-new:latest
    environment:
      - NODE_ENV=production
      - API_BASE_URL=http://backend:5000
      - NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru
      - NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
      - NEXT_PUBLIC_IMAGE_HOST=https://api.gelionaqua.ru
    depends_on:
      - backend
    ports:
      - "3000:3000"
```

**Или используйте .env файл:**

```bash
# ~/project/.env
API_BASE_URL=http://backend:5000
NEXT_PUBLIC_API_BASE_URL=https://api.gelionaqua.ru
NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
NEXT_PUBLIC_IMAGE_HOST=https://api.gelionaqua.ru
```

## 📊 Мониторинг билдов

### Проверка успешности билда

После пуша в master проверьте:

1. **GitHub Actions** - зеленая галочка ✅
2. **Build логи** - нет ошибок `ECONNREFUSED`
3. **Deployment** - контейнер запустился успешно

### Команды для проверки на сервере

```bash
# SSH на сервер
ssh user@your-server

# Проверить запущенные контейнеры
sudo docker ps

# Проверить логи frontend
sudo docker logs store-frontend -f --tail 50

# Проверить healthcheck
curl http://localhost:3000/

# Проверить переменные окружения
sudo docker exec store-frontend printenv | grep API
```

## 🔍 Диагностика проблем

### Билд падает в CI/CD

**Проверьте логи GitHub Actions:**

```bash
# Скачайте логи
gh run view --log
```

**Типичные проблемы:**
- TypeScript ошибки → исправьте локально
- Linter ошибки → запустите `npm run lint`
- Docker build ошибки → проверьте Dockerfile

### Деплой прошел, но сайт не работает

**1. Проверьте переменные окружения на сервере:**

```bash
ssh user@server
sudo docker exec store-frontend printenv | grep API
```

**2. Проверьте доступность API из контейнера:**

```bash
sudo docker exec store-frontend wget -O- http://backend:5000/api/categories
```

**3. Проверьте логи:**

```bash
sudo docker logs store-frontend 2>&1 | grep -i error
```

**4. Проверьте Docker network:**

```bash
sudo docker network inspect project_default
```

## 📝 Чеклист для CI/CD

После обновления кода:

- [ ] Локальный билд успешен (`npm run build`)
- [ ] Docker билд успешен (`docker build -t test .`)
- [ ] Запушили в master
- [ ] GitHub Actions прошел успешно ✅
- [ ] Проверили логи деплоя
- [ ] Зашли на сайт и проверили работоспособность
- [ ] Проверили логи на сервере

## 🚀 Альтернативные платформы

### Vercel

```bash
# Установите Vercel CLI
npm i -g vercel

# Добавьте переменные окружения
vercel env add API_BASE_URL
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add NEXT_PUBLIC_BASE_URL

# Деплой
vercel --prod
```

### Railway

1. **Connect GitHub repository**
2. **Add environment variables** в настройках
3. Railway автоматически деплоит при пуше

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  API_BASE_URL = "https://api.gelionaqua.ru"
  NEXT_PUBLIC_API_BASE_URL = "https://api.gelionaqua.ru"
  NEXT_PUBLIC_BASE_URL = "https://gelionaqua.ru"
```

## 🔗 Полезные команды

```bash
# Локальный тест билда (как в CI)
docker build -t test-build .

# Проверить размер образа
docker images test-build

# Запустить контейнер для тестирования
docker run -p 3000:3000 -e API_BASE_URL=http://host.docker.internal:5000 test-build

# Проверить логи в реальном времени
docker logs -f <container-name>

# Зайти в контейнер
docker exec -it <container-name> sh

# Очистить старые образы
docker system prune -a
```

## 📚 Связанные документы

- [ISR_BUILD_FIX.md](./ISR_BUILD_FIX.md) - Описание исправления
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Настройка переменных
- [ISR_TESTING_GUIDE.md](./ISR_TESTING_GUIDE.md) - Тестирование

---

**Статус:** ✅ CI/CD работает корректно после исправлений  
**Дата:** 2025-11-18

