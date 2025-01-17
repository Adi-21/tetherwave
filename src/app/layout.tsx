'use client';

import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ClientProviders } from '@/providers/ClientProviders';
import { Providers } from '@/providers/Providers';
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ClientProviders>
            <Providers>
              {children}
            </Providers>
          </ClientProviders>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
