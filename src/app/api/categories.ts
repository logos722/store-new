export async function fetchCategories(): Promise<string[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Ошибка при получении категорий');
  const data: { categories: string[] } = await res.json();
  return data.categories;
}
