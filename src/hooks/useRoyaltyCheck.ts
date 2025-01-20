import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { fetchRoyaltyData } from '@/store/features/royaltySlice';

export const useRoyaltyCheck = (address: string | undefined) => {
    const dispatch = useDispatch<AppDispatch>();
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (!address) return;

        // Initial fetch
        void dispatch(fetchRoyaltyData(address as `0x${string}`));

        // Set up interval for periodic checks
        intervalRef.current = setInterval(() => {
            void dispatch(fetchRoyaltyData(address as `0x${string}`));
        }, 120000); // 2 minutes
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [address, dispatch]);
}; 