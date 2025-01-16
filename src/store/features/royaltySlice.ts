import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContracts } from '@/lib/constants/contracts';
import type { Address } from 'viem';
import type { LegProgress } from '@/types/contract';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { opBNBTestnet } from '@/lib/constants/contracts';

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
        tier1: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 3, requiredLevel: 2, total: 6 },
        tier2: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 4, requiredLevel: 3, total: 8 },
        tier3: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 5, requiredLevel: 4, total: 10 },
        tier4: { strongLeg: '0', weakLeg1: '0', weakLeg2: '0', requiredStrong: 6, requiredLevel: 5, total: 12 }
    },
    tierAchieversCount: [0, 0, 0, 0],
    isLoading: false,
    error: null
};

// Helper function to ensure BigInt values are converted to strings
const ensureString = (value: bigint | string): string => {
    return typeof value === 'bigint' ? value.toString() : value;
};

const parseTierData = (data: [bigint, bigint, bigint]) => ({
    strongLeg: data[0].toString(),
    weakLeg1: data[1].toString(),
    weakLeg2: data[2].toString()
});

// Async Thunks
export const fetchRoyaltyData = createAsyncThunk(
    'royalty/fetchData',
    async (address: Address) => {
        try {
            const { royalty, tetherWave } = getContracts();
            console.log('Fetching royalty data for:', address);
            
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

            console.log('Raw royalty info:', royaltyInfo);

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
                tier1: { ...parseTierData(tier1Data), requiredStrong: 3, requiredLevel: 2, total: 6 },
                tier2: { ...parseTierData(tier2Data), requiredStrong: 4, requiredLevel: 3, total: 8 },
                tier3: { ...parseTierData(tier3Data), requiredStrong: 5, requiredLevel: 4, total: 10 },
                tier4: { ...parseTierData(tier4Data), requiredStrong: 6, requiredLevel: 5, total: 12 }
            };

            return {
                qualifiedTiers,
                royaltyInfo: serializedRoyaltyInfo,
                tierAchieversCount: achieversCount.map(count => Number(count.toString())),
                legProgress
            };
        } catch (error) {
            console.error('Error fetching royalty data:', error);
            throw error;
        }
    }
);

export const registerTier = createAsyncThunk(
    'royalty/register',
    async (address: Address) => {
        const { royalty } = getContracts();
        const deployerPrivateKey = `0x${process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY?.replace('0x', '')}`;
        const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
        const deployerWalletClient = createWalletClient({
            account: deployerAccount,
            chain: opBNBTestnet,
            transport: http()
        });

        const hash = await deployerWalletClient.writeContract({
            address: royalty.address,
            abi: royalty.abi,
            functionName: 'registerQualifiedTiers',
            args: [address],
            maxFeePerGas: BigInt(5000000000),
            maxPriorityFeePerGas: BigInt(2500000000)
        });

        return hash;
    }
);

export const distributeTierRoyalty = createAsyncThunk(
    'royalty/distribute',
    async (tier: number) => {
        const { royalty } = getContracts();
        const deployerPrivateKey = `0x${process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY?.replace('0x', '')}`;
        const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
        const deployerWalletClient = createWalletClient({
            account: deployerAccount,
            chain: opBNBTestnet,
            transport: http()
        });

        const nextDistTime = await royalty.publicClient.readContract({
            ...royalty,
            functionName: 'getNextDistributionTime',
            args: [tier]
        }) as bigint;

        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        if (currentTime < nextDistTime) {
            throw new Error('Distribution time not reached');
        }

        const hash = await deployerWalletClient.writeContract({
            address: royalty.address,
            abi: royalty.abi,
            functionName: 'distributeTierRoyalties',
            args: [tier],
            maxFeePerGas: BigInt(5000000000),
            maxPriorityFeePerGas: BigInt(2500000000)
        });

        return hash;
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