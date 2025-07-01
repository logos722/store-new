"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CartProvider } from '@/context/cart';

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
      <CartProvider>{children}</CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ClientProviders;