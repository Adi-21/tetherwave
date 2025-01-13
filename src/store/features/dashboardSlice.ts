import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RecentIncomeEvents, UserStats, LegProgress, RoyaltyInfo } from '@/types/contract';

interface DashboardState {
    isLoading: boolean;
    referrerAddress: string;
    currentPage: number;
    recentIncomes: RecentIncomeEvents;
    userStatsData: UserStats;
    levelIncomesData: bigint[];
    itemsPerPage: number;
    royalty: {
        qualifiedTiers: boolean[];
        royaltyInfo: RoyaltyInfo | null;
        error: string | null;
        legProgress: {
            tier1: LegProgress;
            tier2: LegProgress;
            tier3: LegProgress;
            tier4: LegProgress;
        };
        isLoading: boolean;
    };
}

const initialState: DashboardState = {
    isLoading: true,
    referrerAddress: '',
    currentPage: 1,
    recentIncomes: {
        userAddresses: [],
        levelNumbers: [],
        amounts: [],
        timestamps: [],
        totalCount: 0
    },
    userStatsData: {
        directReferrals: 0,
        directCommissionEarned: BigInt(0),
        currentLevel: 0,
        totalEarnings: BigInt(0),
        levelIncomeEarned: BigInt(0),
        timestamp: Math.floor(Date.now() / 1000)
    },
    levelIncomesData: Array(10).fill(BigInt(0)),
    itemsPerPage: 5,
    royalty: {
        qualifiedTiers: [],
        royaltyInfo: null,
        error: null,
        legProgress: {
            tier1: { total: 6, requiredStrong: 3, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 2 },
            tier2: { total: 8, requiredStrong: 4, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 3 },
            tier3: { total: 10, requiredStrong: 5, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 4 },
            tier4: { total: 12, requiredStrong: 6, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 5 }
        },
        isLoading: false
    }
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setReferrerAddress: (state, action: PayloadAction<string>) => {
            state.referrerAddress = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setRoyaltyError: (state, action: PayloadAction<string | null>) => {
            state.royalty.error = action.payload;
        },
        setRoyaltyInfo: (state, action: PayloadAction<RoyaltyInfo>) => {
            state.royalty.royaltyInfo = action.payload;
        },
        setRoyaltyLoading: (state, action: PayloadAction<boolean>) => {
            state.royalty.isLoading = action.payload;
        }
    }
});

export const { setLoading, setReferrerAddress, setCurrentPage, setRoyaltyError, setRoyaltyInfo, setRoyaltyLoading } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const fetchRoyaltyData = createAsyncThunk(
    'dashboard/fetchRoyaltyData',
    async (_, { dispatch }) => {
        try {
            dispatch(setRoyaltyLoading(true));
            const response = await fetch('/api/royalty');
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message);
            
            dispatch(setRoyaltyInfo(data));
            return data;
        } catch (error) {
            dispatch(setRoyaltyError(error instanceof Error ? error.message : 'Failed to fetch'));
            throw error;
        } finally {
            dispatch(setRoyaltyLoading(false));
        }
    }
); 