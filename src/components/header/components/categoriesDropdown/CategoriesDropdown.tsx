import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './CategoriesDropdown.module.scss'; // keep your existing styles
import SafePortal from '@/shared/components/ui/SafePortal';
import RecursiveCategory from './components/RecursiveCategory';

// Example type for categories
export interface Category {
  id: string;
  name: string;
  link?: string; // если есть link, то это конечная категория
  children?: Category[]; // для рекурсивной структуры
  nestedObject?: Category; // для одиночных вложенных объектов (как в вашем примере)
  hasChildren?: boolean; // deprecated, теперь определяется автоматически
  interactionType?: 'hover' | 'click' | 'both'; // тип взаимодействия для раскрытия подменю
}

interface CategoriesDropdownProps {
  categories: Category[]; // list of categories comes from props
  defaultInteractionType?: 'hover' | 'click' | 'both'; // глобальный тип взаимодействия по умолчанию
  iconOnly?: boolean; // показывать только иконку без текста (для мобильной версии)
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  categories,
  defaultInteractionType = 'hover', // по умолчанию используем hover
  iconOnly = false, // по умолчанию показываем текст
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // Memoize validation function for performance
  const validateCategory = useCallback((category: Category): boolean => {
    if (!category.id || !category.name) {
      console.warn('CategoriesDropdown: Invalid category structure', category);
      return false;
    }
    return true;
  }, []);

  // Memoize valid categories to prevent unnecessary re-renders
  const validCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(validateCategory);
  }, [categories, validateCategory]);

  // Memoize callback for closing dropdown
  const handleCategorySelect = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoize render function for performance
  const renderCategories = useCallback(
    (items: Category[]) => {
      return (
        <ul
          style={{
            position: 'absolute',
            top: menuPosition.top,
            left: menuPosition.left,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            listStyle: 'none',
            maxWidth: '200px',
          }}
          className={styles.dropdownMenu}
        >
          {items.map(cat => (
            <RecursiveCategory
              key={cat.id}
              category={cat}
              defaultInteractionType={defaultInteractionType}
              onCategorySelect={handleCategorySelect}
            />
          ))}
        </ul>
      );
    },
    [
      menuPosition.top,
      menuPosition.left,
      defaultInteractionType,
      handleCategorySelect,
    ],
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 10 + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Edge cases: error handling
  if (!categories) {
    console.warn('CategoriesDropdown: categories prop is undefined');
    return (
      <button className={styles.btnCategories} disabled>
        <FaBars /> Ошибка загрузки
      </button>
    );
  }

  if (categories.length === 0) {
    return (
      <button className={styles.btnCategories} disabled>
        <FaBars /> Нет категорий
      </button>
    );
  }

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <button
        ref={btnRef}
        className={`${styles.btnCategories} ${iconOnly ? styles.iconOnlyBtn : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls="categories-menu"
        aria-label={iconOnly ? 'Открыть меню категорий' : 'Меню категорий'}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        }}
      >
        <FaBars aria-hidden="true" /> {!iconOnly && 'Категории'}
      </button>

      {isOpen && (
        <SafePortal>
          <div ref={menuRef}>{renderCategories(validCategories)}</div>
        </SafePortal>
      )}
    </div>
  );
};

export default CategoriesDropdown;
