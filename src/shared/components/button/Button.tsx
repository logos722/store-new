import React from 'react';
import styles from './Button.module.scss';

interface IButton {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  type: 'submit' | 'reset' | 'button' | undefined;
}

const Button: React.FC<IButton> = ({ children, onClick, type = 'button' }) => {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;
