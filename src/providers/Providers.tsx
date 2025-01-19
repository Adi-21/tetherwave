'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { FrontendIdProvider } from '@/contexts/FrontendIdContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FrontendIdProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </FrontendIdProvider>
  );
} 