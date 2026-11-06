/** Browser requests use the site's origin; SSR uses the private Docker network. */
export function getApiUrl(): string {
  return typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'http://localhost:5000'
    : '';
}
