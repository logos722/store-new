import { Suspense } from 'react';

/**
 * Серверный компонент для вставки структурированных данных JSON-LD
 * Используется в серверных компонентах Next.js
 */
interface ServerStructuredDataProps {
  data: object | object[];
}

/**
 * Серверный компонент для структурированных данных
 * Не требует 'use client' директивы и может использоваться в серверных компонентах
 */
const ServerStructuredData: React.FC<ServerStructuredDataProps> = ({
  data,
}) => {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <Suspense fallback={null}>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </Suspense>
  );
};

export default ServerStructuredData;
