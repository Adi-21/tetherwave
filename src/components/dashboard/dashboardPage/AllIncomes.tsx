import { memo } from "react";
import type { UserStats } from "@/types/contract";
import Skeleton from "@/components/common/Skeleton";
import { LuWallet } from "react-icons/lu";
import { GRADIENTS } from '@/lib/constants';

interface AllIncomesProps {
  userStats: UserStats | null;
  upgradeReferralIncome: bigint | null;
  totalTeamSize: number;
  isLoading: boolean;
}

interface IncomeCardProps {
  title: string;
  value: string;
  isAmount?: boolean;
}

const IncomeCard = memo(({ title, value, isAmount = false }: IncomeCardProps) => (
  <div className={`flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg ${GRADIENTS.button}`}>
    <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
      <p className="text-lg font-bold text-center text-nowrap">{title}</p>
      <p className={`font-bold ${isAmount ? 'text-green-600' : ''}`}>
        {isAmount && '+'}{value} {isAmount && 'USDT'}
      </p>
    </div>
  </div>
));

const formatBigIntToUSDT = (value: bigint | null | undefined): string => {
  if (!value) return "0.00";
  return (Number(value) / 1e18).toFixed(2);
};

const AllIncomes = memo(({
  userStats,
  upgradeReferralIncome,
  totalTeamSize,
  isLoading
}: AllIncomesProps) => (
  <div className="mt-4 lg:mt-8 w-full">
    <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
      <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
        <LuWallet className="h-5 w-5" />
        <span>Reward Overview</span>
      </div>
      <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <IncomeCard 
              title="Total Reward" 
              value={userStats?.totalEarnings ? formatBigIntToUSDT(BigInt(userStats.totalEarnings)) : "0"} 
              isAmount 
            />
            <IncomeCard 
              title="Referral Reward" 
              value={userStats?.directCommissionEarned ? formatBigIntToUSDT(BigInt(userStats.directCommissionEarned)) : "0"} 
              isAmount 
            />
            <IncomeCard 
              title="Upgrade Referral Reward" 
              value={upgradeReferralIncome ? formatBigIntToUSDT(upgradeReferralIncome) : "0"} 
              isAmount 
            />
            <IncomeCard 
              title="Level Reward" 
              value={userStats?.levelIncomeEarned ? formatBigIntToUSDT(BigInt(userStats.levelIncomeEarned)) : "0"} 
              isAmount 
            />
            <IncomeCard 
              title="Magic Reward" 
              value={userStats?.magicIncome ? formatBigIntToUSDT(BigInt(userStats.magicIncome)) : "0"} 
              isAmount 
            />
            <IncomeCard 
              title="Direct Referral" 
              value={userStats?.directReferrals?.toString() || "0"} 
            />
            <IncomeCard 
              title="Total Team Size" 
              value={totalTeamSize?.toString() || "0"} 
            />
          </>
        )}
      </div>
    </div>
  </div>
));

IncomeCard.displayName = 'IncomeCard';
AllIncomes.displayName = 'AllIncomes';

export default AllIncomes;
