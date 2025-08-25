'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { config } from '@/lib/wagmi';
import { useState } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: '5520007d-5859-4fe0-8573-fc0f80e0e4b7',
        walletConnectors: [EthereumWalletConnectors],
        networkValidationMode: 'always',
        initialAuthenticationMode: 'connect-only',
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}