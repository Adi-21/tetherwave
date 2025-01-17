import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserStats, RecentIncomeEvents, Sponsor, RoyaltyInfo, LegProgress } from '@/types/contract';
import { getContracts } from '@/lib/constants/contracts';
import { LEVELS } from '@/lib/constants';

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

// Component-specific states
interface ProfileState {
    isLoading: boolean;
    error: string | null;
    data: {
        currentLevel: number;
        levelName: string;
        directSponsor: string;
        matrixSponsor: string;
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
    referrerAddress: string;
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
}

// Main dashboard state
export interface DashboardState {
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
        referrerAddress: ''
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
            totalTeamSize: 0
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
        isLoading: true,
        error: null,
        data: {
            userAddresses: [],
            levelNumbers: [],
            amounts: [],
            timestamps: [],
            totalCount: 0
        },
        pagination: {
            currentPage: 1,
            itemsPerPage: 5,
            totalPages: 1
        }
    },
    globalError: null
};

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
            const levelName = LEVELS[currentLevel]?.name || 'Not Registered';

            return {
                currentLevel,
                levelName,
                directSponsor: matrixPosition[0],
                matrixSponsor: matrixPosition[1],
            };
        } catch (error) {
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
        referrerAddress: string; 
        userAddress: string;
        balance: string;
    }, { rejectWithValue }) => {
        try {
            const { tetherWave, usdt } = getContracts();
            
            const currentBalance = BigInt(Number.parseFloat(balance) * 10 ** 18);
            
            if (currentBalance < REGISTRATION_COST) {
                throw new Error(`Insufficient USDT balance for registration. You need 50 USDT but have ${balance} USDT.`);
            }
    
            const approveAmount = BigInt(10000 * 10 ** 18);
            const allowance = await usdt.publicClient.readContract({
                ...usdt,
                functionName: 'allowance',
                args: [userAddress as `0x${string}`, tetherWave.address]
            }) as bigint;
    
            if (allowance < approveAmount) {
                const approveHash = await usdt.walletClient.writeContract({
                    ...usdt,
                    functionName: 'approve',
                    args: [tetherWave.address, approveAmount],
                    account: userAddress as `0x${string}`
                });
                await tetherWave.publicClient.waitForTransactionReceipt({ hash: approveHash });
            }
    
            const { request } = await tetherWave.publicClient.simulateContract({
                ...tetherWave,
                functionName: 'register',
                args: [referrerAddress],
                account: userAddress as `0x${string}`
            });
    
            const hash = await tetherWave.walletClient.writeContract(request);
            const receipt = await tetherWave.publicClient.waitForTransactionReceipt({ hash });

            if (receipt.status === 'success') {
                return { success: true, transactionHash: hash };
            }
            return rejectWithValue('Registration failed');
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
    async ({ targetLevel, userAddress, balance }: { 
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

            // Check allowance
            const approveAmount = BigInt(10000 * 10 ** 18);
            const allowance = await usdt.publicClient.readContract({
                ...usdt,
                functionName: 'allowance',
                args: [userAddress as `0x${string}`, tetherWave.address]
            }) as bigint;

            if (allowance < approveAmount) {
                const approveHash = await usdt.walletClient.writeContract({
                    ...usdt,
                    functionName: 'approve',
                    args: [tetherWave.address, approveAmount],
                    account: userAddress as `0x${string}`
                });
                await tetherWave.publicClient.waitForTransactionReceipt({ hash: approveHash });
            }

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
            console.error('Contract error:', error);
            
            if (typeof error === 'object' && error !== null) {
                const err = error as any;
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

            // Fetch user stats
            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [number, number, bigint, bigint, bigint, number, boolean];

            // Fetch team size
            const teamSize = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getTeamSizes',
                args: [address]
            }) as number[];

            const upgradeReferralIncome = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUpgradeReferralIncome',
                args: [address]
            }) as bigint;

            const result = {
                directReferrals: Number(stats[1]),
                totalIncome: stats[2].toString(),
                referralIncome: stats[3].toString(),
                levelIncome: stats[4].toString(),
                upgradeReferralIncome: upgradeReferralIncome.toString(),
                totalTeamSize: Number(teamSize[0])
            };
            return result;
        } catch (error) {
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
        itemsPerPage 
    }: { 
        address: string; 
        page: number; 
        itemsPerPage: number 
    }, { rejectWithValue }) => {
        try {
            const { tetherWave } = getContracts();
            const startIndex = (page - 1) * itemsPerPage;
            
            const recentIncomes = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEventsPaginated',
                args: [address as `0x${string}`, BigInt(startIndex), BigInt(itemsPerPage)]
            }) as [string[], number[], bigint[], number[], bigint];

            return {
                userAddresses: recentIncomes[0],
                levelNumbers: recentIncomes[1],
                amounts: recentIncomes[2].map(amount => amount.toString()),
                timestamps: recentIncomes[3],
                totalCount: Number(recentIncomes[4])
            };
        } catch (error) {
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
        } catch (error) {
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
                isRegistered: userStats[0]
            };
        } catch (error) {
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
        } catch (error) {
            return rejectWithValue('Failed to fetch wallet data');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setReferrerAddress: (state, action: PayloadAction<string>) => {
            state.registration.referrerAddress = action.payload;
        },
        resetRegistrationError: (state) => {
            state.registration.error = null;
        },
        resetUpgradeError: (state) => {
            state.packages.error = null;
        },
        setRecentIncomePage: (state, action: PayloadAction<number>) => {
            state.recentIncome.pagination.currentPage = action.payload;
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
    setRecentIncomePage 
} = dashboardSlice.actions;
export default dashboardSlice.reducer;