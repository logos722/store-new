import React from 'react';
import styles from './Alert.module.css';



interface IProps {
  message: string;
  type: 'info' | 'alert'
}

const Alert: React.FC<IProps> = ({ message, type = 'info' }) => {
  return <div className={`${styles.alert} ${styles[type]}`}>{message}</div>;
};

export default Alert;
