import React from 'react';
import styles from './Select.module.scss';
import { SelectProps } from '@/types/select';

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.selectContainer}>
      <select
        className={styles.select}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
