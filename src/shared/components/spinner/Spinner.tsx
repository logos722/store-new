import React from 'react';
import styles from './Spinner.module.scss';

interface ISpinner {
  isLoading: boolean;
}

const Spinner: React.FC<ISpinner> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div>
        <span className={styles.loader}></span>
      </div>
    );
  } else {
    return;
  }
};

export default Spinner;
