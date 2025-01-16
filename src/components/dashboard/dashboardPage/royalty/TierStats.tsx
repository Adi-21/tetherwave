import { memo, useMemo } from 'react';
import { TIER_AMOUNTS } from '@/lib/constants/royalty';
import type { RoyaltyInfo } from '@/types/contract';
import { formatRoyaltyAmount } from '@/lib/utils/contractHelpers';
import { HandCoins, BookmarkPlus, ArrowRightSquare } from 'lucide-react';

interface TierStatsProps {
    index: number;
    royaltyInfo: RoyaltyInfo | null;
}

const TierStats = memo(({ index, royaltyInfo }: TierStatsProps) => {
    const totalEarned = useMemo(() => {
        if (!royaltyInfo?.totalEarned[index]) return '0.00 USDT';
        return `+${formatRoyaltyAmount(BigInt(royaltyInfo.totalEarned[index]))}`;
    }, [royaltyInfo?.totalEarned, index]);

    const poolAmount = useMemo(() => {
        const totalDays = BigInt(500);
        const amount = TIER_AMOUNTS[index] * totalDays;
        return `${formatRoyaltyAmount(amount)}`;
    }, [index]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <HandCoins className="w-4 h-4" />
                    <span className="text-sm">Paid Days:</span>
                </div>
                <span className="font-medium">
                    {royaltyInfo?.paidDays?.[index] ? Number(royaltyInfo.paidDays[index]) : '0'}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <BookmarkPlus className="w-4 h-4" />
                    <span className="text-sm">Days Remaining:</span>
                </div>
                <span className="font-semibold text-red-500">
                    {royaltyInfo?.daysRemaining?.[index] ? Number(royaltyInfo.daysRemaining[index]) : '0'}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <ArrowRightSquare className="w-4 h-4" />
                    <span className="text-sm">Next Claim:</span>
                </div>
                <span className="font-medium">
                    {royaltyInfo?.nextClaimTime?.[index]
                        ? new Date(Number(royaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
                        : 'N/A'
                    }
                </span>
            </div>

            <div className="flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-lg p-3 lg:p-4 drop-shadow-lg shadow">
                <div className="flex flex-col justify-between items-center">
                    <h3 className="text-lg font-semibold">Total Earned</h3>
                    <p className="text-2xl font-bold text-green-600">{totalEarned}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                    <h3 className="text-lg font-semibold">Total Pool Amount</h3>
                    <p className="text-2xl font-bold text-green-600">{poolAmount}</p>
                </div>
            </div>
        </div>
    );
});

TierStats.displayName = 'TierStats';

export default TierStats; 