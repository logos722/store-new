import React from 'react';
import styles from './Input.module.scss';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface IInput {
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input: React.FC<IInput> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
  );
};

export default Input;
