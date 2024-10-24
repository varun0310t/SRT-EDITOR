"use client";

import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import { useState } from 'react';
import { ReactNode } from 'react';
export default function Providers({ children }: { children: ReactNode }){
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
    
    {children}
    </QueryClientProvider>
  );
}