import React from 'react';
import HeaderSearchField from './HeaderSearchField';
import { IconLink } from '../../shared/components';
import icon from '../../../public/images.png';
import styles from './Header.module.scss';
import Link from 'next/link';

// interface IProps {}

const Header = () => {
  return (
    <nav className={styles.header}>
      <h2>Гелион</h2>
      <ul className={styles.menu}>
        <Link href="/">Главная</Link>
        <li>Каталог</li>
        <li>Статьи</li>
        <li></li>
      </ul>
      <HeaderSearchField />
      <IconLink icon={icon} href="/catalog" alt="catalog" count={3} />
      <IconLink icon={icon} href="/account" alt="account" />
    </nav>
  );
};

export default Header;
