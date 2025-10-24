/**
 * Утилиты для работы с маской российского телефона
 * Формат: +7 (XXX) XXX-XX-XX
 */

/**
 * Применяет маску российского телефона к введенному значению
 * @param value - Введенное значение
 * @returns Отформатированное значение с маской
 *
 * Примеры:
 * "9" -> "+7 (9"
 * "9123456789" -> "+7 (912) 345-67-89"
 */
export function applyPhoneMask(value: string): string {
  // Удаляем все символы кроме цифр
  const digits = value.replace(/\D/g, '');

  // Если начинается с 8, заменяем на 7
  const normalizedDigits = digits.startsWith('8')
    ? '7' + digits.slice(1)
    : digits;

  // Если начинается с 7, используем как есть, иначе добавляем 7
  const phoneDigits = normalizedDigits.startsWith('7')
    ? normalizedDigits.slice(1, 11) // Берем только 10 цифр после 7
    : normalizedDigits.slice(0, 10); // Берем первые 10 цифр

  // Применяем маску поэтапно
  let formatted = '+7';

  if (phoneDigits.length > 0) {
    formatted += ` (${phoneDigits.slice(0, 3)}`;

    if (phoneDigits.length > 3) {
      formatted += `) ${phoneDigits.slice(3, 6)}`;

      if (phoneDigits.length > 6) {
        formatted += `-${phoneDigits.slice(6, 8)}`;

        if (phoneDigits.length > 8) {
          formatted += `-${phoneDigits.slice(8, 10)}`;
        }
      }
    }
  }

  return formatted;
}

/**
 * Получает чистые цифры из замаскированного номера телефона
 * @param maskedValue - Значение с маской
 * @returns Строка только из цифр
 *
 * Пример: "+7 (912) 345-67-89" -> "79123456789"
 */
export function getPhoneDigits(maskedValue: string): string {
  const digits = maskedValue.replace(/\D/g, '');

  // Нормализуем: если начинается с 8, меняем на 7
  if (digits.startsWith('8') && digits.length === 11) {
    return '7' + digits.slice(1);
  }

  // Если не начинается с 7, добавляем
  if (!digits.startsWith('7')) {
    return '7' + digits;
  }

  return digits;
}

/**
 * Проверяет, является ли номер телефона валидным российским номером
 * @param phone - Номер телефона (может быть с маской или без)
 * @returns true если номер валиден
 *
 * Валидный номер:
 * - Начинается с +7 или 8
 * - Содержит ровно 11 цифр (с кодом страны)
 * - Код оператора начинается с правильных цифр (9XX, 3XX, 4XX, 8XX)
 */
export function isValidRussianPhone(phone: string): boolean {
  const digits = getPhoneDigits(phone);

  // Проверяем длину (должно быть ровно 11 цифр с кодом страны 7)
  if (digits.length !== 11) {
    return false;
  }

  // Проверяем, что начинается с 7
  if (!digits.startsWith('7')) {
    return false;
  }

  // Проверяем код оператора (второя цифра после 7)
  const operatorCode = digits[1];
  const validOperatorCodes = ['3', '4', '5', '8', '9'];

  return validOperatorCodes.includes(operatorCode);
}

/**
 * Обрабатывает ввод в поле телефона с учетом позиции курсора
 * @param currentValue - Текущее значение поля
 * @param newValue - Новое значение после ввода
 * @param cursorPosition - Позиция курсора
 * @returns Объект с отформатированным значением и новой позицией курсора
 */
export function handlePhoneInput(
  currentValue: string,
  newValue: string,
  cursorPosition: number,
): { value: string; cursorPosition: number } {
  // Если пользователь удаляет символы
  if (newValue.length < currentValue.length) {
    const formatted = applyPhoneMask(newValue);
    return {
      value: formatted,
      cursorPosition: Math.min(cursorPosition, formatted.length),
    };
  }

  // Если пользователь вводит символы
  const formatted = applyPhoneMask(newValue);

  // Корректируем позицию курсора с учетом добавленных символов маски
  const digitsBeforeCursor = currentValue
    .slice(0, cursorPosition)
    .replace(/\D/g, '').length;
  let newCursorPosition = 0;
  let digitCount = 0;

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++;
    }
    if (digitCount >= digitsBeforeCursor + 1) {
      newCursorPosition = i + 1;
      break;
    }
  }

  return {
    value: formatted,
    cursorPosition: newCursorPosition || formatted.length,
  };
}
