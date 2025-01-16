import type { RoyaltyInfo } from '@/types/contract';
import { formatEther } from 'viem';

export const parseRoyaltyInfo = (
    result: [boolean[], string[], string[], string[], string[], boolean[]] | null
): RoyaltyInfo | null => {
    if (!result) return null;
    
    const [achievedTiers, paidDays, daysRemaining, nextClaimTime, totalEarned, qualifiedNewTiers] = result;
    
    return {
        achievedTiers,
        paidDays,
        daysRemaining,
        nextClaimTime,
        totalEarned,
        qualifiedNewTiers
    };
};

export const formatRoyaltyAmount = (amount: bigint): string => {
    return `${formatEther(amount)} USDT`;
}; 