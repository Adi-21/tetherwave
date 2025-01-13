import { memo, useMemo } from 'react';
import type { TierCardProps } from '@/types/contract';
import TierStatus from './TierStatus';
import TierProgressBar from './TierProgressBar';
import TierStats from './TierStats';
import TierInfo from './TierInfo';
import { GRADIENTS } from '@/lib/constants';

const TierCard = memo(({
    slab,
    index,
    royaltyData,
    calculations
}: TierCardProps) => {
    const tierKey = `tier${index + 1}` as keyof typeof royaltyData.legProgress;
    const tier = royaltyData.legProgress[tierKey];

    const cardData = useMemo(() => ({
        strongProgress: calculations.strongLegProgress(tier),
        weakProgress: calculations.weakLegProgress(tier),
        isAchieved: royaltyData.royaltyInfo?.achievedTiers[index] ?? false,
        isQualified: (royaltyData.qualifiedTiers[index] && !royaltyData.royaltyInfo?.achievedTiers[index]) ?? false,
        stats: {
            totalPoolAmount: calculations.totalPoolAmount(),
            strongLeg: Number(tier.strongLeg),
            weakLeg: Number(tier.weakLeg1 + tier.weakLeg2),
            required: tier.requiredStrong
        }
    }), [calculations, tier, royaltyData, index]);

    return (
        <div className={`relative drop-shadow shadow-md px-4 lg:px-8 py-4 min-h-32 rounded-md overflow-hidden transition-all duration-300 ${GRADIENTS.card}`}>
            <TierInfo
                title={slab.title}
                isAchieved={cardData.isAchieved}
                isQualified={cardData.isQualified}
            />
            <div className="mt-2 space-y-2">
                <TierProgressBar
                    label="Strong Leg"
                    progress={cardData.strongProgress}
                    value={cardData.stats.strongLeg}
                    required={cardData.stats.required}
                    className="bg-green-600"
                />
                <TierProgressBar
                    label="Weak Leg"
                    progress={cardData.weakProgress}
                    value={cardData.stats.weakLeg}
                    required={cardData.stats.required}
                    className="bg-blue"
                />
                <TierStats
                    index={index}
                    totalPoolAmount={cardData.stats.totalPoolAmount}
                    royaltyInfo={royaltyData.royaltyInfo}
                />
                <TierStatus
                    isQualified={cardData.isQualified}
                    isAchieved={cardData.isAchieved}
                />
            </div>
        </div>
    );
});

TierCard.displayName = 'TierCard';

export default TierCard; 