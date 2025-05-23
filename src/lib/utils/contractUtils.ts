import { privateKeyToAccount } from 'viem/accounts';
import { getContracts, opBNB } from '../constants/contracts';
import { publicClient } from '../constants/contracts';
import type { ReferralData, Sponsor, RecentIncomeEvents, DownlineData, RoyaltyInfo, LevelInfo, DownlineByDepthPaginated, DirectReferralDataPaginated, LevelActivatedCount, UserRoyaltyInfo, UserCompleteStats } from '@/types/contract';
import { createWalletClient, http, type Address } from 'viem';

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

export const contractUtils = {
    async getUserStats(address: Address): Promise<UserCompleteStats | null> {
        try {
            const { tetherWave } = getContracts();
            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [number, number, bigint, bigint, bigint, number, bigint];

            return {
                currentLevel: Number(stats[0]),
                directReferrals: Number(stats[1]),
                totalEarnings: stats[2].toString(),
                directCommissionEarned: stats[3].toString(),
                levelIncomeEarned: stats[4].toString(),
                timestamp: Number(stats[5]),
                totalTeamSize: Number(stats[6] || 0)
            };
        } catch {
            return null;
        }
    },

    async register(address: Address, referrerAddress: string, currentUsdtBalance: string): Promise<void> {
        if (!address || !referrerAddress) return;
        
        try {
            const { tetherWave, usdt } = getContracts();
            
            const currentBalance = BigInt(Number.parseFloat(currentUsdtBalance) * 10 ** 18);
            
            if (currentBalance < REGISTRATION_COST) {
                throw new Error(`Insufficient USDT balance for registration. You need ${Number(REGISTRATION_COST) / 10 ** 18} USDT but have ${currentUsdtBalance} USDT`);
            }

            // First approve USDT with higher amount (10,000 USDT)
            const approveAmount = BigInt(10000 * 10 ** 18);
            const allowance = await usdt.publicClient.readContract({
                ...usdt,
                functionName: 'allowance',
                args: [address as `0x${string}`, tetherWave.address]
            }) as bigint;
    
            if (allowance < approveAmount) {
                const approveHash = await usdt.walletClient.writeContract({
                    ...usdt,
                    functionName: 'approve',
                    args: [tetherWave.address, approveAmount],
                    account: address as `0x${string}`
                });
                await publicClient.waitForTransactionReceipt({ hash: approveHash });
            }
    
            // Then register
            const { request } = await tetherWave.publicClient.simulateContract({
                ...tetherWave,
                functionName: 'register',
                args: [referrerAddress],
                account: address as `0x${string}`
            });
    
            const registerHash = await tetherWave.walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash: registerHash });
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to register');
        }
    },

    async upgrade(address: Address, targetLevel: number, currentUsdtBalance: string): Promise<void> {
        try {
            const { tetherWave } = getContracts();
            
            const requiredAmount = LEVEL_COSTS[targetLevel as keyof typeof LEVEL_COSTS];
            if (!requiredAmount) {
                throw new Error('Invalid upgrade level');
            }

            const currentBalance = BigInt(Number.parseFloat(currentUsdtBalance) * 10 ** 18);
            if (currentBalance < requiredAmount) {
                const errorMessage = `Insufficient USDT balance for upgrading to level ${targetLevel}. You need ${Number(requiredAmount) / 10 ** 18} USDT but have ${currentUsdtBalance} USDT`;
                throw new Error(errorMessage);
            }

            const upgradeHash = await tetherWave.walletClient.writeContract({
                ...tetherWave,
                functionName: 'upgrade',
                args: [targetLevel],
                account: address
            });
            await publicClient.waitForTransactionReceipt({ hash: upgradeHash });
        } catch {
            throw new Error('Failed to upgrade');
        }
    },

    async approve(address: Address, amount: bigint): Promise<void> {
        const { tetherWave, usdt } = getContracts();
        await usdt.walletClient.writeContract({
            ...usdt,
            functionName: 'approve',
            args: [tetherWave.address, amount],
            account: address
        });
    },

    async getLevelIncomes(address: Address): Promise<bigint[]> {
        if (!address) return []
        try {
            const { tetherWave } = getContracts()
            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserTeamStats',
                args: [address]
            }) as [number[], bigint[]]

            return stats[1]
        } catch {
            return []
        }
    },

    async getRecentIncomeEventsPaginated(
        userAddress: Address,
        startIndex: bigint,
        limit: bigint,
        filterTypes: number[] = []
    ): Promise<RecentIncomeEvents> {
        try {
            const { tetherWave } = getContracts();

            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEventsPaginated',
                args: [userAddress, startIndex, limit, filterTypes],
            }) as [Address[], number[], bigint[], number[], number[], bigint];

            const [userAddresses, levelNumbers, amounts, timestamps, incomeTypes, totalCount] = data;

            return {
                userAddresses,
                levelNumbers: levelNumbers.map(Number),
                amounts: amounts.map(amount => amount.toString()),
                timestamps: timestamps.map(Number),
                incomeTypes: incomeTypes.map(Number),
                totalCount: Number(totalCount)
            };
        } catch {
            return {
                userAddresses: [],
                levelNumbers: [],
                amounts: [],
                timestamps: [],
                incomeTypes: [],
                totalCount: 0
            };
        }
    },
    
    async getDownlineData(address: Address): Promise<DownlineData> {
        const { tetherWave } = getContracts();
        const data = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getDownlineData',
            args: [address]
        }) as DownlineData;
        return data;
    },

    async getRoyaltyInfo(address: Address): Promise<RoyaltyInfo> {
        const { tetherWave } = getContracts();
        const info = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getRoyaltyInfo',
            args: [address]
        }) as RoyaltyInfo;
        return info;
    },

    async getSponsor(address: Address): Promise<Sponsor> {
        const { tetherWave } = getContracts();
        const sponsor = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getSponsor',
            args: [address]
        }) as Sponsor;
        return sponsor;
    },

    async getLevelInfo(level: number): Promise<LevelInfo> {
        const { tetherWave } = getContracts();
        const info = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getLevelInfo',
            args: [level]
        }) as LevelInfo;
        return info;
    },      

    async getLevelActivatedCount(userAddress: Address, level: number): Promise<LevelActivatedCount | null> {
        if (!userAddress) return null;
        try {
            const { tetherWave } = getContracts();
            const count = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getLevelActivatedCount',
                args: [userAddress, BigInt(level)]
            }) as [bigint, bigint, bigint];
            
            return {
                strongLeg: count[0].toString()  ,
                weakLeg1: count[1].toString(),
                weakLeg2: count[2].toString()
            };
        } catch {
            return null;
        }
    },

    async getReferralData(address: Address): Promise<ReferralData> {
        const { tetherWave } = getContracts();
        const data = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getReferralData',
            args: [address]
        }) as ReferralData;
        return data;
    },  

    async getTeamSizes(userAddress: Address): Promise<number[]> {
        if (!userAddress) return [];
        try {
            const { tetherWave } = getContracts();
            const totalTeamSize = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getTeamSizes',
                args: [userAddress]
            }) as number[];

            return totalTeamSize;
        } catch {
            return [];
        }
    },

    async getDownlineByDepthPaginated(
        userAddress: Address,
        depth: number,
        startIndex: bigint,
        limit: bigint
    ): Promise<DownlineByDepthPaginated> {
        try {
            const { tetherWave } = getContracts();

            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getDownlineByDepthPaginated',
                args: [userAddress, depth, startIndex, limit],
            }) as [Address[], Address[], number[], number[], bigint];

            const [downlineAddresses, sponsorAddresses, directReferralsCount, currentLevels, totalCount] = data;

            return {
                downlineAddresses,
                sponsorAddresses,
                directReferralsCount,
                currentLevels,
                totalCount: Number(totalCount)
            };
        } catch {
            return {
                downlineAddresses: [],
                sponsorAddresses: [],
                directReferralsCount: [],
                currentLevels: [],
                totalCount: 0
            };
        }
    },

    async getDirectReferralDataPaginated(
        userAddress: Address,
        startIndex: bigint,
        limit: bigint
    ): Promise<DirectReferralDataPaginated> {
        try {
            const { tetherWave } = getContracts();

            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getDirectReferralDataPaginated',
                args: [userAddress, startIndex, limit],
            }) as [ReferralData[], bigint];

            const [referralData, totalCount] = data;

            return {
                referralData,
                totalCount: Number(totalCount)
            };
        } catch {
            return {
                referralData: [],
                totalCount: 0
            };
        }
    },

    async checkRoyaltyQualification(userAddress: Address): Promise<boolean[]> {
        try {
            const { royalty } = getContracts();
            
            if (!royalty.address) {
                return [];
            }

            const qualifiedTiers = await royalty.publicClient.readContract({
                address: royalty.address,
                abi: royalty.abi,
                functionName: 'checkQualification',
                args: [userAddress]
            }) as boolean[];

            return qualifiedTiers;
        } catch {
            return [];
        }
    },

    async registerRoyaltyTiers(userAddress: Address): Promise<boolean> {
        try {
            const { royalty } = getContracts();
            let deployerPrivateKey = process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY;

            if (!deployerPrivateKey) {
                throw new Error('Configuration error');
            }

            deployerPrivateKey = `0x${deployerPrivateKey.replace('0x', '')}`;
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
                args: [userAddress],
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
    },

    async getUserRoyaltyInfo(userAddress: Address): Promise<UserRoyaltyInfo> {
        try {
            const { royalty } = getContracts();
            const result = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getUserRoyaltyInfo',
                args: [userAddress],
            }) as [boolean[], bigint[], bigint[], bigint[], bigint[], boolean[]];

            return {
                achievedTiers: result[0],
                paidDays: result[1].map(day => day.toString())  ,
                daysRemaining: result[2].map(day => day.toString()),
                nextClaimTime: result[3].map(time => time.toString()),
                totalEarned: result[4].map(earned => earned.toString()),
                qualifiedNewTiers: result[5]
            };
        } catch {
            throw new Error('Failed to fetch royalty info');
        }
    },

    async getTierAchieversCount(): Promise<number[]> {
        try {
            const { royalty } = getContracts();
            const count = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getTierAchieversCount',
            }) as number[];
            return count;
        } catch {
            return [0, 0, 0, 0];
        }
    },

    async distributeTierRoyalties(tier: number): Promise<boolean> {
        try {
            const { royalty } = getContracts();
            let deployerPrivateKey = process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY;
            
            if (!deployerPrivateKey) {
                throw new Error('Configuration error');
            }

            deployerPrivateKey = `0x${deployerPrivateKey.replace('0x', '')}`;
            const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
            
            const nextDistTime = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getNextDistributionTime',
                args: [tier]
            }) as bigint;

            const currentTime = BigInt(Math.floor(Date.now() / 1000));
            if (currentTime < nextDistTime) {
                return false;
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
            return false;
        }
    },

    async getNextDistributionTime(tier: number): Promise<bigint> {
        try {
            const { royalty } = getContracts();
            const time = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getNextDistributionTime',
                args: [tier],
            }) as bigint;
            return time;
        } catch {
            return BigInt(0);
        }
    },

    async getSponsors(address: Address): Promise<Sponsor | null> {
        if (!address) return null
        try {
            const { tetherWave } = getContracts()
            const matrixPosition = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getMatrixPosition',
                args: [address]
            }) as [string, string, number, [number, number, number]]
            
            return {
                directSponsor: [matrixPosition[0]],
                matrixSponsor: [matrixPosition[1]]
            }
        } catch {
            throw new Error('Failed to fetch sponsors');
        }
    },

    async getUpgradeReferralIncome(userAddress: Address): Promise<bigint> {
        if (!userAddress) return BigInt(0);
        try {
            const { tetherWave } = getContracts();
            const upgradeReferralIncome = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUpgradeReferralIncome',
                args: [userAddress]
            }) as bigint;

            return upgradeReferralIncome;
        } catch {
            return BigInt(0);
        }
    },

};