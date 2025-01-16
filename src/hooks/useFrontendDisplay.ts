import { useState, useEffect } from 'react';
import { useFrontendId } from '@/contexts/FrontendIdContext';

export function useFrontendDisplay(address: string | undefined, isRegistered = true) {
    const [displayId, setDisplayId] = useState<string>('Loading...');
    const { getFrontendId } = useFrontendId();

    useEffect(() => {
        if (!address || !isRegistered) {
            const truncated = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Available';
            setDisplayId(truncated);
            return;
        }

        let isMounted = true;

        const fetchId = async () => {
            const id = await getFrontendId(address);
            if (isMounted) {
                setDisplayId(id);
            }
        };

        fetchId();

        return () => {
            isMounted = false;
        };
    }, [address, getFrontendId, isRegistered]);

    return displayId;
}