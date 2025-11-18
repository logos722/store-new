# 1) Stage: сборка
FROM node:18-alpine AS builder
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Билд приложения
# Благодаря dynamic rendering в src/app/page.tsx,
# билд пройдет успешно даже если API недоступен
# 
# Примечание: Build-time переменные (ARG/ENV) НЕ НУЖНЫ для билда,
# так как используется dynamic rendering. Все переменные для runtime
# будут взяты из .env файла или docker-compose при запуске контейнера.
RUN npm run build

# 2) Stage: продакшен
FROM node:18-alpine AS runner
WORKDIR /app

# Устанавливаем NODE_ENV
ENV NODE_ENV=production

# Копируем package*.json для установки production зависимостей
COPY --from=builder /app/package*.json ./

# Устанавливаем ТОЛЬКО production зависимости (без devDependencies)
RUN npm ci --production

# Копируем только скомпилированные файлы
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Runtime переменные окружения будут установлены при запуске контейнера
# через docker run -e, docker-compose environment или .env файл

EXPOSE 3000

# Healthcheck для проверки работоспособности
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "run", "start"]
