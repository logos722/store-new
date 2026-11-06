FROM node:24.22.2-alpine@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_BASE_URL=https://gelionaqua.ru
ARG NEXT_PUBLIC_SITE_URL=https://gelionaqua.ru
ARG NEXT_PUBLIC_ANALYTICS_ENABLED=false
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=true
ARG NEXT_PUBLIC_WEB_VITALS_ENABLED=false
ARG NEXT_PUBLIC_WEB_VITALS_CORE_ONLY=true
ARG NEXT_PUBLIC_APP_VERSION
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
FROM node:24.22.2-alpine@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS runner
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000 NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
