'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SafePortalProps {
  children: React.ReactNode;
  container?: Element;
}

/**
 * Безопасный портал, который избегает ошибок с disconnected elements
 * Решает проблемы с HTML Popover API и DOM манипуляциями
 */
const SafePortal: React.FC<SafePortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof document === 'undefined') return;

    // Устанавливаем контейнер
    const targetContainer = container || document.body;

    // Проверяем, что контейнер существует и подключен к DOM
    if (targetContainer && targetContainer.isConnected) {
      setPortalContainer(targetContainer);
      setMounted(true);
    }

    // Cleanup функция
    return () => {
      setMounted(false);
      setPortalContainer(null);
    };
  }, [container]);

  // Не рендерим до монтирования или если нет контейнера
  if (!mounted || !portalContainer) {
    return null;
  }

  // Дополнительная проверка перед созданием портала
  try {
    // Проверяем, что контейнер все еще подключен к DOM
    if (!portalContainer.isConnected) {
      console.warn('Portal container is disconnected from DOM');
      return null;
    }

    return createPortal(children, portalContainer);
  } catch (error) {
    console.error('Error creating portal:', error);
    return null;
  }
};

export default SafePortal;
