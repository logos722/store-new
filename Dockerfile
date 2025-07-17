# 1) Stage: сборка
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Stage: продакшен
FROM node:18-alpine AS runner
WORKDIR /app

# Копируем только скомпилированные файлы и необходимые модули
COPY --from=builder /app ./
RUN npm ci --production

EXPOSE 3000
CMD ["npm", "run", "start"]
