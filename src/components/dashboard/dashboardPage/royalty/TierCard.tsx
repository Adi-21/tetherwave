import { memo, useMemo, lazy, Suspense } from 'react';
import type { LegProgress, TierCardProps } from '@/types/contract';
import { useAccount } from 'wagmi';
import Skeleton from '@/components/common/Skeleton';
import { useAutoRegistration } from '@/hooks/useAutoRegistration';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const TierInfo = lazy(() => import('./TierInfo'));
const TierProgressBar = lazy(() => import('./TierProgressBar'));
const TierStats = lazy(() => import('./TierStats'));
const TierStatus = lazy(() => import('./TierStatus'));

const TierCard = memo(({
    slab,
    index,
    royaltyData,
    calculations,
}: TierCardProps) => {
    const { address } = useAccount();
    
    // Memoize all data transformations
    const data = useMemo(() => {
        const tierKey = `tier${index + 1}` as keyof typeof royaltyData.legProgress;
        const tier = royaltyData.legProgress[tierKey];
        
        return {
            tier,
            stats: {
                strongLeg: Number(tier?.strongLeg ?? 0),
                weakLeg: Number(tier?.weakLeg1 ?? 0) + Number(tier?.weakLeg2 ?? 0),
                required: tier?.requiredStrong ?? 0,
            },
            status: {
                isAchieved: royaltyData.royaltyInfo?.achievedTiers?.[index] ?? false,
                isQualified: (royaltyData.qualifiedTiers?.[index] && !royaltyData.royaltyInfo?.achievedTiers?.[index]) ?? false,
            },
            daysRemaining: royaltyData.royaltyInfo?.daysRemaining?.[index] ?? '0'
        };
    }, [royaltyData, index]);

    useAutoRegistration(
        index,
        address,
        data.status.isQualified,
        data.status.isAchieved,
        data.daysRemaining
    );

    return (
        <ErrorBoundary fallback={<div>Error loading tier card</div>}>
            <div className="relative min-h-[450px]">
                <div className="relative z-20 px-4 lg:px-8 space-y-4">
                    <Suspense fallback={<Skeleton className="h-12" />}>
                        <TierInfo {...{
                            title: slab.title,
                            isAchieved: data.status.isAchieved,
                            isQualified: data.status.isQualified
                        }} />
                    </Suspense>
                    
                    <div className="mt-2 space-y-4">
                        <Suspense fallback={<Skeleton className="h-24" />}>
                            <div className="flex flex-col gap-4">
                                <TierProgressBar
                                    label="Strong Leg"
                                    {...{
                                        progress: calculations.strongLegProgress(data.tier as LegProgress),
                                        value: data.stats.strongLeg,
                                        required: data.stats.required
                                    }}
                                    className="bg-green-600"
                                />
                                <TierProgressBar
                                    label="Weak Leg"
                                    {...{
                                        progress: calculations.weakLegProgress(data.tier as LegProgress),
                                        value: data.stats.weakLeg,
                                        required: data.stats.required
                                    }}
                                    className="bg-blue"
                                />
                            </div>
                        </Suspense>
                    </div>

                    <Suspense fallback={<Skeleton className="h-32" />}>
                        <TierStats 
                            index={index}
                            royaltyInfo={royaltyData.royaltyInfo}
                        />
                    </Suspense>

                    <Suspense fallback={<Skeleton className="h-8" />}>
                        <TierStatus {...data.status} />
                    </Suspense>
                </div>
            </div>
        </ErrorBoundary>
    );
});

TierCard.displayName = 'TierCard';

export default TierCard; 