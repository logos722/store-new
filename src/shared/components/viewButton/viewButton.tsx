import React from 'react';
import { FaTh, FaThList } from 'react-icons/fa';
import styles from './viewButton.module.scss';

export interface ViewToggleButtonProps {
  view: 'grid' | 'list';
  handleToggle: (mode: 'grid' | 'list') => void;
}

const viewButton: React.FC<ViewToggleButtonProps> = ({
  view,
  handleToggle,
}) => {
  return (
    <div className={styles.viewToggle}>
      <button
        className={view === 'grid' ? styles.active : ''}
        onClick={() => handleToggle('grid')}
        aria-label="Grid view"
      >
        <FaTh />
      </button>
      <button
        className={view === 'list' ? styles.active : ''}
        onClick={() => handleToggle('list')}
        aria-label="List view"
      >
        <FaThList />
      </button>
    </div>
  );
};

export default viewButton;
