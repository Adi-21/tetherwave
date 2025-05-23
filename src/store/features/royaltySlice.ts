import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContracts, publicClient } from '@/lib/constants/contracts';
import type { Address } from 'viem';
import type { LegProgress } from '@/types/contract';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { opBNB } from '@/lib/constants/contracts';

// Define state interface
interface RoyaltyState {
    qualifiedTiers: boolean[];
    royaltyInfo: {
        achievedTiers: boolean[];
        paidDays: string[];
        daysRemaining: string[];
        nextClaimTime: string[];
        totalEarned: string[]; // Changed to string[] to ensure serialization
        qualifiedNewTiers: boolean[];
    } | null;
    legProgress: {
        tier1: LegProgress;
        tier2: LegProgress;
        tier3: LegProgress;
        tier4: LegProgress;
    };
    tierAchieversCount: number[];
    isLoading: boolean;
    error: string | null;
}

const initialState: RoyaltyState = {
    qualifiedTiers: [],
    royaltyInfo: null,
    legProgress: {
        tier1: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 125, requiredLevel: 4, total: 250 },
        tier2: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 375, requiredLevel: 6, total: 750 },
        tier3: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 750, requiredLevel: 7, total: 1500 },
        tier4: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 1500, requiredLevel: 8, total: 3000 }
    },
    tierAchieversCount: [0, 0, 0, 0],
    isLoading: false,
    error: null
};

// Helper function to ensure BigInt values are converted to strings
const ensureString = (value: bigint | string): string => {
    return typeof value === 'bigint' ? value.toString() : value;
};

const parseTierData = (data: [bigint, bigint, bigint]) => {
    // Convert all values to numbers for easier comparison
    const values = data.map(val => Number(val.toString()));
    
    // Find the maximum value for strong leg
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    
    // Remove the max value and use remaining as weak legs
    const remainingValues = values.filter((_, index) => index !== maxIndex);
    
    return {
        strongLeg: maxValue.toString(),
        weakLeg1: remainingValues[0].toString(),
        weakLeg2: remainingValues[1].toString()
    };
};

// Async Thunks
export const fetchRoyaltyData = createAsyncThunk(
    'royalty/fetchData',
    async (address: Address) => {
        try {
            const { royalty, tetherWave } = getContracts();

            const qualifiedTiers = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'checkQualification',
                args: [address]
            }) as boolean[];

            const achieversCount = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getTierAchieversCount'
            }) as bigint[];

            const royaltyInfo = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getUserRoyaltyInfo',
                args: [address]
            }) as [boolean[], bigint[], bigint[], bigint[], bigint[], boolean[]];

            const tier1Data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getLevelActivatedCount',
                args: [address, BigInt(2)]
            }) as [bigint, bigint, bigint];

            const tier2Data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getLevelActivatedCount',
                args: [address, BigInt(3)]
            }) as [bigint, bigint, bigint];

            const tier3Data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getLevelActivatedCount',
                args: [address, BigInt(4)]
            }) as [bigint, bigint, bigint];

            const tier4Data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getLevelActivatedCount',
                args: [address, BigInt(5)]
            }) as [bigint, bigint, bigint];

            // Ensure all BigInt values are converted to strings
            const serializedRoyaltyInfo = {
                achievedTiers: royaltyInfo[0],
                paidDays: royaltyInfo[1].map(ensureString),
                daysRemaining: royaltyInfo[2].map(ensureString),
                nextClaimTime: royaltyInfo[3].map(ensureString),
                totalEarned: Array.isArray(royaltyInfo[4])
                    ? royaltyInfo[4].map(ensureString)
                    : [ensureString(royaltyInfo[4] as bigint)],
                qualifiedNewTiers: royaltyInfo[5]
            };

            const legProgress = {
                tier1: { ...parseTierData(tier1Data), requiredStrong: 125, requiredLevel: 4, total: 250 },
                tier2: { ...parseTierData(tier2Data), requiredStrong: 375, requiredLevel: 6, total: 750 },
                tier3: { ...parseTierData(tier3Data), requiredStrong: 750, requiredLevel: 7, total: 1500 },
                tier4: { ...parseTierData(tier4Data), requiredStrong: 1500, requiredLevel: 8, total: 3000 }
            };

            return {
                qualifiedTiers,
                royaltyInfo: serializedRoyaltyInfo,
                tierAchieversCount: achieversCount.map(count => Number(count.toString())),
                legProgress
            };
        } catch {
            throw new Error('Error fetching royalty data:');
        }
    }
);

export const registerTier = createAsyncThunk(
    'royalty/register',
    async (address: Address) => {
        try {
            const { royalty } = getContracts();
            const deployerPrivateKey = `0x${process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY?.replace('0x', '')}`;
            if (!deployerPrivateKey) {
                throw new Error('Configuration error');
            }
            const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
            const deployerWalletClient = createWalletClient({
                account: deployerAccount,
                chain: opBNB,
                transport: http()
            });

            const latestNonce = await publicClient.getTransactionCount({
                address: deployerAccount.address,
                blockTag: 'latest'
            });

            const hash = await deployerWalletClient.writeContract({
                address: royalty.address,
                abi: royalty.abi,
                functionName: 'registerQualifiedTiers',
                args: [address],
                nonce: latestNonce,
                maxFeePerGas: BigInt(5000000000),
                maxPriorityFeePerGas: BigInt(2500000000)
            });

            if (hash) {
                await publicClient.waitForTransactionReceipt({ hash });
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
);

export const distributeTierRoyalty = createAsyncThunk(
    'royalty/distribute',
    async (tier: number, { rejectWithValue }) => {
        try {
            const { royalty } = getContracts();

            const deployerPrivateKey = `0x${process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY?.replace('0x', '')}`;
            const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);

            const nextDistTime = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getNextDistributionTime',
                args: [tier]
            }) as bigint;

            const currentTime = BigInt(Math.floor(Date.now() / 1000));
            if (currentTime < nextDistTime) {
                return rejectWithValue('Distribution time not reached');
            }

            const latestNonce = await publicClient.getTransactionCount({
                address: deployerAccount.address,
                blockTag: 'latest'
            });

            const deployerWalletClient = createWalletClient({
                account: deployerAccount,
                chain: opBNB,
                transport: http()
            });

            const hash = await deployerWalletClient.writeContract({
                address: royalty.address,
                abi: royalty.abi,
                functionName: 'distributeTierRoyalties',
                args: [tier],
                account: deployerAccount,
                nonce: latestNonce,
                maxFeePerGas: BigInt(5000000000),
                maxPriorityFeePerGas: BigInt(2500000000)
            });
            if (hash) {
                const receipt = await publicClient.waitForTransactionReceipt({ hash });
                return receipt.status === 'success';
            }
            return false;
        } catch {
            return rejectWithValue('Distribution failed. Please try again later.');
        }
    }
);

// Slice
const royaltySlice = createSlice({
    name: 'royalty',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Data
            .addCase(fetchRoyaltyData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRoyaltyData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.qualifiedTiers = action.payload.qualifiedTiers;
                state.royaltyInfo = action.payload.royaltyInfo;
                state.tierAchieversCount = action.payload.tierAchieversCount;
                state.legProgress = action.payload.legProgress;
            })
            .addCase(fetchRoyaltyData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch royalty data';
            })
            // Register Tier
            .addCase(registerTier.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerTier.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerTier.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to register tier';
            })
            // Distribute Royalty
            .addCase(distributeTierRoyalty.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(distributeTierRoyalty.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(distributeTierRoyalty.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to distribute royalty';
            });
    }
});

export const { clearError } = royaltySlice.actions;
export default royaltySlice.reducer;