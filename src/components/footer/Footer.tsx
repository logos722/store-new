import Link from 'next/link';
import React from 'react';
import styles from './Footer.module.scss'; // Не забудьте добавить стили для футера

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <ul>
          <h3>О нас</h3>
          <li>
            <Link href="/about">Наша история</Link>
          </li>
          <li>
            <Link href="/team">Наша команда</Link>
          </li>
          <li>
            <Link href="/careers">Карьера</Link>
          </li>
          <li>
            <Link href="/news">Новости</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <h3>Клиентам</h3>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/support">Поддержка</Link>
          </li>
          <li>
            <Link href="/shipping">Доставка</Link>
          </li>
          <li>
            <Link href="/returns">Возвраты</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <h3>Контакты</h3>
          <li>
            <Link href="/contact">Связаться с нами</Link>
          </li>
          <li>
            <Link href="/location">Наше местоположение</Link>
          </li>
          <li>
            <Link href="/partners">Партнеры</Link>
          </li>
          <li>
            <Link href="/feedback">Обратная связь</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
