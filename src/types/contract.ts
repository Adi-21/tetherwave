export interface LevelInfo {
    id: number
    level: number
    name: string
    amount: number
    color: string
}

export interface UserStats {
    currentLevel: number;
    directReferrals: number;
    totalEarnings: string;
    directCommissionEarned: string;
    levelIncomeEarned: string;
    timestamp: number;
    totalTeamSize: number;
}

export interface RecentIncomeEvents {
    userAddresses: string[];
    amounts: string[];
    levelNumbers: number[];
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
    paidDays: string[];
    daysRemaining: string[];
    nextClaimTime: string[];
    totalEarned: string[];
    qualifiedNewTiers: boolean[];
}

export interface Sponsor {
    directSponsor: string[];
    matrixSponsor: string[];
}

export interface LevelActivatedCount {
    strongLeg: string;
    weakLeg1: string;
    weakLeg2: string;
}


export type FrontendIdContextType = {
    getFrontendId: (address: string) => Promise<string>;
    batchFetchFrontendIds: (addresses: string[]) => Promise<void>;
    frontendIdCache: Record<string, string>;
};

export interface LegProgress {
    total: number;
    requiredStrong: number;
    strongLeg: string;
    weakLeg1: string;
    weakLeg2: string;
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
    royaltyData: {
        qualifiedTiers: boolean[];
        royaltyInfo: RoyaltyInfo | null;
        legProgress: {
            tier1: LegProgress;
            tier2: LegProgress;
            tier3: LegProgress;
            tier4: LegProgress;
        };
    };
    calculations: {
        totalPoolAmount: () => string;
        strongLegProgress: (tier: LegProgress) => number;
        weakLegProgress: (tier: LegProgress) => number;
    };
    onRegister: (index: number) => Promise<void>;
    onDistribute: (index: number) => Promise<void>;
}

export interface RankIncomeProps {
    userStats: UserStats | null;
    levelIncomes: bigint[];
    isLoading: boolean;
}

export interface UserProfileData {
    userStats: UserStats | null;
    levelIncomes: bigint[];
    frontend_id: string;
    isLoading: boolean;
}

export interface RecentIncomeProps {
    recentIncomes: RecentIncomeEvents;
    currentLevel: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    isLoading: boolean;
}

export interface PackagesProps {
    currentLevel: number;
    handleUpgrade: (level: number, amount: number) => void;
}

export interface TierData {
    title: string;
    description: string;
    bg: string;
}

export interface RoyaltyState {
    qualifiedTiers: boolean[];
    royaltyInfo: RoyaltyInfo | null;
    error: string | null;
    legProgress: {
        tier1: LegProgress;
        tier2: LegProgress;
        tier3: LegProgress;
        tier4: LegProgress;
    };
}

export interface DownlineByDepthPaginated {
    downlineAddresses: string[];
    sponsorAddresses: string[];
    directReferralsCount: number[];
    currentLevels: number[];
    totalCount: number;
}

export interface DirectReferralDataPaginated {
    referralData: ReferralData[];
    totalCount: number;
}

export interface UserRoyaltyInfo {
    achievedTiers: boolean[];
    paidDays: string[];
    daysRemaining: string[];
    nextClaimTime: string[];
    totalEarned: string[];
    qualifiedNewTiers: boolean[];
}