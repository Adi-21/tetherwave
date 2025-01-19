"use client";

import { createContext, useContext, useCallback, useState } from 'react';
import { dashboardAPI } from '@/services/api';
import type { FrontendIdContextType } from '@/types/contract';

const FrontendIdContext = createContext<FrontendIdContextType | null>(null);

export function FrontendIdProvider({ children }: { children: React.ReactNode }) {
    const [frontendIdCache, setFrontendIdCache] = useState<Record<string, string>>({});

    const getFrontendId = useCallback(async (address: string) => {
        try {
            const lowerAddress = address.toLowerCase();
            if (frontendIdCache[lowerAddress]) {
                return frontendIdCache[lowerAddress];
            }

            const response = await dashboardAPI.bulkLookupWallets([address]);
            if (response[lowerAddress]) {
                setFrontendIdCache(prev => ({
                    ...prev,
                    [lowerAddress]: response[lowerAddress]
                }));
                return response[lowerAddress];
            }
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        } catch {
            throw new Error('Error fetching frontend ID');
        }
    }, [frontendIdCache]);

    const batchFetchFrontendIds = useCallback(async (addresses: string[]) => {
        try {
            const response = await dashboardAPI.bulkLookupWallets(addresses);
            setFrontendIdCache(prev => ({
                ...prev,
                ...response
            }));
        } catch {
            throw new Error('Error in batch fetch');
        }
    }, []);

    return (
        <FrontendIdContext.Provider value={{ 
            getFrontendId, 
            batchFetchFrontendIds, 
            frontendIdCache 
        }}>
            {children}
        </FrontendIdContext.Provider>
    );
}

export function useFrontendId() {
    const context = useContext(FrontendIdContext);
    if (!context) {
        throw new Error('useFrontendId must be used within a FrontendIdProvider');
    }
    return context;
} 