import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { registerTier, distributeTierRoyalty } from '@/store/features/royaltySlice';

export const useAutoRegistration = (
    index: number,
    address: string | undefined,
    isQualified: boolean,
    isAchieved: boolean,
    daysRemaining: string
) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        const lastRegistrationAttempt = localStorage.getItem(`lastRegistrationAttempt_${index}`);
        const now = Date.now();

        const autoRegister = async () => {
            if (isQualified && !isAchieved && address) {
                localStorage.setItem(`lastRegistrationAttempt_${index}`, now.toString());
                await dispatch(registerTier(address as `0x${string}`));
            }
        };

        const autoDistribute = async () => {
            if (address && Number(daysRemaining) > 0) {
                await dispatch(distributeTierRoyalty(index));
            }
        };

        if (!lastRegistrationAttempt || (now - Number(lastRegistrationAttempt)) > TWENTY_FOUR_HOURS) {
            void autoRegister();
        }

        if (isAchieved && Number(daysRemaining) > 0) {
            void autoDistribute();
        }
    }, [index, address, isQualified, isAchieved, daysRemaining, dispatch]);
}; 