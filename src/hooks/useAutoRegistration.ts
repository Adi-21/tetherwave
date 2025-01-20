import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { registerTier, distributeTierRoyalty } from '@/store/features/royaltySlice';
// import toast from 'react-hot-toast';

export const useAutoRegistration = (
    index: number,
    address: string | undefined,
    isQualified: boolean,
    isAchieved: boolean,
    daysRemaining: string
) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const TWENTY_FOUR_HOURS = 2 * 60 * 1000;
        const lastRegistrationAttempt = localStorage.getItem(`lastRegistrationAttempt_${index}`);
        const now = Date.now();

        // const attemptRegistration = useCallback(async () => {
        //     if (!address || !isQualified || isAchieved || daysRemaining !== '0') return;

        //     try {
        //         await dispatch(registerTier(address as `0x${string}`)).unwrap();
        //         toast.success(`Successfully registered for Tier ${index + 1}!`);
        //     } catch (error) {
        //         console.error('Auto-registration failed:', error);
        //         // Don't show error toast as it might be spammy
        //     }
        // }, [address, isQualified, isAchieved, daysRemaining, index, dispatch,]);

        // useEffect(() => {
        //     void attemptRegistration();
        // }, [attemptRegistration]);

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