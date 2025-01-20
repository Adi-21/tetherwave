'use client';

import { memo, useMemo, useCallback, useEffect } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { SLABS, TIER_AMOUNTS } from '@/lib/constants';
import type { RootState } from '@/store';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { 
    registerTier, 
    distributeTierRoyalty 
} from '@/store/features/royaltySlice';
import TierCard from './royalty/TierCard';
import Skeleton from '@/components/common/Skeleton';
import type { AppDispatch } from '@/store';
import type { LegProgress } from '@/types/contract';
import { fetchRoyaltyData } from '@/store/features/royaltySlice';
import { formatRoyaltyAmount } from '@/lib/utils/contractHelpers';
import { useRoyaltyCheck } from '@/hooks/useRoyaltyCheck';

const RoyaltySlab = memo(() => {
    const dispatch = useDispatch<AppDispatch>();
    const { address } = useAccount();
    
    // Use periodic checking
    useRoyaltyCheck(address);
    
    const isLoading = useSelector((state: RootState) => state.royalty.isLoading);
    const royaltyData = useSelector((state: RootState) => ({
        qualifiedTiers: state.royalty.qualifiedTiers,
        royaltyInfo: state.royalty.royaltyInfo,
        legProgress: state.royalty.legProgress
    }), shallowEqual);

    // Fetch data only once when address changes
    useEffect(() => {
        if (address) {
            void dispatch(fetchRoyaltyData(address));
        }
    }, [address, dispatch]);

    // Memoize calculations once
    const calculations = useMemo(() => ({
        totalPoolAmount: (index: number) => {
            const totalDays = BigInt(500);
            return formatRoyaltyAmount(TIER_AMOUNTS[index] * totalDays);
        },
        strongLegProgress: (tier: LegProgress) => {
            if (!tier) return 0;
            const strongLegValue = Number(tier.strongLeg);
            return Math.min((strongLegValue / tier.requiredStrong) * 100, 100);
        },
        weakLegProgress: (tier: LegProgress) => {
            if (!tier) return 0;
            const weakLegTotal = Number(tier.weakLeg1) + Number(tier.weakLeg2);
            // Use requiredStrong instead of strongLeg value
            return Math.min((weakLegTotal / tier.requiredStrong) * 100, 100);
        }
    }), []);

    // Memoize row data to prevent re-creation during scroll
    const rowData = useMemo(() => 
        SLABS.map((slab, index) => ({
            slab,
            index,
            royaltyData,
            calculations,
            onRegister: async () => {
                if (address) await dispatch(registerTier(address));
            },
            onDistribute: async () => {
                if (address) await dispatch(distributeTierRoyalty(index));
            }
        }))
    , [royaltyData, calculations, address, dispatch]);

    const rowRenderer = useCallback(({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => (
        <div key={key} style={style} className="py-2">
            {isLoading ? (
                <Skeleton className="min-h-[400px] lg:h-[400px] w-full rounded-md" />
            ) : (
                <TierCard {...rowData[index]} />
            )}
        </div>
    ), [isLoading, rowData]);

    return (
        <div className="w-full min-h-[800px] lg:h-[800px]">
            <AutoSizer>
                {({ width, height }) => (
                    <List
                        width={width}
                        height={height}
                        rowCount={SLABS.length}
                        rowHeight={450}
                        rowRenderer={rowRenderer}
                        overscanRowCount={1}
                        scrollToAlignment="start"
                        className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                    />
                )}
            </AutoSizer>
        </div>
    );
});

RoyaltySlab.displayName = 'RoyaltySlab';

export default RoyaltySlab;
