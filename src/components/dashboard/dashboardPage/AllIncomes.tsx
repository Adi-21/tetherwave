import React from "react";
import type { UserStats } from "@/types/contract";

interface AllIncomesProps {
  userStats: UserStats | null;
  upgradeReferralIncome: bigint | null | undefined;
  totalTeamSize: number | undefined;
}

const AllIncomes = ({
  userStats,
  upgradeReferralIncome,
  totalTeamSize,
}: AllIncomesProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 w-full mt-4 lg:mt-8 text-nowrap">
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center">Total Income</p>
          <p className="font-bold text-green-600">
            +
            {/* {userStats?.totalEarnings
              ? formatUnits(userStats.totalEarnings, 18)
              : "0"}{" "} */}
            USDT
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center">Referral Income</p>
          <p className="font-bold text-green-600">
            +
            {/* {userStats?.directCommissionEarned
              ? formatUnits(userStats.directCommissionEarned, 18)
              : "0"}{" "} */}
            USDT
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center">Level Income</p>
          <p className="font-bold text-green-600">
            +
            {/* {userStats?.levelIncomeEarned
              ? formatUnits(userStats.levelIncomeEarned, 18)
              : "0"}{" "} */}
            USDT
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center">Direct Referral</p>
          <p className="font-bold">
            {userStats?.directReferrals?.toString() || "0"}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center text-nowrap">
            Upgrade Referral Income
          </p>
          <p className="font-bold text-green-600">
            + {upgradeReferralIncome}
            {/* {upgradeReferralIncome
              ? formatUnits(upgradeReferralIncome, 18)
              : "0"}{" "} */}
            USDT
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg bg-gradient-button">
        <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
          <p className="text-lg font-bold text-center">Total Team Size</p>
          <p className="font-bold">{totalTeamSize ?? "0"}</p>
        </div>
      </div>
    </div>
  );
};

export default AllIncomes;
