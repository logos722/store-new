/**
 * Возвращает правильный API URL в зависимости от окружения
 */
export function getApiUrl(): string {
  // На сервере Next.js (SSR/API routes)
  if (typeof window === 'undefined') {
    return process.env.API_BASE_URL || 'http://localhost:5000';
  }

  // В браузере (клиентские компоненты)
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
}
