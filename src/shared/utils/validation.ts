/**
 * Утилиты для валидации полей формы
 */

/**
 * Проверяет валидность email адреса
 * Использует расширенную проверку на соответствие стандарту RFC 5322
 *
 * @param email - Email адрес для проверки
 * @returns true если email валиден
 *
 * Валидный email:
 * - Содержит @ символ
 * - Имеет локальную часть до @
 * - Имеет доменную часть после @
 * - Доменная часть содержит точку
 * - Не содержит пробелов
 */
export function isValidEmail(email: string): boolean {
  // Удаляем пробелы по краям
  const trimmedEmail = email.trim();

  // Базовая проверка на пустоту
  if (!trimmedEmail) {
    return false;
  }

  // RFC 5322 совместимый regex для email
  // Упрощенная версия, покрывающая 99% реальных случаев
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }

  // Дополнительные проверки
  const [localPart, domainPart] = trimmedEmail.split('@');

  // Проверка длины локальной части (макс 64 символа)
  if (localPart.length > 64) {
    return false;
  }

  // Проверка длины доменной части (макс 255 символов)
  if (domainPart.length > 255) {
    return false;
  }

  // Проверка, что домен содержит хотя бы одну точку
  if (!domainPart.includes('.')) {
    return false;
  }

  // Проверка, что домен не начинается и не заканчивается точкой или дефисом
  if (
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    domainPart.startsWith('-') ||
    domainPart.endsWith('-')
  ) {
    return false;
  }

  return true;
}

/**
 * Нормализует email (приводит к нижнему регистру, удаляет пробелы)
 * @param email - Email адрес
 * @returns Нормализованный email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Проверяет, что строка не пустая и не состоит только из пробелов
 * @param value - Значение для проверки
 * @returns true если строка содержит непробельные символы
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Проверяет минимальную длину строки (после удаления пробелов по краям)
 * @param value - Значение для проверки
 * @param minLength - Минимальная длина
 * @returns true если строка соответствует минимальной длине
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Проверяет, содержит ли строка только буквы (включая русские) и пробелы
 * Полезно для валидации имен
 *
 * @param value - Значение для проверки
 * @returns true если строка содержит только буквы и пробелы
 */
export function isAlphaWithSpaces(value: string): boolean {
  // Поддержка русских и английских букв, дефиса и пробелов
  const alphaRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  return alphaRegex.test(value);
}

/**
 * Интерфейс для результата валидации поля
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидирует поле имени
 * @param name - Имя для валидации
 * @returns Результат валидации с возможной ошибкой
 */
export function validateName(name: string): ValidationResult {
  if (!isNotEmpty(name)) {
    return {
      isValid: false,
      error: 'Имя обязательно для заполнения',
    };
  }

  if (!hasMinLength(name, 2)) {
    return {
      isValid: false,
      error: 'Имя должно содержать минимум 2 символа',
    };
  }

  if (!isAlphaWithSpaces(name)) {
    return {
      isValid: false,
      error: 'Имя может содержать только буквы, пробелы и дефис',
    };
  }

  return { isValid: true };
}

/**
 * Валидирует email с детальным сообщением об ошибке
 * @param email - Email для валидации
 * @returns Результат валидации с возможной ошибкой
 */
export function validateEmail(email: string): ValidationResult {
  if (!isNotEmpty(email)) {
    return {
      isValid: false,
      error: 'Email обязателен для заполнения',
    };
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      error: 'Введите корректный email адрес',
    };
  }

  return { isValid: true };
}
