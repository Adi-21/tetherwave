"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { FrontendIdContextType } from '@/types/contract';

const FrontendIdContext = createContext<FrontendIdContextType | null>(null);

export function FrontendIdProvider({ children }: { children: React.ReactNode }) {
    const [frontendIdCache, setFrontendIdCache] = useState<Record<string, string>>({});
    const pendingRequests = useRef<Record<string, Promise<{address: string, frontendId: string}>>>({});
    
    const batchFetchFrontendIds = useCallback(async (addresses: string[]) => {
        const uniqueAddresses = [...new Set(addresses)].filter(addr => 
            !frontendIdCache[addr] && !pendingRequests.current[addr]
        );
        
        if (uniqueAddresses.length === 0) return;

        try {
            const fetchPromises = uniqueAddresses.map(async (address) => {
                if (address in pendingRequests.current) {
                    return pendingRequests.current[address];
                }

                const promise = fetch(`https://node-referral-system.onrender.com/user/${address}`)
                    .then(async res => {
                        if (!res.ok) {
                            // If 404 or other error, return a default value
                            return { address, frontendId: `${address.slice(0, 6)}...${address.slice(-4)}` };
                        }
                        return res.json();
                    })
                    .then(data => ({ 
                        address, 
                        frontendId: data.frontend_id || `${address.slice(0, 6)}...${address.slice(-4)}`
                    }))
                    .finally(() => {
                        delete pendingRequests.current[address];
                    });

                pendingRequests.current[address] = promise;
                return promise;
            });

            const results = await Promise.all(fetchPromises);
            
            setFrontendIdCache(prev => ({
                ...prev,
                ...Object.fromEntries(results.map(({ address, frontendId }) => [address, frontendId]))
            }));
        } catch (error) {
            console.error('Error batch fetching frontend IDs:', error);
            // Cache truncated addresses for failed requests
            const failedAddresses = Object.fromEntries(
                uniqueAddresses.map(addr => [addr, `${addr.slice(0, 6)}...${addr.slice(-4)}`])
            );
            setFrontendIdCache(prev => ({ ...prev, ...failedAddresses }));
        }
    }, [frontendIdCache]);

    const getFrontendId = useCallback(async (address: string) => {
        if (frontendIdCache[address]) return frontendIdCache[address];
        if (address in pendingRequests.current) {
            await pendingRequests.current[address];
            return frontendIdCache[address] || 'ID Not Found';
        }
        
        await batchFetchFrontendIds([address]);
        return frontendIdCache[address] || 'ID Not Found';
    }, [frontendIdCache, batchFetchFrontendIds]);

    return (
        <FrontendIdContext.Provider value={{ getFrontendId, batchFetchFrontendIds, frontendIdCache }}>
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