// app/nav-progress.tsx
'use client';

import { Loading } from '@/shared/components';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
} from 'react';

type Ctx = {
  isNavigating: boolean;
  start: () => void;
  stop: () => void;
};

const NavProgressContext = createContext<Ctx | null>(null);

export function useNavProgress() {
  const ctx = useContext(NavProgressContext);
  if (!ctx)
    throw new Error('useNavProgress must be used within <NavProgressProvider>');
  return ctx;
}

export function NavProgressProvider({ children }: PropsWithChildren) {
  const [isNavigating, setIsNavigating] = useState(false);
  const start = useCallback(() => setIsNavigating(true), []);
  const stop = useCallback(() => setIsNavigating(false), []);

  return (
    <NavProgressContext.Provider value={{ isNavigating, start, stop }}>
      {children}
      {/* Глобальный оверлей */}
      {isNavigating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          {/* Твой компонент лоадера */}
          <Loading isLoading={isNavigating} key="navigating" />
        </div>
      )}
    </NavProgressContext.Provider>
  );
}
