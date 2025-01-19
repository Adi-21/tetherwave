import { memo, useMemo } from 'react';
import { TIER_AMOUNTS } from '@/lib/constants/royalty';
import type { RoyaltyInfo } from '@/types/contract';
import { formatRoyaltyAmount } from '@/lib/utils/contractHelpers';
import { HandCoins, BookmarkPlus, ArrowRightSquare } from 'lucide-react';

interface TierStatsProps {
    index: number;
    royaltyInfo: RoyaltyInfo | null;
}

interface StatBoxProps {
    title: string;
    value: string;
    alignRight?: boolean;
}

interface StatRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueClassName?: string;
}

const TierStats = memo(({ index, royaltyInfo }: TierStatsProps) => {
    const stats = useMemo(() => ({
        totalEarned: !royaltyInfo?.totalEarned[index]
            ? '0.00 USDT'
            : `+${formatRoyaltyAmount(BigInt(royaltyInfo.totalEarned[index]))}`,
        poolAmount: (() => {
            const totalDays = BigInt(500);
            const amount = TIER_AMOUNTS[index] * totalDays;
            return formatRoyaltyAmount(amount);
        })(),
        paidDays: royaltyInfo?.paidDays?.[index]
            ? Number(royaltyInfo.paidDays[index])
            : '0',
        daysRemaining: royaltyInfo?.daysRemaining?.[index]
            ? Number(royaltyInfo.daysRemaining[index])
            : '0',
            nextClaim: (() => {
                const timestamp = royaltyInfo?.nextClaimTime?.[index];
                if (!timestamp || timestamp === '0') return 'N/A';
                
                const date = new Date(Number(timestamp) * 1000);
                return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
            })()
    }), [royaltyInfo, index]);

    return (
        <div className="space-y-4">
            <StatRow
                icon={<HandCoins className="w-4 h-4" />}
                label="Paid Days"
                value={stats.paidDays.toString()}
            />

            <StatRow
                icon={<BookmarkPlus className="w-4 h-4" />}
                label="Days Remaining"
                value={stats.daysRemaining.toString()}
                valueClassName="font-semibold text-red-500"
            />

            <StatRow
                icon={<ArrowRightSquare className="w-4 h-4" />}
                label="Next Claim"
                value={stats.nextClaim.toString()}
            />

            <div className="flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-lg p-3 lg:p-4 drop-shadow-lg shadow">
                <StatBox
                    title="Total Earned"
                    value={stats.totalEarned.toString()}
                />
                <StatBox
                    title="Total Pool Amount"
                    value={stats.poolAmount.toString()}
                    alignRight
                />
            </div>
        </div>
    );
});

TierStats.displayName = 'TierStats';

// Extract repeated UI patterns into components
const StatRow = memo(({ icon, label, value, valueClassName = "font-medium" }: StatRowProps) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            {icon}
            <span className="text-sm">{label}:</span>
        </div>
        <span className={valueClassName}>{value}</span>
    </div>
));

StatRow.displayName = 'StatRow';

const StatBox = memo(({ title, value, alignRight }: StatBoxProps) => (
    <div className={`flex flex-col justify-between ${alignRight ? 'items-end' : 'items-center'}`}>
        <h3 className="lg:text-lg font-semibold">{title}</h3>
        <p className="text-lg lg:text-2xl font-bold text-green-600">{value}</p>
    </div>
));

StatBox.displayName = 'StatBox';

export default TierStats; 