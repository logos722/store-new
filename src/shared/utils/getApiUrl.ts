/**
 * Возвращает правильный API URL в зависимости от окружения
 */
export function getApiUrl(): string {
  // На сервере Next.js (SSR/API routes/Build time)
  if (typeof window === 'undefined') {
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:5000';

    // Логируем только в development или если DEBUG=true
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      console.log('[getApiUrl] Server-side API URL:', apiUrl);
    }

    return apiUrl;
  }

  // В браузере (клиентские компоненты)
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  if (process.env.NODE_ENV === 'development') {
    console.log('[getApiUrl] Client-side API URL:', apiUrl);
  }

  return apiUrl;
}
