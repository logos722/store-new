export enum CatalogId {
  PVC = '936a16d1-79a7-11e6-ab15-d017c2d57ada',
  FITTINGS = '12345678-90ab-cdef-1234-567890abcdef',
}

// Мэппинг с названиями, описанием и урлами на изображения
export const CatalogInfo: Record<CatalogId, {
  title:       string;
  description: string;
  imageUrl:    string;
}> = {
  [CatalogId.PVC]: {
    title:       'ПВХ',
    description: 'Термопластичный полимер, который широко используется в различных областях благодаря своей прочности, универсальности и доступности',
    imageUrl:    '/catalogs/pvc.jpeg',
  },
  [CatalogId.FITTINGS]: {
    title:       'Фитинги',
    description: 'Соединительные элементы, используемые для создания, разветвления, поворотов и переходов на другой диаметр трубопроводов',
    imageUrl:    '/catalogs/fittings.jpeg',
  },
};
