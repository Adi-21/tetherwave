import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RecentIncomeEvents } from '@/types/contract';
import { getContracts, publicClient } from '@/lib/constants/contracts';
import { LEVELS } from '@/lib/constants';
import { dashboardAPI } from '@/services/api';

const REGISTRATION_COST = BigInt(11 * 10 ** 18);
const LEVEL_COSTS = {
    2: BigInt(22 * 10 ** 18),
    3: BigInt(44 * 10 ** 18),
    4: BigInt(88 * 10 ** 18),
    5: BigInt(176 * 10 ** 18),
    6: BigInt(352 * 10 ** 18),
    7: BigInt(704 * 10 ** 18),
    8: BigInt(1408 * 10 ** 18),
    9: BigInt(2816 * 10 ** 18),
    10: BigInt(5632 * 10 ** 18),
} as const;

interface ContractError {
    message?: string;
    code?: string;
}

// Component-specific states
interface ProfileState {
    isLoading: boolean;
    error: string | null;
    data: {
        currentLevel: number;
        levelName: string;
        directSponsor: string;
        matrixSponsor: string;
        userid?: string;
        created_at?: string;
        total_referrals?: number;
    };
}

interface WalletState {
    isLoading: boolean;
    error: string | null;
    data: {
        balance: string;
        referralCode: string;
    };
}

interface RegistrationState {
    isLoading: boolean;
    error: string | null;
    isRegistered: boolean;
    referrerAddress: {
        userId: string;
        walletAddress: string;
    };
}

interface PackagesState {
    isLoading: boolean;
    error: string | null;
    currentLevel: number;
    upgradeInProgress: boolean;
    isRegistered: boolean;
}

interface AllIncomesState {
    isLoading: boolean;
    error: string | null;
    data: {
        totalIncome: string;
        referralIncome: string;
        levelIncome: string;
        directReferrals: number;
        upgradeReferralIncome: string;
        totalTeamSize: number;
        magicIncome: string;
    };
}

interface RankIncomeState {
    isLoading: boolean;
    error: string | null;
    data: {
        levelIncomes: string[];
        directCommission: string;
    };
}

interface RecentIncomeState {
    isLoading: boolean;
    error: string | null;
    data: RecentIncomeEvents;
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
    };
    filterTypes: number[];
}

// Main dashboard state
export interface DashboardState {
    isLoading: boolean;
    profile: ProfileState;
    wallet: WalletState;
    registration: RegistrationState;
    packages: PackagesState;
    allIncomes: AllIncomesState;
    rankIncome: RankIncomeState;
    recentIncome: RecentIncomeState;
    globalError: string | null;
}

const initialState: DashboardState = {
    profile: {
        isLoading: true,
        error: null,
        data: {
            currentLevel: 0,
            levelName: 'Not Registered',
            directSponsor: '',
            matrixSponsor: ''
        }
    },
    wallet: {
        isLoading: false,
        error: null,
        data: {
            balance: '0',
            referralCode: ''
        }
    },
    registration: {
        isLoading: false,
        error: null,
        isRegistered: false,
        referrerAddress: {
            userId: '',
            walletAddress: ''
        }
    },
    packages: {
        isLoading: false,
        error: null,
        currentLevel: 0,
        upgradeInProgress: false,
        isRegistered: false
    },
    allIncomes: {
        isLoading: true,
        error: null,
        data: {
            totalIncome: '0',
            referralIncome: '0',
            levelIncome: '0',
            directReferrals: 0,
            upgradeReferralIncome: '0',
            totalTeamSize: 0,
            magicIncome: '0'
        }
    },
    rankIncome: {
        isLoading: true,
        error: null,
        data: {
            levelIncomes: Array(10).fill('0'),
            directCommission: '0'
        }
    },
    recentIncome: {
        isLoading: false,
        error: null,
        data: {
            userAddresses: [],
            levelNumbers: [],
            amounts: [],
            timestamps: [],
            incomeTypes: [],
            totalCount: 0
        },
        pagination: {
            currentPage: 1,
            itemsPerPage: 5,
            totalPages: 1
        },
        filterTypes: []
    },
    globalError: null,
    isLoading: true,
};

export const initializeReferral = createAsyncThunk(
    'dashboard/initializeReferral',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            // Check for query parameter format
            const params = new URLSearchParams(window.location.search);
            const queryRefId = params.get("ref");

            // Check for path format
            const pathParts = window.location.pathname.split('/');
            const pathRefId = pathParts[pathParts.length - 1];

            const refId = queryRefId || (pathParts[1] === 'referral' ? pathRefId : null);

            if (refId) {
                localStorage.setItem("tetherwave_refId", refId);
                const data = await dashboardAPI.getReferralInfo(refId);
                dispatch(setReferrerAddress({
                    userId: refId,
                    walletAddress: data.referring_wallet
                }));
                return refId;
            }
            return rejectWithValue('Failed to initialize referral');
        } catch {
            return rejectWithValue('Failed to initialize referral');
        }
    }
);

export const fetchReferrerData = createAsyncThunk(
    'dashboard/fetchReferrerData',
    async (address: string, { dispatch, rejectWithValue }) => {
        try {
            const storedRefId = localStorage.getItem("tetherwave_refId");
            if (!storedRefId || !address) return null;

            const data = await dashboardAPI.getReferralInfo(storedRefId);
            // Store both userId and wallet address
            dispatch(setReferrerAddress({
                userId: storedRefId,
                walletAddress: data.referring_wallet
            }));
            return {
                userId: storedRefId,
                walletAddress: data.referring_wallet
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch referrer');
        }
    }
);

// Thunks for Profile and Wallet
export const fetchProfileData = createAsyncThunk(
    'dashboard/fetchProfileData',
    async (address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();

            const userStats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [boolean, number, bigint, bigint, bigint, number, boolean];

            const matrixPosition = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getMatrixPosition',
                args: [address]
            }) as [string, string];

            const currentLevel = Number(userStats[0]);
            const levelName = LEVELS[currentLevel - 1]?.name || 'Not Registered';

            await new Promise(resolve => setTimeout(resolve, 5000));
            const data = await dashboardAPI.getUserProfile(address);

            return {
                currentLevel,
                levelName,
                directSponsor: matrixPosition[0],
                matrixSponsor: matrixPosition[1],
                userid: data.userid,
                created_at: data.created_at,
                total_referrals: data.total_referrals,
            };
        } catch {
            return rejectWithValue('Failed to fetch profile data');
        }
    }
);

// Registration thunk
export const register = createAsyncThunk(
    'dashboard/register',
    async ({
        referrerAddress,
        userAddress,
        balance
    }: {
        referrerAddress: {
            userId: string;
            walletAddress: string;
        };
        userAddress: string;
        balance: string;
    }, { rejectWithValue, dispatch }) => {
        try {
            const { tetherWave, usdt } = getContracts();

            const currentBalance = BigInt(Number.parseFloat(balance) * 10 ** 18);

            if (currentBalance < REGISTRATION_COST) {
                throw new Error(`Insufficient USDT balance for registration. You need 50 USDT but have ${balance} USDT.`);
            }

            const approveAmount = BigInt(11 * 10 ** 18);
            const approveHash = await usdt.walletClient.writeContract({
                ...usdt,
                functionName: 'approve',
                args: [tetherWave.address, approveAmount],
                account: userAddress as `0x${string}`
            });
            await publicClient.waitForTransactionReceipt({ hash: approveHash })

            const { request } = await tetherWave.publicClient.simulateContract({
                ...tetherWave,
                functionName: 'register',
                args: [referrerAddress.walletAddress],
                account: userAddress as `0x${string}`
            });

            const hash = await tetherWave.walletClient.writeContract(request);
            const receipt = await tetherWave.publicClient.waitForTransactionReceipt({ hash });

            if (receipt.status === 'success') {
                try {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    await dashboardAPI.registerWithReferral(userAddress, referrerAddress.userId);

                    localStorage.removeItem("tetherwave_refId");
                    await dispatch(fetchProfileData(userAddress));
                    await dispatch(fetchPackagesData(userAddress));

                    return { success: true, transactionHash: hash };
                } catch {
                    throw new Error('Backend registration failed');
                }
            }

            return rejectWithValue('Blockchain registration failed');
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to register');
        }
    }
);

// Upgrade package thunk
export const upgrade = createAsyncThunk(
    'dashboard/upgrade',
    async ({ targetLevel, userAddress }: {
        targetLevel: number;
        userAddress: string;
        balance: string;
    }, { rejectWithValue }) => {
        try {
            const { tetherWave, usdt } = getContracts();

            // Check USDT balance first
            const userBalance = await usdt.publicClient.readContract({
                ...usdt,
                functionName: 'balanceOf',
                args: [userAddress as `0x${string}`]
            }) as bigint;

            const requiredAmount = LEVEL_COSTS[targetLevel as keyof typeof LEVEL_COSTS];
            if (!requiredAmount) {
                return rejectWithValue('Invalid upgrade level');
            }

            if (userBalance < requiredAmount) {
                const formattedRequired = Number(requiredAmount) / 10 ** 18;
                const formattedBalance = Number(userBalance) / 10 ** 18;
                return rejectWithValue(`❌ Insufficient USDT Balance!\n\nRequired: ${formattedRequired} USDT\nYour Balance: ${formattedBalance} USDT`);
            }

            const approveAmount = BigInt(requiredAmount) * BigInt(10 ** 18)
            const approveHash = await usdt.walletClient.writeContract({
                ...usdt,
                functionName: 'approve',
                args: [tetherWave.address, approveAmount],
                account: userAddress as `0x${string}`
            });
            await publicClient.waitForTransactionReceipt({ hash: approveHash })

            const { request } = await tetherWave.publicClient.simulateContract({
                ...tetherWave,
                functionName: 'upgrade',
                args: [targetLevel],
                account: userAddress as `0x${string}`
            });

            const hash = await tetherWave.walletClient.writeContract(request);
            await tetherWave.publicClient.waitForTransactionReceipt({ hash });

            return { targetLevel, transactionHash: hash };
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null) {
                const err = error as ContractError;
                if (err.message?.includes('0xfb8f41b2')) {
                    return rejectWithValue('❌ Insufficient USDT Allowance!\nPlease approve USDT spending first.');
                }
                if (err.message?.includes('0xe450d38c')) {
                    return rejectWithValue('❌ Insufficient USDT Balance!\nPlease check your balance and try again.');
                }
                if (error instanceof Error) {
                    return rejectWithValue(error.message);
                }
            }

            return rejectWithValue('Upgrade failed');
        }
    }
);

// Add this thunk with the others
export const fetchAllIncomesData = createAsyncThunk(
    'dashboard/fetchAllIncomesData',
    async (address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();

            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserCompleteStats',
                args: [address]
            }) as [bigint, bigint, bigint, bigint, number, bigint, number];

            const result = {
                totalIncome: stats[0].toString(),
                referralIncome: stats[1].toString(),
                levelIncome: stats[2].toString(),
                upgradeReferralIncome: stats[3].toString(),
                totalTeamSize: Number(stats[4]),
                magicIncome: stats[5].toString(),
                directReferrals: Number(stats[6])
            };
            return result;
        } catch {
            return rejectWithValue('Failed to fetch all incomes data');
        }
    }
);

// Add these thunks with others
export const fetchRecentIncomeData = createAsyncThunk(
    'dashboard/fetchRecentIncomeData',
    async ({
        address,
        page,
        itemsPerPage,
        filterTypes = [],
    }: {
        address: string;
        page: number;
        itemsPerPage: number;
        filterTypes: number[];
    }, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();
            
            // Fetch all data first
            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEventsPaginated',
                args: [address as `0x${string}`, BigInt(0), BigInt(1000), filterTypes] // Fetch more data
            }) as [string[], number[], bigint[], number[], number[], bigint];

            const [userAddresses, levelNumbers, amounts, timestamps, incomeTypes, totalCount] = data;
            
            // Sort all entries by timestamp (newest first)
            const entries = userAddresses.map((_, i) => ({
                address: userAddresses[i],
                levelNumber: levelNumbers[i],
                amount: amounts[i].toString(),
                timestamp: timestamps[i],
                incomeType: incomeTypes[i]
            }));

            entries.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

            // Calculate pagination slice
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedEntries = entries.slice(start, end);

            return {
                userAddresses: paginatedEntries.map(e => e.address),
                levelNumbers: paginatedEntries.map(e => e.levelNumber),
                amounts: paginatedEntries.map(e => e.amount),
                timestamps: paginatedEntries.map(e => e.timestamp),
                incomeTypes: paginatedEntries.map(e => Number(e.incomeType)),
                totalCount: Number(totalCount)
            };
        } catch {
            return rejectWithValue('Failed to fetch recent income data');
        }
    }
);

export const fetchRankIncomeData = createAsyncThunk(
    'dashboard/fetchRankIncomeData',
    async (address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();

            // Fetch level incomes with proper type assertion
            const levelIncomes = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserTeamStats',
                args: [address]
            }) as [number[], bigint[]];

            // Fetch user stats with proper type assertion
            const userStats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [number, number, bigint, bigint, bigint, number, boolean];

            const result = {
                levelIncomes: levelIncomes[1].map(income => income.toString()),
                directCommission: userStats[3].toString()
            };
            return result;
        } catch {
            return rejectWithValue('Failed to fetch rank income data');
        }
    }
);

export const fetchPackagesData = createAsyncThunk(
    'dashboard/fetchPackagesData',
    async (address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();

            const userStats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [boolean, bigint, bigint, bigint, bigint, bigint];

            return {
                currentLevel: Number(userStats[0]),
                isRegistered: Boolean(userStats[0])
            };
        } catch {
            return rejectWithValue('Failed to fetch packages data');
        }
    }
);

export const fetchWalletData = createAsyncThunk(
    'dashboard/fetchWalletData',
    async (address: string, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();

            const referralCode = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getReferralCode',
                args: [address]
            }) as string;

            return {
                referralCode
            };
        } catch {
            return rejectWithValue('Failed to fetch wallet data');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<{ isLoading: boolean; error: string }>) => {
            state.isLoading = action.payload.isLoading;
            state.globalError = action.payload.error;
        },
        setReferrerAddress: (state, action: PayloadAction<{ userId: string; walletAddress: string }>) => {
            state.registration.referrerAddress = action.payload;
        },
        resetRegistrationError: (state) => {
            state.registration.error = null;
        },
        resetUpgradeError: (state) => {
            state.packages.error = null;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.recentIncome.pagination.currentPage = action.payload;
        },
        setRecentIncomeFilterTypes: (state, action: PayloadAction<number[]>) => {
            state.recentIncome.filterTypes = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            // Profile reducers
            .addCase(fetchProfileData.pending, (state) => {
                state.profile.isLoading = true;
                state.profile.error = null;
            })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                state.profile.isLoading = false;
                state.profile.data = action.payload;
            })
            .addCase(fetchProfileData.rejected, (state, action) => {
                state.profile.isLoading = false;
                state.profile.error = action.error.message || 'Failed to fetch profile';
            })

            // Registration reducers
            .addCase(register.pending, (state) => {
                state.registration.isLoading = true;
                state.registration.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.registration.isLoading = false;
                state.registration.isRegistered = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.registration.isLoading = false;
                state.registration.error = action.error.message || 'Registration failed';
            })

            // Upgrade reducers
            .addCase(upgrade.pending, (state) => {
                state.packages.isLoading = true;
                state.packages.upgradeInProgress = true;
                state.packages.error = null;
            })
            .addCase(upgrade.fulfilled, (state, action) => {
                state.packages.isLoading = false;
                state.packages.upgradeInProgress = false;
                state.packages.currentLevel = action.payload.targetLevel;
            })
            .addCase(upgrade.rejected, (state, action) => {
                state.packages.isLoading = false;
                state.packages.upgradeInProgress = false;
                state.packages.error = action.error.message || 'Upgrade failed';
            })

            // AllIncomes reducers
            .addCase(fetchAllIncomesData.pending, (state) => {
                state.allIncomes.isLoading = true;
                state.allIncomes.error = null;
            })
            .addCase(fetchAllIncomesData.fulfilled, (state, action) => {
                state.allIncomes.isLoading = false;
                state.allIncomes.data = action.payload;
            })
            .addCase(fetchAllIncomesData.rejected, (state, action) => {
                state.allIncomes.isLoading = false;
                state.allIncomes.error = action.error.message || 'Failed to fetch income data';
            })

            // RecentIncome reducers
            .addCase(fetchRecentIncomeData.pending, (state) => {
                state.recentIncome.isLoading = true;
                state.recentIncome.error = null;
            })
            .addCase(fetchRecentIncomeData.fulfilled, (state, action) => {
                state.recentIncome.isLoading = false;
                state.recentIncome.data = action.payload;
                state.recentIncome.pagination.totalPages = Math.ceil(
                    action.payload.totalCount / state.recentIncome.pagination.itemsPerPage
                );
                state.recentIncome.filterTypes = action.payload.incomeTypes;
            })
            .addCase(fetchRecentIncomeData.rejected, (state, action) => {
                state.recentIncome.isLoading = false;
                state.recentIncome.error = action.error.message || 'Failed to fetch recent income data';
            })

            // RankIncome reducers
            .addCase(fetchRankIncomeData.pending, (state) => {
                state.rankIncome.isLoading = true;
                state.rankIncome.error = null;
            })
            .addCase(fetchRankIncomeData.fulfilled, (state, action) => {
                state.rankIncome.isLoading = false;
                state.rankIncome.data = {
                    levelIncomes: action.payload.levelIncomes,
                    directCommission: action.payload.directCommission
                };
            })
            .addCase(fetchRankIncomeData.rejected, (state, action) => {
                state.rankIncome.isLoading = false;
                state.rankIncome.error = action.error.message || 'Failed to fetch rank income data';
            })

            // Packages reducers
            .addCase(fetchPackagesData.pending, (state) => {
                state.packages.isLoading = true;
                state.packages.error = null;
            })
            .addCase(fetchPackagesData.fulfilled, (state, action) => {
                state.packages.isLoading = false;
                state.packages.currentLevel = action.payload.currentLevel;
                state.packages.isRegistered = action.payload.isRegistered;
            })
            .addCase(fetchPackagesData.rejected, (state, action) => {
                state.packages.isLoading = false;
                state.packages.error = action.error.message || 'Failed to fetch packages data';
            })

            // Wallet reducers
            .addCase(fetchWalletData.pending, (state) => {
                state.wallet.isLoading = true;
                state.wallet.error = null;
            })
            .addCase(fetchWalletData.fulfilled, (state, action) => {
                state.wallet.isLoading = false;
                state.wallet.data = {
                    balance: '0',
                    referralCode: action.payload.referralCode
                };
            })
            .addCase(fetchWalletData.rejected, (state, action) => {
                state.wallet.isLoading = false;
                state.wallet.error = action.error.message || 'Failed to fetch wallet data';
            });
    }
});

export const {
    setReferrerAddress,
    resetRegistrationError,
    resetUpgradeError,
    setCurrentPage,
    setRecentIncomeFilterTypes,
    setLoading
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
