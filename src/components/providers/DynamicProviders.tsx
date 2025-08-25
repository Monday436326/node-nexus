'use client';

import { useEffect, useState } from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

interface DynamicWrapperProps {
  children: React.ReactNode;
}

export function DynamicWrapper({ children }: DynamicWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: '5520007d-5859-4fe0-8573-fc0f80e0e4b7',
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'connect-only',
        enableVisitTrackingOnConnectOnly: false,
      }}
    >
      <div className="min-h-screen bg-neutral-50">
        {children}
      </div>
    </DynamicContextProvider>
  );
}