import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';

import { Providers } from './providers';

import type { RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

interface AllProvidersProps {
  children: ReactNode;
}

export function AllProviders({ children }: AllProvidersProps) {
  const testQueryClient = createTestQueryClient();

  return (
    <Providers>
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    </Providers>
  );
}

export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}
