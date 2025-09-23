import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import localforage from 'localforage';

import { Toaster } from '@/components/AppToaster/Toaster';

import packageJson from '../package.json';

const appVersion = packageJson.version;

import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

const persister =
  typeof window !== 'undefined'
    ? createAsyncStoragePersister({
        storage: localforage,
        key: 'rq-cache-v1',
        throttleTime: 1000,
      })
    : undefined;

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: persister!,
        maxAge: 24 * 60 * 60 * 1000,
        buster: appVersion,
      }}
    >
      <ChakraProvider value={defaultSystem}>
        {children}
        <Toaster />
      </ChakraProvider>
    </PersistQueryClientProvider>
  );
}
