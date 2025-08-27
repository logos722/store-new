import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Category } from '../CategoriesDropdown';
import styles from '../CategoriesDropdown.module.scss';
import { LinkTrack } from '@/shared/components/linkTrack/LinkTrack';

interface RecursiveCategoryProps {
  category: Category;
  defaultInteractionType?: 'hover' | 'click' | 'both';
  onCategorySelect?: () => void; // callback для закрытия dropdown
  depth?: number; // глубина вложенности для стилизации
}

const RecursiveCategory: React.FC<RecursiveCategoryProps> = ({
  category,
  defaultInteractionType = 'hover',
  onCategorySelect,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Utility functions - defined before early returns
  const hasNestedElements = useCallback((cat: Category): boolean => {
    return !!((cat.children && cat.children.length > 0) || cat.nestedObject);
  }, []);

  const getNestedElements = useCallback((cat: Category): Category[] => {
    const elements: Category[] = [];

    // Validate and add children
    if (
      cat.children &&
      Array.isArray(cat.children) &&
      cat.children.length > 0
    ) {
      const validChildren = cat.children.filter(
        child => child && child.id && child.name,
      );
      elements.push(...validChildren);

      // Log warning if some children were invalid
      if (validChildren.length !== cat.children.length) {
        console.warn(
          'RecursiveCategory: Some children categories are invalid',
          {
            total: cat.children.length,
            valid: validChildren.length,
            category: cat.name,
          },
        );
      }
    }

    // Validate and add nestedObject
    if (cat.nestedObject && cat.nestedObject.id && cat.nestedObject.name) {
      elements.push(cat.nestedObject);
    } else if (cat.nestedObject) {
      console.warn('RecursiveCategory: Invalid nestedObject', {
        nestedObject: cat.nestedObject,
        category: cat.name,
      });
    }

    return elements;
  }, []);

  // Определяем тип взаимодействия для текущей категории
  const interactionType = category.interactionType || defaultInteractionType;

  const hasNested = hasNestedElements(category);
  const nestedElements = hasNested ? getNestedElements(category) : [];

  // Handle mouse enter with delay for better UX
  const handleMouseEnter = useCallback(() => {
    if (interactionType === 'hover' || interactionType === 'both') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hasNested) {
        setIsOpen(true);
      }
    }
  }, [interactionType, hasNested]);

  // Handle mouse leave with delay to prevent flickering
  const handleMouseLeave = useCallback(() => {
    if (interactionType === 'hover' || interactionType === 'both') {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150); // небольшая задержка для лучшего UX
    }
  }, [interactionType]);

  // Handle click for categories with nested elements
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        hasNested &&
        (interactionType === 'click' || interactionType === 'both')
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
      } else if (category.link && onCategorySelect) {
        // Если это конечная категория с ссылкой, вызываем callback
        onCategorySelect();
      }
    },
    [hasNested, interactionType, category.link, onCategorySelect],
  );

  // Handle link click for categories with links
  const handleLinkClick = useCallback(() => {
    if (onCategorySelect) {
      onCategorySelect();
    }
  }, [onCategorySelect]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Error handling: validate category structure
  if (!category || !category.id || !category.name) {
    console.error('RecursiveCategory: Invalid category provided', category);
    return null;
  }

  // Prevent excessive nesting depth for performance
  if (depth > 6) {
    console.warn('RecursiveCategory: Maximum nesting depth exceeded', depth);
    return (
      <li className={styles.dropdownItem}>
        <div className={styles.categoryContent}>
          <span className={styles.dropdownLink}>
            {category.name} (слишком глубокая вложенность)
          </span>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`${styles.dropdownItem} ${
        hasNested ? styles.hasNested : ''
      } ${depth > 0 ? styles.nestedItem : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-depth={depth} // для CSS стилизации по глубине
    >
      <div className={styles.categoryContent}>
        {category.link ? (
          <LinkTrack
            href={category.link}
            className={styles.dropdownLink}
            onClick={handleLinkClick}
          >
            {category.name}
          </LinkTrack>
        ) : (
          <span className={styles.dropdownLink}>{category.name}</span>
        )}

        {/* Индикатор наличия вложенных элементов */}
        {hasNested && (
          <span className={styles.nestedIndicator}>
            {interactionType === 'click' ? '▶' : '▶'}
          </span>
        )}
      </div>

      {/* Рекурсивно отображаем submenu для всех вложенных элементов */}
      {hasNested && isOpen && (
        <ul className={`${styles.subMenu} ${styles[`depth-${depth + 1}`]}`}>
          {nestedElements.map(child => (
            <RecursiveCategory
              key={child.id}
              category={child}
              defaultInteractionType={defaultInteractionType}
              onCategorySelect={onCategorySelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Мемоизируем компонент для предотвращения ненужных перерендеров
export default React.memo(RecursiveCategory, (prevProps, nextProps) => {
  // Сравниваем по ключевым свойствам для оптимизации
  return (
    prevProps.category.id === nextProps.category.id &&
    prevProps.category.name === nextProps.category.name &&
    prevProps.category.link === nextProps.category.link &&
    prevProps.defaultInteractionType === nextProps.defaultInteractionType &&
    prevProps.depth === nextProps.depth &&
    // Глубокое сравнение для children и nestedObject
    JSON.stringify(prevProps.category.children) ===
      JSON.stringify(nextProps.category.children) &&
    JSON.stringify(prevProps.category.nestedObject) ===
      JSON.stringify(nextProps.category.nestedObject)
  );
});
