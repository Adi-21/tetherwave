import { memo, useMemo, useEffect } from 'react';
import type { TierCardProps } from '@/types/contract';
import { useDispatch } from 'react-redux';
import { registerTier, distributeTierRoyalty } from '@/store/features/royaltySlice';
import TierStatus from './TierStatus';
import TierProgressBar from './TierProgressBar';
import TierStats from './TierStats';
import TierInfo from './TierInfo';
import { GRADIENTS } from '@/lib/constants';
import { formatRoyaltyAmount } from '@/lib/utils/contractHelpers';
import type { AppDispatch } from '@/store';
import { useAccount } from 'wagmi';

const TierCard = memo(({
    slab,
    index,
    royaltyData,
    calculations,
}: TierCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { address } = useAccount();
    const tierKey = `tier${index + 1}` as keyof typeof royaltyData.legProgress;
    const tier = royaltyData.legProgress[tierKey];

    const cardData = useMemo(() => ({
        isAchieved: royaltyData.royaltyInfo?.achievedTiers?.[index] ?? false,
        isQualified: (royaltyData.qualifiedTiers?.[index] && !royaltyData.royaltyInfo?.achievedTiers?.[index]) ?? false,
        stats: {
            strongLeg: Number(tier.strongLeg),
            weakLeg: Number(tier.weakLeg1) + Number(tier.weakLeg2),
            required: tier.requiredStrong,
            paidDays: royaltyData.royaltyInfo?.paidDays?.[index] ?? '0',
            daysRemaining: royaltyData.royaltyInfo?.daysRemaining?.[index] ?? '0',
            nextClaim: royaltyData.royaltyInfo?.nextClaimTime?.[index]
                ? new Date(Number(royaltyData.royaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
                : 'N/A',
            earned: royaltyData.royaltyInfo?.totalEarned?.[index]
                ? formatRoyaltyAmount(BigInt(royaltyData.royaltyInfo.totalEarned[index]))
                : '0.00 USDT'
        }
    }), [tier, royaltyData, index]);

    // Auto-register when qualified (once per 24 hours)
    useEffect(() => {
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const lastRegistrationAttempt = localStorage.getItem(`lastRegistrationAttempt_${index}`);
        const now = Date.now();

        const autoRegister = async () => {
            if (cardData.isQualified && !cardData.isAchieved && address) {
                localStorage.setItem(`lastRegistrationAttempt_${index}`, now.toString());
                await dispatch(registerTier(address));
            }
        };

        const autoDistribute = async () => {
            if (address && Number(cardData.stats.daysRemaining) > 0) {
                await dispatch(distributeTierRoyalty(index));
            }
        };

        if (!lastRegistrationAttempt || (now - Number(lastRegistrationAttempt)) > TWENTY_FOUR_HOURS) {
            autoRegister();
        }

        if (cardData.isAchieved && Number(cardData.stats.daysRemaining) > 0) {
            autoDistribute();
        }
    }, [cardData.isQualified, cardData.isAchieved, cardData.stats.daysRemaining, address, dispatch, index]);

    // const handleDistribute = async () => {
    //     if (address) {
    //         await dispatch(distributeTierRoyalty(index));
    //     }
    // };

    return (
        <div className={`relative drop-shadow shadow-md px-4 lg:px-8 py-4 min-h-48 rounded-md overflow-hidden transition-all duration-300 ${GRADIENTS.card}`}>
            <TierInfo
                title={slab.title}
                isAchieved={cardData.isAchieved}
                isQualified={cardData.isQualified}
            />
            <div className="mt-2 space-y-4">
                <div className="flex flex-col gap-4">
                    <TierProgressBar
                        label="Strong Leg"
                        progress={calculations.strongLegProgress(tier)}
                        value={cardData.stats.strongLeg}
                        required={cardData.stats.required}
                        className="bg-green-600"
                    />
                    <TierProgressBar
                        label="Weak Leg"
                        progress={calculations.weakLegProgress(tier)}
                        value={cardData.stats.weakLeg}
                        required={cardData.stats.required}
                        className="bg-blue"
                    />
                </div>

                <TierStats 
                    index={index}
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