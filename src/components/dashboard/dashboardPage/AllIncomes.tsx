import { memo } from "react";
import type { UserStats } from "@/types/contract";
import Skeleton from "@/components/common/Skeleton";
import { GRADIENTS } from '@/lib/constants';

interface AllIncomesProps {
  userStats: UserStats | null;
  upgradeReferralIncome: bigint | null | undefined;
  totalTeamSize: number | undefined;
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

IncomeCard.displayName = 'IncomeCard';

const AllIncomes = memo(({
  userStats,
  upgradeReferralIncome,
  totalTeamSize,
  isLoading
}: AllIncomesProps) => (
  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 w-full mt-4 lg:mt-8 text-nowrap">
    {isLoading ? (
      <>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </>
    ) : (
      <>
        <IncomeCard title="Total Income" value="0" isAmount />
        <IncomeCard title="Referral Income" value="0" isAmount />
        <IncomeCard title="Level Income" value="0" isAmount />
        <IncomeCard title="Direct Referral" value={userStats?.directReferrals?.toString() || "0"} />
        <IncomeCard title="Upgrade Referral Income" value={upgradeReferralIncome?.toString() || "0"} isAmount />
        <IncomeCard title="Total Team Size" value={totalTeamSize?.toString() || "0"} />
      </>
    )}
  </div>
));

AllIncomes.displayName = 'AllIncomes';

export default AllIncomes;
