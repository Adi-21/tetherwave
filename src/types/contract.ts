export interface LevelInfo {
    id: number
    level: number
    name: string
    amount: number
    color: string
}

export interface UserStats {
    currentLevel: number
    directReferrals: number
    totalEarnings: bigint
    directCommissionEarned: bigint
    levelIncomeEarned: bigint
    timestamp: number
}

export interface RecentIncomeEvents {
    userAddresses: `0x${string}`[];
    levelNumbers: number[];
    amounts: bigint[];
    timestamps: number[];
    totalCount: number;
}

export interface ReferralData {
    userAddress: string;
    activationTime: number;
    currentLevel: number;
    directReferrals: number;
}

export interface DownlineData {
    downlineAddresses: `0x${string}`[];
    sponsorAddresses: `0x${string}`[];
    directReferralsCount: number[];
    currentLevels: number[];
    totalCount: number;
}

export interface RoyaltyInfo {
    achievedTiers: boolean[];
    paidDays: bigint[];
    daysRemaining: bigint[];
    nextClaimTime: bigint[];
    totalEarned: bigint[];
    qualifiedNewTiers: boolean[];
}

export interface Sponsor {
    directSponsor: string[];
    matrixSponsor: string[];
}

export interface LevelActivatedCount {
    strongLeg: bigint;
    weakLeg1: bigint;
    weakLeg2: bigint;
}

export interface UserProfileData {
    frontend_id: string;
    created_at: string;
    wallet_address: string;
    referral_code: string;
}

export type FrontendIdContextType = {
    getFrontendId: (address: string) => Promise<string>;
    batchFetchFrontendIds: (addresses: string[]) => Promise<void>;
    frontendIdCache: Record<string, string>;
};

export interface LegProgress {
    total: number;
    requiredStrong: number;
    strongLeg: bigint;
    weakLeg1: bigint;
    weakLeg2: bigint;
    requiredLevel: number;
}

export interface FrontendIdDisplayProps {
    address?: string;
    isRegistered?: boolean;
}

export interface TierCardProps {
    slab: {
        title: string;
        description: string;
        bg: string;
    };
    index: number;
    data: {
        qualifiedTiers: boolean[];
        royaltyInfo: RoyaltyInfo | null;
        legProgress: {
            tier1: LegProgress;
            tier2: LegProgress;
            tier3: LegProgress;
            tier4: LegProgress;
        };
    };
    parsedRoyaltyInfo: RoyaltyInfo | null;
    calculateTotalPoolAmount: (index: number) => string;
    calculateStrongLegProgress: (tier: LegProgress) => number;
    calculateWeakLegProgress: (tier: LegProgress) => number;
}

export interface RankIncomeProps {
    userStats: UserStats | null;
    levelIncomes: bigint[];
}

export interface RecentIncomeProps {
    recentIncomes: RecentIncomeEvents;
    currentLevel: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage: number;
}

export interface PackagesProps {
    currentLevel: number;
    handleUpgrade: (level: number, amount: number) => void;
}