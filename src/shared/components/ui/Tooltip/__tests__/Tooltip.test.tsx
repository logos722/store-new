// import React from 'react';
// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import Tooltip from '../Tooltip';

// /**
//  * Тесты для компонента Tooltip
//  * Проверяем базовый функционал, поведение на desktop/mobile и edge cases
//  */
// describe('Tooltip Component', () => {
//   beforeEach(() => {
//     // Сбрасываем таймеры перед каждым тестом
//     jest.clearAllTimers();
//     jest.useFakeTimers();
//   });

//   afterEach(() => {
//     jest.runOnlyPendingTimers();
//     jest.useRealTimers();
//   });

//   describe('Базовый рендеринг', () => {
//     it('должен рендерить children', () => {
//       render(
//         <Tooltip content="Test tooltip">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       expect(screen.getByText('Test content')).toBeInTheDocument();
//     });

//     it('не должен показывать тултип по умолчанию', () => {
//       render(
//         <Tooltip content="Test tooltip">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//     });

//     it('не должен рендерить wrapper если disabled=true', () => {
//       const { container } = render(
//         <Tooltip content="Test tooltip" disabled>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       expect(screen.getByText('Test content')).toBeInTheDocument();
//       expect(
//         container.querySelector('.tooltipWrapper'),
//       ).not.toBeInTheDocument();
//     });
//   });

//   describe('Desktop поведение (hover)', () => {
//     beforeEach(() => {
//       // Эмулируем desktop устройство
//       Object.defineProperty(window, 'ontouchstart', {
//         writable: true,
//         value: undefined,
//       });
//       Object.defineProperty(navigator, 'maxTouchPoints', {
//         writable: true,
//         value: 0,
//       });
//     });

//     it('должен показывать тултип при наведении мыши с задержкой', async () => {
//       render(
//         <Tooltip content="Test tooltip" delay={300}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       // Наводим мышь
//       if (wrapper) {
//         fireEvent.mouseEnter(wrapper);
//       }

//       // Тултип еще не должен показаться (задержка 300ms)
//       expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

//       // Пропускаем время
//       jest.advanceTimersByTime(300);

//       // Тултип должен появиться
//       await waitFor(() => {
//         expect(screen.getByRole('tooltip')).toBeInTheDocument();
//         expect(screen.getByText('Test tooltip')).toBeInTheDocument();
//       });
//     });

//     it('должен скрывать тултип при уходе мыши', async () => {
//       render(
//         <Tooltip content="Test tooltip" delay={100}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         // Показываем тултип
//         fireEvent.mouseEnter(wrapper);
//         jest.advanceTimersByTime(100);

//         await waitFor(() => {
//           expect(screen.getByRole('tooltip')).toBeInTheDocument();
//         });

//         // Убираем мышь
//         fireEvent.mouseLeave(wrapper);

//         await waitFor(() => {
//           expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//         });
//       }
//     });

//     it('должен отменять таймер если мышь ушла до истечения delay', () => {
//       render(
//         <Tooltip content="Test tooltip" delay={300}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         // Наводим мышь
//         fireEvent.mouseEnter(wrapper);

//         // Ждем часть времени
//         jest.advanceTimersByTime(150);

//         // Убираем мышь ДО истечения delay
//         fireEvent.mouseLeave(wrapper);

//         // Досчитываем оставшееся время
//         jest.advanceTimersByTime(150);

//         // Тултип НЕ должен появиться
//         expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//       }
//     });
//   });

//   describe('Mobile поведение (touch)', () => {
//     beforeEach(() => {
//       // Эмулируем mobile устройство
//       Object.defineProperty(window, 'ontouchstart', {
//         writable: true,
//         value: {},
//       });
//       Object.defineProperty(navigator, 'maxTouchPoints', {
//         writable: true,
//         value: 1,
//       });
//     });

//     it('должен показывать тултип по клику на mobile', async () => {
//       render(
//         <Tooltip content="Test tooltip">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         // Кликаем
//         fireEvent.click(wrapper);

//         await waitFor(() => {
//           expect(screen.getByRole('tooltip')).toBeInTheDocument();
//         });
//       }
//     });

//     it('должен скрывать тултип при повторном клике', async () => {
//       render(
//         <Tooltip content="Test tooltip">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         // Первый клик - показываем
//         fireEvent.click(wrapper);
//         await waitFor(() => {
//           expect(screen.getByRole('tooltip')).toBeInTheDocument();
//         });

//         // Второй клик - скрываем
//         fireEvent.click(wrapper);
//         await waitFor(() => {
//           expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//         });
//       }
//     });
//   });

//   describe('Позиционирование', () => {
//     const positions = ['top', 'bottom', 'left', 'right'] as const;

//     positions.forEach(position => {
//       it(`должен применять класс ${position}`, async () => {
//         const { container } = render(
//           <Tooltip content="Test tooltip" position={position} delay={0}>
//             <span>Test content</span>
//           </Tooltip>,
//         );

//         const wrapper = screen.getByText('Test content').parentElement;

//         if (wrapper) {
//           fireEvent.mouseEnter(wrapper);
//           jest.advanceTimersByTime(0);

//           await waitFor(() => {
//             const tooltip = container.querySelector(`.${position}`);
//             expect(tooltip).toBeInTheDocument();
//           });
//         }
//       });
//     });
//   });

//   describe('Edge Cases', () => {
//     it('должен обрабатывать пустой content', () => {
//       render(
//         <Tooltip content="">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         fireEvent.mouseEnter(wrapper);
//         jest.advanceTimersByTime(300);

//         // Тултип не должен появиться для пустого content
//         expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//       }
//     });

//     it('должен применять custom className', () => {
//       const { container } = render(
//         <Tooltip content="Test tooltip" className="custom-class">
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = container.querySelector('.custom-class');
//       expect(wrapper).toBeInTheDocument();
//     });

//     it('должен очищать таймеры при размонтировании', () => {
//       const { unmount } = render(
//         <Tooltip content="Test tooltip" delay={300}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         fireEvent.mouseEnter(wrapper);

//         // Размонтируем до истечения delay
//         unmount();

//         // Досчитываем время
//         jest.advanceTimersByTime(300);

//         // Ничего не должно произойти (нет ошибок)
//         expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
//       }
//     });
//   });

//   describe('Доступность (a11y)', () => {
//     it('должен иметь role="tooltip"', async () => {
//       render(
//         <Tooltip content="Test tooltip" delay={0}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         fireEvent.mouseEnter(wrapper);
//         jest.advanceTimersByTime(0);

//         await waitFor(() => {
//           const tooltip = screen.getByRole('tooltip');
//           expect(tooltip).toBeInTheDocument();
//         });
//       }
//     });

//     it('должен иметь aria-live="polite"', async () => {
//       render(
//         <Tooltip content="Test tooltip" delay={0}>
//           <span>Test content</span>
//         </Tooltip>,
//       );

//       const wrapper = screen.getByText('Test content').parentElement;

//       if (wrapper) {
//         fireEvent.mouseEnter(wrapper);
//         jest.advanceTimersByTime(0);

//         await waitFor(() => {
//           const tooltip = screen.getByRole('tooltip');
//           expect(tooltip).toHaveAttribute('aria-live', 'polite');
//         });
//       }
//     });
//   });
// });
