'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CartProvider } from '@/context/cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FavoritesProvider } from '@/context/fav/favorites';
import { AuthProvider } from '@/context/auth/auth';
import { AuthModalProvider } from '@/context/authModalProvider/AuthModalContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
      retry: 2,
    },
  },
});

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthModalProvider>
          <CartProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </CartProvider>
        </AuthModalProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </QueryClientProvider>
  );
};

export default ClientProviders;
