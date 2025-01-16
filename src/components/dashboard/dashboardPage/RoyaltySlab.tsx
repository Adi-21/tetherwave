'use client';

import { memo, useEffect } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { SLABS, TIER_AMOUNTS } from '@/lib/constants';
import type { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { 
    fetchRoyaltyData, 
    registerTier, 
    distributeTierRoyalty 
} from '@/store/features/royaltySlice';
import TierCard from './royalty/TierCard';
import Skeleton from '@/components/common/Skeleton';
import type { AppDispatch } from '@/store';
import type { LegProgress, RoyaltyInfo } from '@/types/contract';
import { formatRoyaltyAmount } from '@/lib/utils/contractHelpers';
const RoyaltySlab = memo(() => {
    const dispatch = useDispatch<AppDispatch>();
    const { address } = useAccount();
    const {     
        qualifiedTiers, 
        royaltyInfo, 
        legProgress, 
        isLoading,
    } = useSelector((state: RootState) => state.royalty);

    useEffect(() => {
        if (address) {
            dispatch(fetchRoyaltyData(address));
            const interval = setInterval(() => {
                dispatch(fetchRoyaltyData(address));
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [address, dispatch]);

    return (
        <div className="w-full h-[800px]">
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={SLABS.length}
                        rowHeight={450}
                        rowRenderer={({ index, key, style }) => (
                            <div key={key} style={style}>
                                {isLoading ? (
                                    <div className="animate-pulse">
                                        <Skeleton className="h-[400px] w-full rounded-md bg-gray-200 dark:bg-gray-700 space-y-8" />
                                    </div>
                                ) : (
                                    <TierCard
                                        slab={SLABS[index]}
                                        index={index}
                                        royaltyData={{
                                            qualifiedTiers,
                                            royaltyInfo: royaltyInfo as RoyaltyInfo,
                                            legProgress,
                                        }}
                                        calculations={{
                                            totalPoolAmount: () => {
                                                const totalDays = BigInt(500);
                                                return formatRoyaltyAmount(TIER_AMOUNTS[index] * totalDays);
                                            },
                                            strongLegProgress: (tier: LegProgress) => {
                                                const progress = (Number(tier.strongLeg) / tier.requiredStrong) * 100;
                                                return Math.min(progress, 100);
                                            },
                                            weakLegProgress: (tier: LegProgress) => {
                                                const weakLegTotal = Number(tier.weakLeg1) + Number(tier.weakLeg2);
                                                const progress = (weakLegTotal / tier.requiredStrong) * 100;
                                                return Math.min(progress, 100);
                                            }
                                        }}
                                        onRegister={async () => {
                                            if (address) {
                                                await dispatch(registerTier(address));
                                            }
                                        }}
                                        onDistribute={async (index: number) => {
                                            if (address) {
                                                await dispatch(distributeTierRoyalty(index));
                                            }
                                        }}
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
