'use client';

import "./globals.css";
import { Providers } from '@/providers/Providers';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { opBNBTestnet } from 'viem/chains';

const config = createConfig({
  chains: [opBNBTestnet],
  transports: {
    [opBNBTestnet.id]: http()
  }
});

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Providers>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </WagmiProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
