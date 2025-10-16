import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '@/shared/components';
import styles from './InfoPageLayout.module.scss';
import BackButton from '../backButton/BackButton';
/**
 * Интерфейс для секции страницы
 */
export interface PageSection {
  heading: string;
  content?: string;
  items?: readonly string[];
  questions?: ReadonlyArray<{ q: string; a: string }>;
  departments?: ReadonlyArray<{ name: string; description: string }>;
  positions?: ReadonlyArray<{ title: string; requirements: readonly string[] }>;
  benefits?: readonly string[];
  newsTypes?: readonly string[];
  contacts?: readonly string[];
  services?: readonly string[];
  options?: ReadonlyArray<{ name: string; description: string }>;
  pricing?: readonly string[];
  conditions?: readonly string[];
  steps?: readonly string[];
  contactInfo?: {
    phones: readonly string[];
    email: string;
    address: string;
    schedule: string;
  };
  details?: {
    legalName: string;
    note: string;
  };
  mapInfo?: {
    address: string;
    city: string;
  };
  address?: string;
  directions?: readonly string[];
  landmarks?: string;
  brands?: readonly string[];
}

/**
 * Props для InfoPageLayout
 */
export interface InfoPageLayoutProps {
  title: string;
  sections: readonly PageSection[];
  cta?: string;
  ctaLink?: string;
  includeContactForm?: boolean;
  includeFeedbackForm?: boolean;
  includeMap?: boolean;
  formFields?: readonly string[];
  children?: ReactNode;
}

/**
 * Переиспользуемый компонент для информационных страниц Footer
 *
 * Особенности:
 * - Единообразный дизайн для всех информационных страниц
 * - Гибкая структура с различными типами секций
 * - Поддержка форм обратной связи
 * - Адаптивный дизайн
 * - Оптимизация для SEO
 */
const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({
  title,
  sections,
  cta,
  ctaLink,
  includeContactForm = false,
  includeFeedbackForm = false,
  includeMap = false,
  formFields = [],
  children,
}) => {
  /**
   * Рендер различных типов контента в секциях
   */
  const renderSectionContent = (section: PageSection) => {
    return (
      <div key={section.heading} className={styles.section}>
        <h2 className={styles.sectionHeading}>{section.heading}</h2>

        {/* Обычный текстовый контент */}
        {section.content && (
          <p className={styles.sectionContent}>{section.content}</p>
        )}

        {/* Список items */}
        {section.items && (
          <ul className={styles.list}>
            {section.items.map((item, idx) => (
              <li key={idx} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* FAQ вопросы */}
        {section.questions && (
          <div className={styles.faqList}>
            {section.questions.map((qa, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.question}>{qa.q}</h3>
                <p className={styles.answer}>{qa.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Департаменты */}
        {section.departments && (
          <div className={styles.departmentList}>
            {section.departments.map((dept, idx) => (
              <div key={idx} className={styles.department}>
                <h3 className={styles.departmentName}>{dept.name}</h3>
                <p className={styles.departmentDesc}>{dept.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Вакансии */}
        {section.positions && (
          <div className={styles.positionList}>
            {section.positions.map((pos, idx) => (
              <div key={idx} className={styles.position}>
                <h3 className={styles.positionTitle}>{pos.title}</h3>
                <ul className={styles.requirements}>
                  {pos.requirements.map((req, reqIdx) => (
                    <li key={reqIdx}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Преимущества */}
        {section.benefits && (
          <ul className={styles.benefitsList}>
            {section.benefits.map((benefit, idx) => (
              <li key={idx} className={styles.benefitItem}>
                {benefit}
              </li>
            ))}
          </ul>
        )}

        {/* Типы новостей */}
        {section.newsTypes && (
          <ul className={styles.list}>
            {section.newsTypes.map((type, idx) => (
              <li key={idx} className={styles.listItem}>
                {type}
              </li>
            ))}
          </ul>
        )}

        {/* Контакты */}
        {section.contacts && (
          <div className={styles.contactsList}>
            {section.contacts.map((contact, idx) => (
              <p key={idx} className={styles.contactItem}>
                {contact}
              </p>
            ))}
          </div>
        )}

        {/* Услуги */}
        {section.services && (
          <ul className={styles.servicesList}>
            {section.services.map((service, idx) => (
              <li key={idx} className={styles.serviceItem}>
                {service}
              </li>
            ))}
          </ul>
        )}

        {/* Опции доставки */}
        {section.options && (
          <div className={styles.optionsList}>
            {section.options.map((option, idx) => (
              <div key={idx} className={styles.option}>
                <h3 className={styles.optionName}>{option.name}</h3>
                <p className={styles.optionDesc}>{option.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Прайсинг */}
        {section.pricing && (
          <ul className={styles.pricingList}>
            {section.pricing.map((price, idx) => (
              <li key={idx} className={styles.pricingItem}>
                {price}
              </li>
            ))}
          </ul>
        )}

        {/* Условия */}
        {section.conditions && (
          <ul className={styles.conditionsList}>
            {section.conditions.map((condition, idx) => (
              <li key={idx} className={styles.conditionItem}>
                {condition}
              </li>
            ))}
          </ul>
        )}

        {/* Шаги */}
        {section.steps && (
          <ol className={styles.stepsList}>
            {section.steps.map((step, idx) => (
              <li key={idx} className={styles.stepItem}>
                {step}
              </li>
            ))}
          </ol>
        )}

        {/* Контактная информация */}
        {section.contactInfo && (
          <div className={styles.contactInfo}>
            <div className={styles.infoBlock}>
              <strong>Телефоны:</strong>
              <div>
                {section.contactInfo.phones.map(phone => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className={styles.phoneLink}
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.infoBlock}>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${section.contactInfo.email}`}
                className={styles.emailLink}
              >
                {section.contactInfo.email}
              </a>
            </div>
            <div className={styles.infoBlock}>
              <strong>Адрес:</strong>{' '}
              <address className={styles.addressText}>
                {section.contactInfo.address}
              </address>
            </div>
            <div className={styles.infoBlock}>
              <strong>Режим работы:</strong>
              <pre className={styles.schedule}>
                {section.contactInfo.schedule}
              </pre>
            </div>
          </div>
        )}

        {/* Детали компании */}
        {section.details && (
          <div className={styles.details}>
            <p>
              <strong>{section.details.legalName}</strong>
            </p>
            <p className={styles.note}>{section.details.note}</p>
          </div>
        )}

        {/* Информация для карты */}
        {section.mapInfo && (
          <div className={styles.mapInfo}>
            <address className={styles.mapAddress}>
              {section.mapInfo.address}, {section.mapInfo.city}
            </address>
          </div>
        )}

        {/* Адрес */}
        {section.address && (
          <address className={styles.addressBlock}>{section.address}</address>
        )}

        {/* Направления */}
        {section.directions && (
          <ul className={styles.directionsList}>
            {section.directions.map((direction, idx) => (
              <li key={idx} className={styles.directionItem}>
                {direction}
              </li>
            ))}
          </ul>
        )}

        {/* Ориентиры */}
        {section.landmarks && (
          <p className={styles.landmarks}>{section.landmarks}</p>
        )}

        {/* Бренды */}
        {section.brands && (
          <ul className={styles.brandsList}>
            {section.brands.map((brand, idx) => (
              <li key={idx} className={styles.brandItem}>
                {brand}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={styles.infoPage}>
      <Container>
        {/* Кнопка назад */}
        <div className={styles.backButtonWrapper}>
          <BackButton />
        </div>

        {/* Заголовок страницы */}
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </header>

        {/* Основной контент */}
        <div className={styles.content}>
          {sections.map(section => renderSectionContent(section))}

          {/* Карта (если нужна) */}
          {includeMap && (
            <div className={styles.mapSection}>
              <div className={styles.mapPlaceholder}>
                <p>🗺️ Здесь будет Яндекс.Карта с местоположением</p>
                <p className={styles.mapNote}>
                  Интеграция с картами добавляется отдельно
                </p>
              </div>
            </div>
          )}

          {/* Форма обратной связи */}
          {(includeContactForm || includeFeedbackForm) && (
            <div className={styles.formSection}>
              <form className={styles.form}>
                {formFields.map(field => (
                  <div key={field} className={styles.formGroup}>
                    <label
                      htmlFor={field.toLowerCase()}
                      className={styles.label}
                    >
                      {field}
                    </label>
                    {field === 'Сообщение' ? (
                      <textarea
                        id={field.toLowerCase()}
                        name={field.toLowerCase()}
                        className={styles.textarea}
                        rows={5}
                        required
                      />
                    ) : (
                      <input
                        type={field.includes('Email') ? 'email' : 'text'}
                        id={field.toLowerCase()}
                        name={field.toLowerCase()}
                        className={styles.input}
                        required
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className={styles.submitButton}>
                  {cta || 'Отправить'}
                </button>
              </form>
            </div>
          )}

          {/* Дополнительный контент */}
          {children}

          {/* CTA кнопка */}
          {cta && !includeContactForm && !includeFeedbackForm && (
            <div className={styles.ctaSection}>
              {ctaLink ? (
                <Link href={ctaLink} className={styles.ctaButton}>
                  {cta}
                </Link>
              ) : (
                <button className={styles.ctaButton}>{cta}</button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default InfoPageLayout;
