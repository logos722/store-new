'use client';

import React, { createContext, useContext, useState } from 'react';
import { AuthModal } from '@/shared/components/authModal/AuthModal';

interface AuthModalContextType {
  open: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ open, close }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={close} />
    </AuthModalContext.Provider>
  );
};

// Хук для открытия/закрытия модалки из любого компонента
export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
