import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthModal } from '@/context/authModalProvider/AuthModalContext';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useCartStore } from '@/stores/useCartStore';
import { IS_AUTH_ENABLED } from '@/constants/featureFlags';

/**
 * Хук для мобильной навигации
 *
 * Содержит всю логику для мобильной нижней навигации:
 * - Получение данных из stores
 * - Обработка ошибок
 * - Мемоизация для оптимизации производительности
 * - Определение активных путей
 */
export const useMobileNavigation = () => {
  const pathname = usePathname();
  const { open } = useAuthModal();

  // Получаем данные из stores с мемоизацией
  const favoritesCount = useFavoritesStore(s => s.ids.length);
  const cartItemsCount = useCartStore(s =>
    s.items.reduce((total, item) => total + item.quantity, 0),
  );

  /**
   * Безопасный обработчик открытия модального окна авторизации
   * Включает обработку ошибок и fallback
   */
  const handleAuthOpen = useCallback(() => {
    try {
      if (typeof open === 'function') {
        open();
      } else {
        console.warn('Auth modal open function is not available');
        // Fallback: можно показать уведомление пользователю
        alert('Функция авторизации временно недоступна');
      }
    } catch (error) {
      console.error('Failed to open auth modal:', error);
      // Fallback: показываем уведомление пользователю
      alert('Произошла ошибка при открытии окна авторизации');
    }
  }, [open]);

  /**
   * Проверяем, является ли текущий путь активным
   * Учитывает вложенные маршруты (например, /catalog/PVC)
   */
  const isActivePath = useCallback(
    (path: string) => {
      if (path === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(path);
    },
    [pathname],
  );

  /**
   * Навигационные элементы с мемоизацией
   * Пересчитывается только при изменении зависимостей
   */
  const navigationItems = useMemo(
    () => [
      {
        href: '/',
        label: 'Главная',
        isActive: isActivePath('/'),
      },
      {
        href: '/favorites',
        label: 'Избранное',
        isActive: isActivePath('/favorites'),
        badge: favoritesCount > 0 ? favoritesCount : undefined,
      },
      {
        href: '/cart',
        label: 'Корзина',
        isActive: isActivePath('/cart'),
        badge: cartItemsCount > 0 ? cartItemsCount : undefined,
      },
      // Условно рендерим кнопку авторизации только если она включена
      ...(IS_AUTH_ENABLED
        ? [
            {
              href: null, // null означает, что это кнопка, а не ссылка
              label: 'Войти',
              isActive: false,
              onClick: handleAuthOpen,
            },
          ]
        : []),
    ],
    [isActivePath, favoritesCount, cartItemsCount, handleAuthOpen],
  );

  return {
    navigationItems,
    handleAuthOpen,
    isActivePath,
  };
};
