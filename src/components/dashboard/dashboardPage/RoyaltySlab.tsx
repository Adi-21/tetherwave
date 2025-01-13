'use client';

import { memo, useMemo } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { SLABS, TIER_AMOUNTS } from '@/lib/constants';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import TierCard from './royalty/TierCard';
import Skeleton from '@/components/common/Skeleton';
import type { LegProgress } from '@/types/contract';

const RoyaltySlab = memo(() => {
    const { royalty, isLoading } = useSelector((state: RootState) => state.dashboard);

    const calculations = useMemo(() => SLABS.map((_, index) => ({
        totalPoolAmount: () => (TIER_AMOUNTS[index] * BigInt(500)).toString(),
        strongLegProgress: (tier: LegProgress) => {
            const strongLegValue = Number(tier.strongLeg);
            return strongLegValue >= tier.requiredStrong ? 100 : 
                Math.min((strongLegValue / tier.requiredStrong) * 100, 100);
        },
        weakLegProgress: (tier: LegProgress) => {
            const weakLegTotal = Number(tier.weakLeg1 + tier.weakLeg2);
            return weakLegTotal >= tier.requiredStrong ? 100 :
                Math.min((weakLegTotal / tier.requiredStrong) * 100, 100);
        }
    })), []);

    return (
        <div className="w-full h-[800px]">
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={SLABS.length}
                        rowHeight={400}
                        rowRenderer={({ index, key, style }) => (
                            <div key={key} style={style}>
                                {isLoading ? (
                                    <Skeleton className="h-[400px] w-full rounded-md" />
                                ) : (
                                    <TierCard
                                        slab={SLABS[index]}
                                        index={index}
                                        royaltyData={royalty}
                                        calculations={calculations[index]}
                                    />
                                )}
                            </div>
                        )}
                    />
                )}
            </AutoSizer>
        </div>
    );
});

RoyaltySlab.displayName = 'RoyaltySlab';

export default RoyaltySlab;
