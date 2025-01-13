import { memo, useMemo } from 'react';
import { LuHandCoins, LuBookmarkPlus, LuSquareArrowRight } from 'react-icons/lu';
import type { RoyaltyInfo } from '@/types/contract';

interface TierStatsProps {
    index: number;
    totalPoolAmount: string;
    royaltyInfo: RoyaltyInfo | null;
}

const TierStats = memo(({ index, totalPoolAmount, royaltyInfo }: TierStatsProps) => {
    const stats = useMemo(() => ({
        earned: royaltyInfo?.totalEarned[index] 
            ? `+${royaltyInfo.totalEarned[index]} USDT`
            : '0.00 USDT',
        pool: `${totalPoolAmount} USDT`,
        days: {
            paid: royaltyInfo?.paidDays[index]?.toString() || '0',
            remaining: royaltyInfo?.daysRemaining[index]?.toString() || '0'
        },
        nextClaim: royaltyInfo?.nextClaimTime[index]
            ? new Date(Number(royaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
            : 'N/A'
    }), [index, totalPoolAmount, royaltyInfo]);

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                        <LuHandCoins className="w-4 h-4" />
                        <span className="text-sm">Paid Days:</span>
                    </div>
                    <span className="font-medium">{stats.days.paid}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                        <LuBookmarkPlus className="w-4 h-4" />
                        <span className="text-sm">Days Remaining:</span>
                    </div>
                    <span className="font-medium text-red-500">{stats.days.remaining}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                        <LuSquareArrowRight className="w-4 h-4" />
                        <span className="text-sm">Next Claim:</span>
                    </div>
                    <span className="font-medium">{stats.nextClaim}</span>
                </div>
            </div>
        </div>
    );
});

TierStats.displayName = 'TierStats';

export default TierStats; 