'use client';

import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { Navbar } from '../components/Navbar';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NodeNexus - Enterprise Cloud Marketplace</title>
        <meta name="description" content="Connect compute providers with enterprise workloads through our decentralized infrastructure marketplace." />
      </head>
      <body>
         <Providers>
          <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
            backgroundAttachment: 'fixed'
          }}>
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}