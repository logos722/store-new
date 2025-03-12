'use client';
import React from 'react';
import HeaderSearchField from './HeaderSearchField';
import { IconLink } from '../../shared/components';
import Cart from '@/shared/components/cart/Cart';
import icon from '../../../public/images.png';
import styles from './Header.module.scss';
import Link from 'next/link';

const Header = () => {
  return (
    <nav className={styles.header}>
      <h2>Гелион</h2>
      <ul className={styles.menu}>
        <Link href="/">Главная</Link>
        <Link href="/catalog">Каталог</Link>
        <Link href="/articles">Статьи</Link>
      </ul>
      <HeaderSearchField />
      <Cart />
      <IconLink icon={icon} href="/account" alt="account" />
    </nav>
  );
};

export default Header;
