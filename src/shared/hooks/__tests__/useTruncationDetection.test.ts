// import { renderHook, waitFor } from '@testing-library/react';
// import { useRef } from 'react';
// import { useTruncationDetection } from '../useTruncationDetection';

// /**
//  * Тесты для хука useTruncationDetection
//  * Проверяем определение truncation и реакцию на изменения размеров
//  */
// describe('useTruncationDetection', () => {
//   // Mock для ResizeObserver
//   let mockResizeObserver: any;

//   beforeEach(() => {
//     // Создаем mock для ResizeObserver
//     mockResizeObserver = jest.fn(function ResizeObserver(callback: any) {
//       this.observe = jest.fn();
//       this.unobserve = jest.fn();
//       this.disconnect = jest.fn();
//       // Сохраняем callback для возможности его вызова в тестах
//       (this as any).callback = callback;
//     });

//     global.ResizeObserver = mockResizeObserver;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('Базовое поведение', () => {
//     it('должен возвращать false если ref.current === null', () => {
//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(null);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(result.current).toBe(false);
//     });

//     it('должен возвращать false если текст не обрезан', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(result.current).toBe(false);
//     });

//     it('должен возвращать true если текст обрезан', () => {
//       const mockElement = {
//         scrollWidth: 200, // Полная ширина контента
//         clientWidth: 100, // Видимая ширина
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(result.current).toBe(true);
//     });
//   });

//   describe('ResizeObserver', () => {
//     it('должен создавать ResizeObserver если доступен', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(mockResizeObserver).toHaveBeenCalled();
//     });

//     it('должен наблюдать за элементом через ResizeObserver', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       const observerInstance = mockResizeObserver.mock.results[0].value;
//       expect(observerInstance.observe).toHaveBeenCalledWith(mockElement);
//     });

//     it('должен отписываться от наблюдения при размонтировании', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { unmount } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       const observerInstance = mockResizeObserver.mock.results[0].value;

//       unmount();

//       expect(observerInstance.unobserve).toHaveBeenCalledWith(mockElement);
//       expect(observerInstance.disconnect).toHaveBeenCalled();
//     });

//     it('не должен падать если ResizeObserver недоступен', () => {
//       // Временно удаляем ResizeObserver
//       const originalResizeObserver = global.ResizeObserver;
//       (global as any).ResizeObserver = undefined;

//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(result.current).toBe(false);

//       // Восстанавливаем ResizeObserver
//       global.ResizeObserver = originalResizeObserver;
//     });
//   });

//   describe('Window resize listener', () => {
//     it('должен добавлять listener на window resize', () => {
//       const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       expect(addEventListenerSpy).toHaveBeenCalledWith(
//         'resize',
//         expect.any(Function),
//       );

//       addEventListenerSpy.mockRestore();
//     });

//     it('должен удалять listener при размонтировании', () => {
//       const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { unmount } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test text');
//       });

//       unmount();

//       expect(removeEventListenerSpy).toHaveBeenCalledWith(
//         'resize',
//         expect.any(Function),
//       );

//       removeEventListenerSpy.mockRestore();
//     });
//   });

//   describe('Реакция на изменения', () => {
//     it('должен пересчитывать при изменении текста', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result, rerender } = renderHook(
//         ({ text }) => {
//           const ref = useRef<HTMLElement>(mockElement);
//           return useTruncationDetection(ref, text);
//         },
//         { initialProps: { text: 'short' } },
//       );

//       expect(result.current).toBe(false);

//       // Изменяем текст и размеры
//       mockElement.scrollWidth = 200;
//       rerender({ text: 'very long text that gets truncated' });

//       expect(result.current).toBe(true);
//     });

//     it('должен учитывать дополнительные deps', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       let checkCount = 0;

//       const { rerender } = renderHook(
//         ({ dep }) => {
//           const ref = useRef<HTMLElement>({
//             ...mockElement,
//             get scrollWidth() {
//               checkCount++;
//               return mockElement.scrollWidth;
//             },
//           } as HTMLElement);
//           return useTruncationDetection(ref, 'test', [dep]);
//         },
//         { initialProps: { dep: 1 } },
//       );

//       const initialCheckCount = checkCount;

//       // Изменяем dep
//       rerender({ dep: 2 });

//       // Проверка должна выполниться снова
//       expect(checkCount).toBeGreaterThan(initialCheckCount);
//     });
//   });

//   describe('Edge Cases', () => {
//     it('должен обрабатывать scrollWidth === clientWidth (граничный случай)', () => {
//       const mockElement = {
//         scrollWidth: 100,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test');
//       });

//       expect(result.current).toBe(false);
//     });

//     it('должен обрабатывать очень большую разницу в размерах', () => {
//       const mockElement = {
//         scrollWidth: 10000,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test');
//       });

//       expect(result.current).toBe(true);
//     });

//     it('должен обрабатывать нулевые размеры', () => {
//       const mockElement = {
//         scrollWidth: 0,
//         clientWidth: 0,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, 'test');
//       });

//       expect(result.current).toBe(false);
//     });

//     it('должен обрабатывать пустой текст', () => {
//       const mockElement = {
//         scrollWidth: 0,
//         clientWidth: 100,
//       } as HTMLElement;

//       const { result } = renderHook(() => {
//         const ref = useRef<HTMLElement>(mockElement);
//         return useTruncationDetection(ref, '');
//       });

//       expect(result.current).toBe(false);
//     });
//   });
// });
