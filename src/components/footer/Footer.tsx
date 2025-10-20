import Link from 'next/link';
import React from 'react';
import { COMPANY_INFO } from '@/constants/footerPages';
import styles from './Footer.module.scss';

/**
 * Footer компонент с улучшенной структурой и контактной информацией
 * Особенности:
 * - Семантическая разметка для SEO
 * - Структурированные ссылки по категориям
 * - Контактная информация компании
 * - Адаптивный дизайн
 */
const Footer: React.FC = () => {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        {/* О компании */}
        <div className={styles.section}>
          <h3 className={styles.heading}>О нас</h3>
          <nav aria-label="О компании">
            <ul className={styles.list}>
              <li>
                <Link href="/about" className={styles.link}>
                  Наша история
                </Link>
              </li>
              <li>
                <Link href="/team" className={styles.link}>
                  Наша команда
                </Link>
              </li>
              <li>
                <Link href="/careers" className={styles.link}>
                  Карьера
                </Link>
              </li>
              <li>
                <Link href="/news" className={styles.link}>
                  Новости
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Клиентам */}
        <div className={styles.section}>
          <h3 className={styles.heading}>Клиентам</h3>
          <nav aria-label="Информация для клиентов">
            <ul className={styles.list}>
              <li>
                <Link href="/faq" className={styles.link}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className={styles.link}>
                  Поддержка
                </Link>
              </li>
              <li>
                <Link href="/shipping" className={styles.link}>
                  Доставка
                </Link>
              </li>
              <li>
                <Link href="/returns" className={styles.link}>
                  Возврат и обмен
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Контакты */}
        <div className={styles.section}>
          <h3 className={styles.heading}>Контакты</h3>
          <nav aria-label="Контактная информация">
            <ul className={styles.list}>
              <li>
                <Link href="/contact" className={styles.link}>
                  Связаться с нами
                </Link>
              </li>
              <li>
                <Link href="/location" className={styles.link}>
                  Где нас найти
                </Link>
              </li>
              <li>
                <Link href="/partners" className={styles.link}>
                  Партнерам
                </Link>
              </li>
              <li>
                <Link href="/feedback" className={styles.link}>
                  Обратная связь
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Контактная информация */}
        <div className={styles.section}>
          <h3 className={styles.heading}>Связь с нами</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Телефоны:</span>
              <div className={styles.phones}>
                {COMPANY_INFO.contact.phones.map(phone => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className={styles.phone}
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email:</span>
              {COMPANY_INFO.contact.email.map(email => (
                <div key={email}>
                  <a href={`mailto:${email}`} className={styles.email}>
                    {email}
                  </a>
                </div>
              ))}
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Адрес:</span>
              <address className={styles.address}>
                {COMPANY_INFO.contact.address}
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className={styles.bottom}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {COMPANY_INFO.legalName}. Все права
            защищены.
          </p>
          <div className={styles.schedule}>
            <p>{COMPANY_INFO.contact.schedule.weekdays}</p>
            <p>{COMPANY_INFO.contact.schedule.saturday}</p>
            <p>{COMPANY_INFO.contact.schedule.sunday}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
