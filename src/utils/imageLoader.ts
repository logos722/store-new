export default function imageLoader({ src, width, quality }) {
  // Если URL содержит backend:5000 - заменяем на публичный домен
  if (src.includes('backend:5000')) {
    src = src.replace('http://backend:5000', 'https://gelionaqua.ru');
  }

  // Если URL уже начинается с http/https - используем как есть
  if (src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // Относительный путь - добавляем домен
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gelionaqua.ru';
  return `${baseUrl}${src}?w=${width}&q=${quality || 75}`;
}
