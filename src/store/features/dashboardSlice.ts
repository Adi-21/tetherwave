import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserStats, RecentIncomeEvents, Sponsor, RoyaltyInfo, LegProgress } from '@/types/contract';
import { useContract } from '@/hooks/useContract';
import { getContracts } from '@/lib/constants/contracts';

interface DashboardState {
    isLoading: boolean;
    error: string | null;
    referrerAddress: string;
    currentPage: number;
    recentIncomes: RecentIncomeEvents;
    userStatsData: UserStats | null;
    levelIncomesData: string[];
    itemsPerPage: number;
    isRegistered: boolean;
    currentLevel: number;
    directSponsor: Sponsor | null;
    matrixSponsor: Sponsor | null;
    upgradeReferralIncome: bigint | null;
    totalTeamSize: number;
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
    error: null,
    referrerAddress: '',
    currentPage: 1,
    recentIncomes: {
        userAddresses: [],
        levelNumbers: [],
        amounts: [],
        timestamps: [],
        totalCount: 0
    },
    userStatsData: null,
    levelIncomesData: Array(10).fill('0'),
    itemsPerPage: 5,
    isRegistered: false,
    currentLevel: 0,
    directSponsor: null,
    matrixSponsor: null,
    upgradeReferralIncome: null,
    totalTeamSize: 0,
    royalty: {
        qualifiedTiers: [],
        royaltyInfo: null,
        error: null,
        legProgress: {
            tier1: { total: 6, requiredStrong: 3, strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredLevel: 2 },
            tier2: { total: 8, requiredStrong: 4, strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredLevel: 3 },
            tier3: { total: 10, requiredStrong: 5, strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredLevel: 4 },
            tier4: { total: 12, requiredStrong: 6, strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredLevel: 5 }
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userStatsData = action.payload.stats;
                state.levelIncomesData = action.payload.levelIncomes;
                state.recentIncomes = action.payload.recentIncomes;
                state.directSponsor = action.payload.sponsors as Sponsor;
                state.matrixSponsor = action.payload.sponsors as Sponsor;
                state.currentLevel = action.payload.stats.currentLevel;
                state.isRegistered = action.payload.isRegistered;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    }
});

export const { setLoading, setReferrerAddress, setCurrentPage, setRoyaltyError, setRoyaltyInfo, setRoyaltyLoading } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();
            
            const [matrixPosition, stats] = await Promise.all([
                tetherWave.publicClient.readContract({
                    ...tetherWave,
                    functionName: 'getMatrixPosition',
                    args: [_address]
                }) as Promise<[string, string, number, [number, number, number]]>,
                
                tetherWave.publicClient.readContract({
                    ...tetherWave,
                    functionName: 'getUserStats',
                    args: [_address]
                }) as Promise<[number, number, bigint, bigint, bigint, number]>
            ]);

            if (!stats || !matrixPosition) {
                return rejectWithValue('Failed to fetch data');
            }

            // Transform into proper Sponsor structure
            const sponsorData: Sponsor = {
                directSponsor: [matrixPosition[0]],
                matrixSponsor: [matrixPosition[1]]
            };

            const [currentLevel, directReferrals, totalEarnings, directCommissionEarned, levelIncomeEarned, timestamp] = stats;

            const serializedStats: UserStats = {
                currentLevel: Number(currentLevel),
                directReferrals: Number(directReferrals),
                totalEarnings: totalEarnings.toString(),
                directCommissionEarned: directCommissionEarned.toString(),
                levelIncomeEarned: levelIncomeEarned.toString(),
                timestamp: Number(timestamp)
            };

            const data = {
                stats: serializedStats,
                sponsors: sponsorData,
                isRegistered: currentLevel > 0,
                levelIncomes: Array(10).fill('0'),
                recentIncomes: {
                    userAddresses: [],
                    levelNumbers: [],
                    amounts: [],
                    timestamps: [],
                    totalCount: 0
                } as RecentIncomeEvents
            };

            if (currentLevel > 0) {
                try {
                    const teamStats = await tetherWave.publicClient.readContract({
                        ...tetherWave,
                        functionName: 'getUserTeamStats',
                        args: [_address]
                    }) as [number[], bigint[]];

                    const recentInc = await tetherWave.publicClient.readContract({
                        ...tetherWave,
                        functionName: 'getRecentIncomeEventsPaginated',
                        args: [_address as `0x${string}`, BigInt(0), BigInt(5)]
                    }) as [string[], number[], bigint[], number[], bigint];
                    
                    console.log('Team Stats:', teamStats);
                    console.log('Recent Income Events:', recentInc);
                    
                    // Safely handle the team stats
                    if (teamStats && Array.isArray(teamStats[1])) {
                        data.levelIncomes = teamStats[1].map(income => income.toString());
                    }

                    // Safely handle recent income events
                    if (recentInc && Array.isArray(recentInc[0])) {
                        data.recentIncomes = {
                            userAddresses: recentInc[0] || [],
                            levelNumbers: recentInc[1] || [],
                            amounts: recentInc[2]?.map(n => n.toString()) || [],
                            timestamps: recentInc[3] || [],
                            totalCount: Number(recentInc[4]) || 0
                        };
                    }
                } catch (error) {
                    console.error('Failed to fetch additional data:', error);
                }
            }

            return data;
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch data');
        }
    }
);

// Register User
export const registerUser = createAsyncThunk(
    'dashboard/register',
    async ({ referrerAddress, balance }: { referrerAddress: string, balance: string }, { dispatch }) => {
        dispatch(setLoading(true));
        try {
            const contract = useContract();
            await contract.register(referrerAddress, balance);
            return await dispatch(fetchDashboardData('')).unwrap();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Upgrade User
export const upgradeUser = createAsyncThunk(
    'dashboard/upgrade',
    async ({ targetLevel, balance }: { targetLevel: number, balance: string }, { dispatch }) => {
        dispatch(setLoading(true));
        try {
            const contract = useContract();
            await contract.upgrade(targetLevel, balance);
            return await dispatch(fetchDashboardData('')).unwrap();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Upgrade failed';
            throw new Error(message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);